// pages/api/summarize.js or app/api/summarize/route.js (depending on your Next.js version)
import OpenAI from 'openai';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log("CORS headers set"); 
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests (for testing)
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "Summarize API is running!",
      usage: "Send POST request with JSON body",
      example: {
        text: "Your text to summarize here...",
        length: "medium", // short, medium, long
        mode: "paragraph" // paragraph, bullet, custom
      }
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      console.log("Summarization request received");
      const { text, length = 'medium', mode = 'paragraph' } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Validate length parameter
      const validLengths = ['short', 'medium', 'long'];
      if (!validLengths.includes(length)) {
        return res.status(400).json({ error: 'Length must be one of: short, medium, long' });
      }

      // Validate mode parameter
      const validModes = ['paragraph', 'bullet', 'custom'];
      if (!validModes.includes(mode)) {
        return res.status(400).json({ error: 'Mode must be one of: paragraph, bullet, custom' });
      }

      // For testing without OpenAI API key
      if (!process.env.VITE_OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY not set, returning mock response");
        return res.status(200).json({
          originalLength: text.length,
          summaryLength: Math.floor(text.length * 0.3),
          summary: generateMockSummary(text, length, mode),
          reduction: Math.round((1 - (text.length * 0.3) / text.length) * 100),
          mode: mode,
          length: length,
          message: "Using mock response - Set OPENAI_API_KEY for real summarization"
        });
      }

      const openai = new OpenAI({ 
        apiKey: process.env.VITE_OPENAI_API_KEY 
      });

      // Create system prompt based on mode and length
      const systemPrompt = createSystemPrompt(length, mode);
      // Create user prompt
      const userPrompt = `Please summarize the following text:\n\n"${text}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          { 
            role: "user", 
            content: userPrompt 
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent summaries
        max_tokens: getMaxTokens(length),
        top_p: 0.9,
      });

      const summary = response.choices[0]?.message?.content?.trim() || text;

      // Format summary based on mode
      const formattedSummary = formatSummary(summary, mode);

      const result = {
        originalLength: text.length,
        summaryLength: formattedSummary.length,
        summary: formattedSummary,
        reduction: Math.round(((text.length - formattedSummary.length) / text.length) * 100),
        mode: mode,
        length: length,
        wordCount: {
          original: text.split(/\s+/).filter(word => word).length,
          summary: formattedSummary.split(/\s+/).filter(word => word).length
        },
        processingTime: Math.floor(Math.random() * 2) + 1, // Simulate processing time
      };

      return res.status(200).json(result);

    } catch (error) {
      console.error("Summarization error:", error);
      
      // Fallback to mock data on API error
      const { text, length = 'medium', mode = 'paragraph' } = req.body;
      return res.status(200).json({
        originalLength: text.length,
        summaryLength: Math.floor(text.length * 0.3),
        summary: generateMockSummary(text, length, mode),
        reduction: Math.round((1 - (text.length * 0.3) / text.length) * 100),
        mode: mode,
        length: length,
        wordCount: {
          original: text.split(/\s+/).filter(word => word).length,
          summary: Math.floor(text.split(/\s+/).filter(word => word).length * 0.4)
        },
        processingTime: 1,
        note: "Using fallback summary due to API error"
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to create system prompt based on length and mode
function createSystemPrompt(length, mode) {
  const lengthInstructions = {
    short: "Create a very concise summary (2-3 sentences maximum). Focus only on the most essential information.",
    medium: "Create a balanced summary (4-6 sentences). Include key points and important details.",
    long: "Create a comprehensive summary (7-10 sentences). Include main ideas and supporting details."
  };

  const modeInstructions = {
    paragraph: "Present the summary as a coherent, flowing paragraph.",
    bullet: "Present the summary as bullet points. Start each point with '• '.",
    custom: "Present the summary as a numbered list. Start each point with a number and period."
  };

  return `You are an expert summarization assistant. Your task is to create clear, accurate summaries that preserve the essential meaning of the original text.

CRITICAL REQUIREMENTS:
1. ${lengthInstructions[length]}
2. ${modeInstructions[mode]}
3. Maintain the original meaning and key information
4. Use clear, concise language
5. Avoid adding new information or opinions
6. Focus on the main ideas and key points
7. Ensure the summary is self-contained and understandable

SUMMARY APPROACH:
- Identify the core message and main points
- Remove redundant information and examples
- Preserve important facts, dates, names, and statistics
- Maintain logical flow and coherence
- Use simpler language when possible without losing meaning

The summary should be significantly shorter than the original while capturing all essential information.`;
}

// Helper function to determine max tokens based on length
function getMaxTokens(length) {
  const tokenMap = {
    short: 150,
    medium: 300,
    long: 500
  };
  return tokenMap[length] || 300;
}

// Helper function to format summary based on mode
function formatSummary(summary, mode) {
  if (mode === 'bullet') {
    // Ensure bullet point format
    if (!summary.includes('•') && !summary.includes('-')) {
      const sentences = summary.split(/[.!?]+/).filter(s => s.trim());
      return sentences.map(s => `• ${s.trim()}`).join('\n');
    }
  } else if (mode === 'custom') {
    // Ensure numbered list format
    if (!summary.match(/^\d+\./)) {
      const sentences = summary.split(/[.!?]+/).filter(s => s.trim());
      return sentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
    }
  }
  // For paragraph mode, ensure it ends with proper punctuation
  return summary.replace(/\s*$/, '.');
}

// Fallback mock summary generator
function generateMockSummary(text, length, mode) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  const lengthMap = {
    short: 2,
    medium: 4,
    long: 7
  };
  
  const sentenceCount = lengthMap[length] || 4;
  const selectedSentences = sentences.slice(0, sentenceCount);
  
  if (mode === 'bullet') {
    return selectedSentences.map(s => `• ${s.trim()}`).join('\n');
  } else if (mode === 'custom') {
    return selectedSentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
  } else {
    return selectedSentences.join('. ') + '.';
  }
}
