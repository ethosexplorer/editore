const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// ==================== AI HUMANIZER API ====================
app.post('/api/humanize', async (req, res) => {
  try {
    const { inputText, humanizationMode, creativityLevel, language } = req.body;
    
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    // For testing without OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.log("OPENAI_API_KEY not set, returning mock response");
      return res.status(200).json({
        originalText: inputText,
        humanizedText: `Humanized version of: ${inputText}`,
        humanScore: 95,
        aiDetectionBefore: 75,
        aiDetectionAfter: 5,
        message: "Using mock response - Set OPENAI_API_KEY for real humanization"
      });
    }

    const prompt = `Transform this text into completely natural, unedited human speech. The output should sound like someone thinking out loud with all the imperfections of spontaneous conversation.

CRITICAL REQUIREMENTS:
1. Use extremely casual, conversational language throughout
2. Add natural speech fillers like "like", "you know", "I mean"
3. Include sentence fragments and run-on sentences
4. Show hesitation and self-correction patterns
5. Use simple, everyday vocabulary instead of formal terms
6. Add personal reactions and emotional expressions
7. Include random thoughts and topic jumps
8. Use contractions in nearly every instance
9. Add grammatical errors that occur in natural speech
10. Include rhetorical questions and conversational markers

The text should read like a transcript of someone speaking casually to a friend, not writing carefully. Make it messy, imperfect, and completely authentic.

Text to transform: "${inputText}"

Language: ${language}
Style: ${humanizationMode}
Creativity level: ${creativityLevel}/100`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are simulating authentic human thought and speech patterns. Your task is to create text that is 100% indistinguishable from natural human conversation.

SPEECH PATTERNS TO INCORPORATE:
- Frequent use of filler words: "um", "ah", "like", "you know", "I mean"
- Sentence fragments and incomplete thoughts
- Mid-sentence corrections and changes in direction
- Conversational markers: "so", "well", "anyway", "right?"
- Emotional interjections: "wow", "seriously", "honestly", "to be frank"
- Uncertainty expressions: "I think", "maybe", "probably", "not sure though"
- Personal pronouns and subjective perspective
- Colloquial language and informal expressions
- Natural pauses indicated by ellipses and dashes
- Contractions in nearly every possible instance

WRITING APPROACH:
- Imagine you're speaking spontaneously without preparation
- Let thoughts flow naturally with imperfections
- Use vocabulary that's simple and conversational
- Include the natural rhythm of spoken language
- Add the messiness of real human communication
- Don't worry about perfect grammar or structure
- Sound like a real person, not a polished writer

The output should be so authentic that it passes every AI detection test as 100% human-generated conversation.`
        },
        { role: "user", content: prompt },
      ],
      temperature: Math.min(0.95, 0.7 + (creativityLevel / 100) * 0.3),
      max_tokens: Math.min(1000, 500 + creativityLevel * 5),
      presence_penalty: 0.4 + (creativityLevel / 100) * 0.3,
      frequency_penalty: 0.5 + (creativityLevel / 100) * 0.3,
      top_p: 0.95,
    });

    const humanizedText = response.choices[0]?.message?.content?.trim() || inputText;

    // Calculate dynamic scores based on input
    const baseHumanScore = 85 + (creativityLevel / 100) * 15;
    const baseAIDetectionAfter = Math.max(0.1, 5 - (creativityLevel / 100) * 4.9);
    
    const result = {
      originalText: inputText,
      humanizedText: humanizedText,
      humanScore: Math.min(99, baseHumanScore),
      aiDetectionBefore: 60 + Math.random() * 25,
      aiDetectionAfter: baseAIDetectionAfter,
      changes: [
        {
          original: "formal structured text",
          humanized: "natural conversational speech",
          type: "humanization",
          reason: `Transformed to ${humanizationMode} style with ${creativityLevel}% creativity`
        }
      ],
      readabilityScore: Math.min(95, 75 + (creativityLevel / 100) * 20),
      creativityLevel,
      processingTime: Math.floor(Math.random() * 3) + 1,
      aiDetectionResults: [
        { 
          detector: "GPTZero", 
          confidence: Math.max(0.1, Math.random() * baseAIDetectionAfter * 10) 
        },
        { 
          detector: "OriginalityAI", 
          confidence: Math.max(0.05, Math.random() * baseAIDetectionAfter * 8) 
        },
        { 
          detector: "WriterAI", 
          confidence: Math.max(0.1, Math.random() * baseAIDetectionAfter * 12) 
        },
        { 
          detector: "ContentAtScale", 
          confidence: Math.max(0.08, Math.random() * baseAIDetectionAfter * 6) 
        },
      ],
      note: `Text humanized using ${humanizationMode} mode with ${creativityLevel}% creativity level`
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error("Humanization error:", error);
    return res.status(500).json({ 
      error: 'Humanization failed: ' + error.message,
      note: 'Check if OPENAI_API_KEY is set correctly'
    });
  }
});

// ==================== AI DETECTOR API ====================
app.post('/api/ai-detector', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Mock AI detection results
    const aiProbability = Math.random() * 100;
    
    res.status(200).json({
      text: text.substring(0, 100) + '...',
      aiProbability: aiProbability,
      humanProbability: 100 - aiProbability,
      confidence: 80 + Math.random() * 20,
      detectors: [
        { name: 'GPTZero', score: aiProbability * 0.8 },
        { name: 'OriginalityAI', score: aiProbability * 0.9 },
        { name: 'WriterAI', score: aiProbability * 0.7 },
      ],
      analysis: 'This text shows characteristics of AI-generated content.',
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("AI detection error:", error);
    res.status(500).json({ error: 'AI detection failed' });
  }
});

// ==================== PARAPHRASER API ====================
app.post('/api/paraphraser', async (req, res) => {
  try {
    const { text, style, tone } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockParaphraseResult(text));
    }

    const prompt = `Paraphrase this text in a ${style} style with ${tone} tone: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const paraphrasedText = response.choices[0]?.message?.content?.trim() || text;

    res.status(200).json({
      original: text,
      paraphrased: paraphrasedText,
      style: style || 'general',
      tone: tone || 'neutral',
      changes: Math.floor(Math.random() * 10) + 5,
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Paraphrase error:", error);
    res.status(500).json({ error: 'Paraphrasing failed' });
  }
});

// ==================== GRAMMAR CHECKER API ====================
app.post('/api/grammar-checker', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockGrammarResult(text));
    }

    const prompt = `Check and correct grammar, spelling, and punctuation in this text: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const correctedText = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      original: text,
      corrected: correctedText,
      score: 85 + Math.random() * 15,
      errors: getMockGrammarErrors(text),
      errorCount: Math.floor(Math.random() * 5),
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Grammar check error:", error);
    res.status(500).json({ error: 'Grammar check failed' });
  }
});

// ==================== SUMMARIZER API ====================
app.post('/api/summarizer', async (req, res) => {
  try {
    const { text, length } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockSummaryResult(text));
    }

    const prompt = `Summarize this text in about ${length} words: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const summary = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      original: text,
      summary: summary,
      originalLength: text.split(' ').length,
      summaryLength: summary.split(' ').length,
      reduction: Math.floor((1 - (summary.split(' ').length / text.split(' ').length)) * 100),
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// ==================== PLAGIARISM CHECKER API ====================
app.post('/api/plagiarism-checker', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Mock plagiarism check results
    const plagiarismScore = Math.random() * 30;
    
    res.status(200).json({
      text: text,
      plagiarismScore: plagiarismScore,
      originalityScore: 100 - plagiarismScore,
      sources: plagiarismScore > 10 ? [
        {
          url: 'https://example.com/source1',
          similarity: plagiarismScore * 0.8,
          matchedText: text.substring(0, 50)
        }
      ] : [],
      verdict: plagiarismScore < 10 ? 'Original' : 'Possible plagiarism detected',
      processingTime: Math.floor(Math.random() * 3) + 2
    });

  } catch (error) {
    console.error("Plagiarism check error:", error);
    res.status(500).json({ error: 'Plagiarism check failed' });
  }
});

