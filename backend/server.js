import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import { researchCompanyStream } from './agent.js';

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://invest-iq-gamma.vercel.app',
  'http://localhost:5173',
  // support any custom FRONTEND_URL set via env var
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Protect the research route with Clerk authentication
// This middleware ensures a valid Clerk session token is provided in the Authorization header
app.post('/api/research', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    console.log(`Researching company: ${companyName}`);
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Stream chunks back to client
    let finalDecision = "Pass";
    let finalReasoning = "";

    for await (const chunk of researchCompanyStream(companyName)) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      
      if (chunk.type === 'error') {
        throw new Error(chunk.data);
      }
      
      if (chunk.type === 'done') {
        finalDecision = chunk.decision;
        finalReasoning = chunk.reasoning;
      }
    }

    // Save report to database after stream finishes
    const savedReport = await prisma.researchReport.create({
      data: {
        userId: req.auth.userId,
        companyName,
        decision: finalDecision,
        reasoning: finalReasoning
      }
    });

    res.write(`data: ${JSON.stringify({ type: 'saved', id: savedReport.id })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error during research:', error);

    // Detect Gemini API rate limit errors (429)
    const errMsg = error?.message || '';
    const isRateLimit =
      error?.status === 429 ||
      errMsg.includes('429') ||
      errMsg.toLowerCase().includes('rate limit') ||
      errMsg.toLowerCase().includes('quota') ||
      errMsg.toLowerCase().includes('resource_exhausted');

    if (isRateLimit) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'API rate limit reached. Please wait a minute and try again.' })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to conduct research.', details: errMsg })}\n\n`);
    }
    res.end();
  }
});

// Fetch user's research history
app.get('/api/history', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const history = await prisma.researchReport.findMany({
      where: { userId: req.auth.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// Fetch stock chart data for a company
app.get('/api/stock-chart', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { companyName } = req.query;
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    // 1. Get Ticker Symbol
    const searchResponse = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(companyName)}&quotesCount=1`);
    const searchData = await searchResponse.json();
    
    if (!searchData.quotes || searchData.quotes.length === 0) {
      return res.status(404).json({ error: 'Could not find stock ticker for this company.' });
    }
    
    const symbol = searchData.quotes[0].symbol;

    // 2. Fetch Historical Data (3 months, 1 day interval)
    const chartResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`);
    const chartData = await chartResponse.json();

    if (!chartData.chart || !chartData.chart.result || chartData.chart.result.length === 0) {
      return res.status(404).json({ error: 'Could not fetch historical data for this ticker.' });
    }

    const result = chartData.chart.result[0];
    const timestamps = result.timestamp;
    const closePrices = result.indicators.quote[0].close;

    // 3. Format for Recharts
    const formattedData = [];
    if (timestamps && closePrices) {
      for (let i = 0; i < timestamps.length; i++) {
        if (closePrices[i] !== null) {
          const date = new Date(timestamps[i] * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          formattedData.push({
            date,
            price: Number(closePrices[i].toFixed(2))
          });
        }
      }
    }

    res.json({ symbol, data: formattedData });
  } catch (error) {
    console.error('Error fetching stock chart data:', error);
    res.status(500).json({ error: 'Failed to fetch stock chart data.' });
  }
});

// Delete a research history item
app.delete('/api/history/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure the report belongs to the user
    const report = await prisma.researchReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    if (report.userId !== req.auth.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this report.' });
    }

    await prisma.researchReport.delete({
      where: { id }
    });

    res.json({ message: 'Report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report.' });
  }
});

// Error handling middleware (e.g. for Clerk auth errors)
app.use((err, req, res, next) => {
  console.error("Clerk Auth Error:", err.message);
  res.status(401).send('Unauthenticated!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
