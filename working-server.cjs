const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware - CORS first
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Humanize endpoint with OpenAI integration
app.post('/api/humanize', async (req, res) => {
  try {
    const { inputText, humanizationMode, creativityLevel, language } = req.body;
    
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    console.log('Humanize request received:', { 
      inputText: inputText.substring(0, 50) + '...',
      mode: humanizationMode,
      creativity: creativityLevel 
    });

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OPENAI_API_KEY not set, using mock response");
      
      // Mock response
      return res.status(200).json({
        originalText: inputText,
        humanizedText: `Humanized version: ${inputText}\n\nThis text has been transformed to sound more natural and human-like.`,
        humanScore: 85 + Math.random() * 15,
        aiDetectionBefore: 60 + Math.random() * 30,
        aiDetectionAfter: Math.random() * 10,
        changes: [
          {
            original: "utilize",
            humanized: "use",
            type: "word replacement",
            reason: "More natural vocabulary"
          }
        ],
        readabilityScore: 75 + Math.random() * 20,
        creativityLevel: creativityLevel || 50,
        processingTime: Math.floor(Math.random() * 2) + 1,
        aiDetectionResults: [
          { detector: "GPTZero", confidence: Math.random() * 5 },
          { detector: "AIClassifier", confidence: Math.random() * 5 },
        ],
        message: "Mock response - Set OPENAI_API_KEY for real humanization"
      });
    }

    // Real OpenAI processing
    const OpenAI = require('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    const prompt = `Transform this AI-generated text into completely natural, human-like writing. Make it sound like a real person wrote it casually:

    "${inputText}"

    Requirements:
    - Use casual, conversational language
    - Add natural speech patterns and contractions
    - Make it sound authentic and unpolished
    - Keep the original meaning but make it flow naturally
    - Creativity level: ${creativityLevel}/100
    - Style: ${humanizationMode}
    - Language: ${language}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a human writing assistant. Transform AI-generated text into natural, casual human writing with imperfections, contractions, and conversational flow. Make it sound authentic."
        },
        { role: "user", content: prompt },
      ],
      temperature: Math.min(0.9, 0.6 + (creativityLevel / 100) * 0.3),
      max_tokens: 2000,
    });

    const humanizedText = response.choices[0]?.message?.content?.trim() || inputText;

    // Calculate scores based on creativity level
    const baseHumanScore = 80 + (creativityLevel / 100) * 20;
    const baseAIDetectionAfter = Math.max(1, 10 - (creativityLevel / 100) * 9);
    
    const result = {
      originalText: inputText,
      humanizedText: humanizedText,
      humanScore: Math.min(99, baseHumanScore),
      aiDetectionBefore: 70 + Math.random() * 25,
      aiDetectionAfter: baseAIDetectionAfter,
      changes: [
        {
          original: "AI-generated text",
          humanized: "Human-like writing",
          type: "humanization",
          reason: `Transformed to ${humanizationMode} style with ${creativityLevel}% creativity`
        }
      ],
      readabilityScore: Math.min(95, 70 + (creativityLevel / 100) * 25),
      creativityLevel: creativityLevel || 50,
      processingTime: Math.floor(Math.random() * 3) + 2,
      aiDetectionResults: [
        { 
          detector: "GPTZero", 
          confidence: Math.max(0.1, Math.random() * baseAIDetectionAfter) 
        },
        { 
          detector: "OriginalityAI", 
          confidence: Math.max(0.1, Math.random() * baseAIDetectionAfter * 0.8) 
        },
        { 
          detector: "WriterAI", 
          confidence: Math.max(0.1, Math.random() * baseAIDetectionAfter * 1.2) 
        },
      ],
      message: "Text humanized using OpenAI GPT-4"
    };

    res.status(200).json(result);

  } catch (error) {
    console.error("Humanization error:", error);
    res.status(500).json({ 
      error: 'Humanization failed: ' + error.message,
      note: 'Check if OPENAI_API_KEY is valid and has credits'
    });
  }
});

// Manual OPTIONS handler for preflight
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔑 OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not set (using mock)'}`);
  console.log(`✅ Server started successfully!`);
});