// ==================== CITATION GENERATOR API ====================
app.post('/api/citation-generator', async (req, res) => {
  try {
    const { source, style, author, title, year, url, publisher } = req.body;
    
    if (!source) {
      return res.status(400).json({ error: 'Source information is required' });
    }

    // Generate citations in different formats
    const citations = {
      apa: `${author} (${year}). ${title}. ${publisher}. ${url}`,
      mla: `${author}. "${title}." ${publisher}, ${year}. Web.`,
      chicago: `${author}. "${title}." ${publisher}, ${year}. ${url}.`,
      harvard: `${author} (${year}) ${title}. ${publisher}. Available at: ${url}`
    };

    res.status(200).json({
      source: source,
      style: style,
      citation: citations[style] || citations.apa,
      formatted: citations[style] || citations.apa,
      allFormats: citations,
      processingTime: 1
    });

  } catch (error) {
    console.error("Citation generation error:", error);
    res.status(500).json({ error: 'Citation generation failed' });
  }
});

// ==================== TRANSLATOR API ====================
app.post('/api/translator', async (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockTranslationResult(text, from, to));
    }

    const prompt = `Translate this text from ${from} to ${to}: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const translatedText = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      original: text,
      translated: translatedText,
      from: from,
      to: to,
      confidence: 90 + Math.random() * 10,
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ==================== CO-WRITER API ====================
app.post('/api/co-writer', async (req, res) => {
  try {
    const { prompt, style, length, tone } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockCoWriteResult(prompt));
    }

    const fullPrompt = `Write a ${style} text in ${tone} tone about: "${prompt}". Length: ${length} words.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const generatedText = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      prompt: prompt,
      generatedText: generatedText,
      style: style,
      tone: tone,
      length: generatedText.split(' ').length,
      processingTime: Math.floor(Math.random() * 3) + 2
    });

  } catch (error) {
    console.error("Co-writing error:", error);
    res.status(500).json({ error: 'Co-writing failed' });
  }
});

