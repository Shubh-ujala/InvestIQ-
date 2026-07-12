import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import { researchCompany } from './agent.js';

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

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
    
    // Call the LangChain agent
    const report = await researchCompany(companyName);
    
    // Save report to database
    const savedReport = await prisma.researchReport.create({
      data: {
        userId: req.auth.userId, // Provided by ClerkAuth middleware
        companyName,
        decision: report.decision,
        reasoning: report.reasoning
      }
    });

    res.json(savedReport);
  } catch (error) {
    console.error('Error during research:', error);
    res.status(500).json({ error: 'Failed to conduct research.', details: error.message });
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

// Error handling middleware (e.g. for Clerk auth errors)
app.use((err, req, res, next) => {
  console.error("Clerk Auth Error:", err.message);
  res.status(401).send('Unauthenticated!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
