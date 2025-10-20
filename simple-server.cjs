const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
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

// Humanize endpoint
app.post('/api/humanize', async (req, res) => {
  try {
    const { inputText, humanizationMode, creativityLevel, language } = req.body;
    
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    // Mock response
    res.status(200).json({
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
      message: "Mock response - Working!"
    });

  } catch (error) {
    console.error("Humanization error:", error);
    res.status(500).json({ error: 'Humanization failed' });
  }
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});