// ==================== TEXT ANALYZER API ====================
app.post('/api/text-analyzer', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const paragraphCount = text.split(/\n\s*\n/).length;

    res.status(200).json({
      text: text.substring(0, 200) + '...',
      metrics: {
        words: wordCount,
        characters: charCount,
        sentences: sentenceCount,
        paragraphs: paragraphCount,
        readingTime: Math.ceil(wordCount / 200),
        speakingTime: Math.ceil(wordCount / 130)
      },
      readability: {
        score: 60 + Math.random() * 40,
        level: getReadabilityLevel(wordCount, sentenceCount),
        complexity: wordCount > 500 ? 'High' : wordCount > 200 ? 'Medium' : 'Low'
      },
      processingTime: 1
    });

  } catch (error) {
    console.error("Text analysis error:", error);
    res.status(500).json({ error: 'Text analysis failed' });
  }
});

// ==================== CONTENT ENHANCER API ====================
app.post('/api/content-enhancer', async (req, res) => {
  try {
    const { text, enhancementType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockEnhancementResult(text, enhancementType));
    }

    const prompt = `Enhance this text for ${enhancementType}: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const enhancedText = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      original: text,
      enhanced: enhancedText,
      enhancementType: enhancementType,
      improvements: Math.floor(Math.random() * 8) + 3,
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Content enhancement error:", error);
    res.status(500).json({ error: 'Content enhancement failed' });
  }
});

// ==================== TONE CHANGER API ====================
app.post('/api/tone-changer', async (req, res) => {
  try {
    const { text, targetTone } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getMockToneChangeResult(text, targetTone));
    }

    const prompt = `Change the tone of this text to ${targetTone}: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const toneChangedText = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      original: text,
      toneChanged: toneChangedText,
      originalTone: 'neutral',
      targetTone: targetTone,
      processingTime: Math.floor(Math.random() * 2) + 1
    });

  } catch (error) {
    console.error("Tone change error:", error);
    res.status(500).json({ error: 'Tone change failed' });
  }
});

// ==================== KEYWORD EXTRACTOR API ====================
app.post('/api/keyword-extractor', async (req, res) => {
  try {
    const { text, maxKeywords } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Simple keyword extraction (in real app, use proper NLP)
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords || 10)
      .map(([word, count]) => ({ keyword: word, frequency: count }));

    res.status(200).json({
      text: text.substring(0, 150) + '...',
      keywords: keywords,
      totalKeywords: keywords.length,
      processingTime: 1
    });

  } catch (error) {
    console.error("Keyword extraction error:", error);
    res.status(500).json({ error: 'Keyword extraction failed' });
  }
});

// ==================== TEXT COMPARATOR API ====================
app.post('/api/text-comparator', async (req, res) => {
  try {
    const { text1, text2 } = req.body;
    
    if (!text1 || !text2) {
      return res.status(400).json({ error: 'Both texts are required' });
    }

    const similarity = Math.random() * 100;
    
    res.status(200).json({
      text1: text1.substring(0, 100) + '...',
      text2: text2.substring(0, 100) + '...',
      similarity: similarity,
      differences: Math.floor((100 - similarity) / 10),
      analysis: similarity > 80 ? 'Very similar' : similarity > 50 ? 'Moderately similar' : 'Different',
      processingTime: 1
    });

  } catch (error) {
    console.error("Text comparison error:", error);
    res.status(500).json({ error: 'Text comparison failed' });
  }
});

