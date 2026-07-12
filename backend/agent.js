import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Tool } from "@langchain/core/tools";

// A simple custom search tool simulating web research if DuckDuckGo isn't available, 
// but we'll try to use a basic fetch-based Wikipedia search as a reliable free fallback
class WikipediaTool extends Tool {
  name = "wikipedia-search";
  description = "Useful for getting information about a company's business model, history, and current status. Input should be a search query.";

  async _call(query) {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
      const data = await response.json();
      if (data.query && data.query.search && data.query.search.length > 0) {
        // Return snippets from top 3 results
        return data.query.search.slice(0, 3).map(res => res.snippet.replace(/<[^>]*>?/gm, '')).join('\n\n');
      }
      return "No information found on Wikipedia.";
    } catch (e) {
      return "Error fetching from Wikipedia.";
    }
  }
}

class YahooFinanceTool extends Tool {
  name = "yahoo-finance-search";
  description = "Useful for getting stock symbols and brief financial news/context. Input should be a company name.";

  async _call(query) {
    try {
      const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=1&newsCount=3`);
      const data = await response.json();
      let info = "";
      if (data.quotes && data.quotes.length > 0) {
        info += `Symbol: ${data.quotes[0].symbol}, Sector: ${data.quotes[0].sector || 'N/A'}\n`;
      }
      if (data.news && data.news.length > 0) {
        info += "Recent News:\n" + data.news.map(n => `- ${n.title}`).join('\n');
      }
      return info || "No financial information found.";
    } catch (e) {
      return "Error fetching financial data.";
    }
  }
}

export async function* researchCompanyStream(companyName) {
  // Initialize Groq model
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    apiKey: process.env.GROQ_API_KEY,
  });

  const tools = [new WikipediaTool(), new YahooFinanceTool()];

  // Create the LangGraph React Agent
  const agent = createReactAgent({
    llm: model,
    tools,
  });

  const systemPrompt = `You are an expert AI Investment Research Analyst. Your job is to research the given company and make a recommendation to either "Invest" or "Pass".
Provide a detailed paragraph explaining why based on the researched data. 
You MUST conclude your final response EXACTLY with:
DECISION: Invest
or
DECISION: Pass`;

  try {
    const stream = await agent.streamEvents({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Research ${companyName} and decide whether it is a good investment.` }
      ]
    }, { version: "v2" });

    let fullResponse = "";
    
    for await (const event of stream) {
      if (event.event === "on_chat_model_stream") {
        const chunk = event.data.chunk;
        if (chunk && chunk.content && typeof chunk.content === 'string') {
          fullResponse += chunk.content;
          yield { type: 'chunk', data: chunk.content };
        }
      } else if (event.event === "on_tool_start") {
        yield { type: 'tool', data: `Analyzing using ${event.name}...` };
      }
    }

    // Extract decision from the final response
    let decision = "Pass"; // Default fallback
    const upperResp = fullResponse.toUpperCase();
    if (upperResp.includes("DECISION: INVEST")) {
      decision = "Invest";
    }

    // Clean up the text by removing the decision line so the UI looks nice
    const reasoning = fullResponse.replace(/DECISION:\s*(Invest|Pass)/i, '').trim();

    yield { type: 'done', decision, reasoning };

  } catch (error) {
    console.error("Agent execution failed:", error);
    yield { type: 'error', data: error.message };
  }
}