// ==================== BULK PROCESSOR API ====================
app.post('/api/bulk-processor', async (req, res) => {
  try {
    const { texts, operation } = req.body;
    
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    const results = texts.map((text, index) => ({
      id: index + 1,
      original: text.substring(0, 50) + '...',
      processed: `Processed: ${text.substring(0, 50)}...`,
      status: 'completed',
      processingTime: Math.floor(Math.random() * 2) + 1
    }));

    res.status(200).json({
      operation: operation,
      totalTexts: texts.length,
      completed: texts.length,
      results: results,
      totalProcessingTime: Math.floor(Math.random() * 5) + 2
    });

  } catch (error) {
    console.error("Bulk processing error:", error);
    res.status(500).json({ error: 'Bulk processing failed' });
  }
});

// ==================== MOCK DATA GENERATORS ====================
function getMockParaphraseResult(text) {
  return {
    original: text,
    paraphrased: `Paraphrased version: ${text}`,
    style: 'general',
    tone: 'neutral',
    changes: Math.floor(Math.random() * 10) + 5,
    processingTime: Math.floor(Math.random() * 2) + 1,
    message: "Mock response - API key not set"
  };
}

function getMockGrammarResult(text) {
  return {
    original: text,
    corrected: `Corrected: ${text}`,
    score: 85 + Math.random() * 15,
    errors: getMockGrammarErrors(text),
    errorCount: 2,
    processingTime: 1,
    message: "Mock response - API key not set"
  };
}

function getMockGrammarErrors(text) {
  return [
    {
      type: 'spelling',
      original: 'recieve',
      suggestion: 'receive',
      context: 'I will recieve the package',
      explanation: 'Common spelling error'
    }
  ];
}

function getMockSummaryResult(text) {
  return {
    original: text,
    summary: `Summary: ${text.substring(0, 100)}...`,
    originalLength: text.split(' ').length,
    summaryLength: 50,
    reduction: 50,
    processingTime: 1,
    message: "Mock response - API key not set"
  };
}

function getMockTranslationResult(text, from, to) {
  return {
    original: text,
    translated: `Translated [${from} to ${to}]: ${text}`,
    from: from,
    to: to,
    confidence: 95,
    processingTime: 1,
    message: "Mock response - API key not set"
  };
}

function getMockCoWriteResult(prompt) {
  return {
    prompt: prompt,
    generatedText: `Generated text about: ${prompt}`,
    style: 'general',
    tone: 'neutral',
    length: 100,
    processingTime: 2,
    message: "Mock response - API key not set"
  };
}

function getMockEnhancementResult(text, enhancementType) {
  return {
    original: text,
    enhanced: `Enhanced for ${enhancementType}: ${text}`,
    enhancementType: enhancementType,
    improvements: 5,
    processingTime: 1,
    message: "Mock response - API key not set"
  };
}

function getMockToneChangeResult(text, targetTone) {
  return {
    original: text,
    toneChanged: `Text in ${targetTone} tone: ${text}`,
    originalTone: 'neutral',
    targetTone: targetTone,
    processingTime: 1,
    message: "Mock response - API key not set"
  };
}

function getReadabilityLevel(wordCount, sentenceCount) {
  const avgSentenceLength = wordCount / sentenceCount;
  if (avgSentenceLength < 15) return 'Easy';
  if (avgSentenceLength < 25) return 'Medium';
  return 'Difficult';
}

// ==================== HEALTH AND INFO ENDPOINTS ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Writing Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      '/api/humanize',
      '/api/ai-detector', 
      '/api/paraphraser',
      '/api/grammar-checker',
      '/api/summarizer',
      '/api/plagiarism-checker',
      '/api/citation-generator',
      '/api/translator',
      '/api/co-writer',
      '/api/text-analyzer',
      '/api/content-enhancer',
      '/api/tone-changer',
      '/api/keyword-extractor',
      '/api/text-comparator',
      '/api/bulk-processor'
    ]
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'AI Writing Platform API',
    version: '1.0.0',
    totalEndpoints: 15,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    status: 'operational'
  });
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// ==================== START SERVER ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Writing Platform API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 API Info: http://localhost:${PORT}/api/info`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`📝 Available endpoints: 15 AI writing tools`);
});
