const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = 3000;

// Middleware - CORS first
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==================== AI DETECTOR API ====================

app.post('/api/ai-detect', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OPENAI_API_KEY not configured',
        message: 'Please set the OPENAI_API_KEY environment variable to use AI detection'
      });
    }

    console.log('AI detection request received:', { 
      textLength: text.length,
      language
    });

    // Enhanced prompt for accurate AI detection
    const prompt = `Analyze the following text to detect AI-generated content with HIGH ACCURACY. Be thorough and identify ALL AI patterns.

TEXT TO ANALYZE:
"${text.substring(0, 4000)}"

CRITICAL AI DETECTION INDICATORS TO LOOK FOR:

1. **PERFECTION PATTERNS:**
   - Flawless grammar and punctuation
   - Overly structured sentences
   - Perfect logical flow without natural digressions
   - Consistent tone throughout

2. **VOCABULARY & PHRASING:**
   - Overuse of formal transition words (furthermore, moreover, consequently)
   - Repetitive sentence structures
   - Lack of colloquial expressions
   - Overly optimized word choices
   - Absence of personal pronouns or subjective language

3. **CONTENT PATTERNS:**
   - Formulaic introductions and conclusions
   - Predictable argument development
   - Balanced but generic perspectives
   - Lack of personal anecdotes or experiences
   - Overuse of common AI training phrases

4. **STYLISTIC PATTERNS:**
   - Uniform sentence length
   - Perfect paragraph structure
   - Lack of rhetorical questions
   - Absence of emotional language
   - Overly neutral tone

5. **HUMAN INDICATORS (ABSENCE OF):**
   - Contractions (don't, can't, it's)
   - Informal language
   - Sentence fragments
   - Personal opinions
   - Emotional expressions
   - Cultural references
   - Humor or sarcasm

RETURN JSON WITH THIS EXACT STRUCTURE:
{
  "overallScore": number (0-100), // Overall AI probability score
  "aiProbability": number (0-100), // Percentage likelihood of AI generation
  "humanProbability": number (0-100), // Percentage likelihood of human writing
  "confidence": number (0-100), // Confidence in the analysis
  "detectedPatterns": array of strings, // Specific AI patterns found
  "sentenceAnalysis": array of {
    "text": string,
    "aiScore": number (0-100),
    "patterns": array of strings,
    "highlighted": boolean
  },
  "detailedBreakdown": {
    "perfectionScore": number (0-100), // Higher = more AI-like
    "vocabularyScore": number (0-100), // Higher = more AI-like
    "structureScore": number (0-100), // Higher = more AI-like
    "creativityScore": number (0-100), // Higher = more human-like
    "personalizationScore": number (0-100) // Higher = more human-like
  },
  "keyFindings": array of strings, // Major reasons for the assessment
  "wordCount": number,
  "language": string
}

BE THOROUGH AND ACCURATE. Return only valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert AI content detection specialist with deep knowledge of linguistic patterns, writing styles, and AI generation characteristics. Your task is to accurately identify AI-generated text with high precision.

IMPORTANT GUIDELINES:
1. Be objective and evidence-based in your analysis
2. Look for multiple converging indicators of AI generation
3. Consider the context and purpose of the text
4. Weight recent AI writing patterns more heavily
5. Provide specific, actionable findings
6. Use statistical patterns and linguistic analysis
7. Consider both presence of AI patterns and absence of human patterns

ANALYSIS FRAMEWORK:
- Perfection Analysis: Check for unnatural perfection in grammar and structure
- Pattern Recognition: Identify repetitive AI writing patterns
- Stylistic Analysis: Evaluate writing style consistency
- Content Analysis: Assess originality and personal voice
- Statistical Analysis: Measure vocabulary diversity and sentence structure

Always return valid JSON with comprehensive analysis.`
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 3000,
    });

    let analysisResult;
    try {
      analysisResult = JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      analysisResult = generateEnhancedAnalysis(text, language);
    }

    // Validate and enhance the analysis result
    const finalResult = validateAndEnhanceDetection(analysisResult, text, language);
    
    // Generate highlighted text
    finalResult.highlightedText = generateEnhancedHighlightedText(text, finalResult.sentenceAnalysis);

    res.status(200).json(finalResult);

  } catch (error) {
    console.error("AI detection error:", error);
    
    // Fallback to enhanced analysis
    const fallbackResult = generateEnhancedAnalysis(text, language);
    res.status(200).json(fallbackResult);
  }
});

// Enhanced analysis functions
function generateEnhancedAnalysis(text, language) {
  const words = text.split(/\s+/).filter(w => w);
  const sentences = splitIntoSentences(text);
  
  // Comprehensive pattern detection
  const aiPatterns = detectAIPatterns(text);
  const humanPatterns = detectHumanPatterns(text);
  
  // Calculate scores based on pattern analysis
  const perfectionScore = calculatePerfectionScore(text);
  const vocabularyScore = calculateVocabularyAIScore(text);
  const structureScore = calculateStructureAIScore(text);
  const creativityScore = calculateCreativityScore(text);
  const personalizationScore = calculatePersonalizationScore(text);
  
  // Weighted overall AI probability
  const aiProbability = Math.min(100, Math.max(0,
    (perfectionScore * 0.3) +
    (vocabularyScore * 0.25) +
    (structureScore * 0.25) +
    ((100 - creativityScore) * 0.1) +
    ((100 - personalizationScore) * 0.1)
  ));

  const sentenceAnalysis = sentences.map(sentence => {
    const sentenceAIScore = calculateSentenceAIScore(sentence);
    return {
      text: sentence,
      aiScore: sentenceAIScore,
      patterns: detectSentencePatterns(sentence),
      highlighted: sentenceAIScore > 60
    };
  });

  const detectedPatterns = [...aiPatterns];
  const keyFindings = generateKeyFindings(aiPatterns, humanPatterns, aiProbability);

  return {
    overallScore: Math.round(aiProbability),
    aiProbability: Math.round(aiProbability),
    humanProbability: Math.round(100 - aiProbability),
    confidence: Math.round(calculateConfidenceScore(text)),
    detectedPatterns: detectedPatterns,
    sentenceAnalysis: sentenceAnalysis,
    detailedBreakdown: {
      perfectionScore: Math.round(perfectionScore),
      vocabularyScore: Math.round(vocabularyScore),
      structureScore: Math.round(structureScore),
      creativityScore: Math.round(creativityScore),
      personalizationScore: Math.round(personalizationScore)
    },
    keyFindings: keyFindings,
    wordCount: words.length,
    language: language
  };
}

function detectAIPatterns(text) {
  const patterns = [];
  const lowerText = text.toLowerCase();
  
  // Strong AI indicators
  const strongIndicators = [
    'furthermore', 'moreover', 'consequently', 'additionally', 
    'nevertheless', 'thus', 'hence', 'therefore', 'accordingly',
    'in conclusion', 'to summarize', 'overall', 'in summary',
    'it is important to', 'it is crucial to', 'it is essential to',
    'in order to', 'with the aim of', 'for the purpose of',
    'this essay will', 'this paper discusses', 'as previously mentioned',
    'it is worth noting', 'significantly', 'notably'
  ];
  
  // Structural patterns
  if (text.split('.').length > 0) {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength > 25 && avgSentenceLength < 15) {
      patterns.push("Uniform sentence length");
    }
    
    // Check for repetitive sentence starters
    const starters = sentences.map(s => s.trim().split(' ')[0].toLowerCase());
    const uniqueStarters = new Set(starters);
    if (uniqueStarters.size / starters.length < 0.3) {
      patterns.push("Repetitive sentence structures");
    }
  }
  
  // Vocabulary patterns
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words).size;
  const lexicalDiversity = uniqueWords / words.length;
  
  if (lexicalDiversity < 0.5 && words.length > 100) {
    patterns.push("Low lexical diversity");
  }
  
  // Check for strong AI indicator phrases
  strongIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      patterns.push(`Formal transition: "${indicator}"`);
    }
  });
  
  // Check for perfection in grammar (simplified)
  const grammarPatterns = text.match(/([A-Z][a-z]+ ){3,}/g);
  if (grammarPatterns && grammarPatterns.length > 2) {
    patterns.push("Overly proper capitalization");
  }
  
  return patterns.slice(0, 10); // Limit to top 10 patterns
}

function detectHumanPatterns(text) {
  const patterns = [];
  const lowerText = text.toLowerCase();
  
  // Human speech indicators
  const humanIndicators = [
    'um', 'uh', 'like', 'you know', 'kinda', 'sorta', 'i mean',
    'honestly', 'actually', 'basically', 'literally', 'pretty',
    'really', 'totally', 'absolutely', 'seriously', 'wait',
    'no', 'yeah', 'yep', 'nope', 'huh', 'right?', 'okay',
    'well', 'so', 'anyway', 'besides'
  ];
  
  // Contractions
  const contractions = [
    "i'm", "it's", "that's", "what's", "there's", "here's", "how's",
    "don't", "can't", "won't", "isn't", "aren't", "wasn't", "weren't",
    "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd",
    "i'll", "you'll", "he'll", "she'll", "we'll", "they'll"
  ];
  
  humanIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      patterns.push(`Informal speech: "${indicator}"`);
    }
  });
  
  contractions.forEach(contraction => {
    if (lowerText.includes(contraction)) {
      patterns.push(`Contraction: "${contraction}"`);
    }
  });
  
  // Personal pronouns
  const personalPronouns = text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi);
  if (personalPronouns && personalPronouns.length > 3) {
    patterns.push("Frequent personal pronouns");
  }
  
  // Emotional language
  const emotionalWords = text.match(/\b(love|hate|happy|sad|angry|excited|bored|amazing|terrible)\b/gi);
  if (emotionalWords && emotionalWords.length > 2) {
    patterns.push("Emotional language");
  }
  
  return patterns;
}

function calculatePerfectionScore(text) {
  let score = 0;
  const sentences = splitIntoSentences(text);
  
  // Check grammar perfection (simplified)
  const hasErrors = text.match(/(\b[A-Z][a-z]+\b ){4,}/g); // Overly proper
  if (!hasErrors) score += 20;
  
  // Sentence length consistency
  if (sentences.length > 3) {
    const lengths = sentences.map(s => s.split(' ').length);
    const variance = Math.max(...lengths) - Math.min(...lengths);
    if (variance < 15) score += 25; // Too consistent
  }
  
  // Formal language usage
  const formalWords = text.match(/\b(furthermore|moreover|consequently|thus|hence|therefore)\b/gi);
  if (formalWords) score += formalWords.length * 8;
  
  // Perfect punctuation
  const punctuationPattern = text.match(/[.!?]/g);
  if (punctuationPattern && punctuationPattern.length / sentences.length > 0.9) {
    score += 15;
  }
  
  return Math.min(100, score);
}

function calculateVocabularyAIScore(text) {
  let score = 0;
  const words = text.toLowerCase().split(/\s+/);
  
  // Lexical diversity
  const uniqueWords = new Set(words).size;
  const diversity = uniqueWords / words.length;
  if (diversity < 0.6) score += 30;
  else if (diversity < 0.7) score += 15;
  
  // AI common phrases
  const aiPhrases = [
    'as an ai', 'as a language model', 'i am trained', 'based on my training',
    'according to the data', 'statistical analysis', 'pattern recognition'
  ];
  
  aiPhrases.forEach(phrase => {
    if (text.toLowerCase().includes(phrase)) score += 25;
  });
  
  // Overly formal vocabulary
  const formalCount = (text.match(/\b(utilize|facilitate|implement|methodology|paradigm)\b/gi) || []).length;
  score += formalCount * 5;
  
  return Math.min(100, score);
}

function calculateStructureAIScore(text) {
  let score = 0;
  const sentences = splitIntoSentences(text);
  
  if (sentences.length > 2) {
    // Check for formulaic structure
    const firstWords = sentences.slice(0, 3).map(s => s.trim().split(' ')[0].toLowerCase());
    const uniqueFirstWords = new Set(firstWords).size;
    if (uniqueFirstWords < 2) score += 20;
    
    // Paragraph structure
    const paragraphs = text.split('\n\n');
    if (paragraphs.length > 1) {
      const paraLengths = paragraphs.map(p => p.split(' ').length);
      const paraVariance = Math.max(...paraLengths) - Math.min(...paraLengths);
      if (paraVariance < 50) score += 15; // Too uniform
    }
  }
  
  // Transition words density
  const transitions = text.match(/\b(furthermore|moreover|however|therefore|consequently|additionally)\b/gi);
  if (transitions && transitions.length / sentences.length > 0.3) {
    score += 25;
  }
  
  return Math.min(100, score);
}

function calculateCreativityScore(text) {
  let score = 70; // Base assumption of some creativity
  
  // Check for unique phrases (simplified)
  const words = text.split(/\s+/);
  const uniqueBigrams = new Set();
  
  for (let i = 0; i < words.length - 1; i++) {
    uniqueBigrams.add(words[i] + ' ' + words[i + 1]);
  }
  
  const bigramDiversity = uniqueBigrams.size / (words.length - 1);
  if (bigramDiversity > 0.8) score += 20;
  else if (bigramDiversity < 0.5) score -= 20;
  
  // Metaphors and creative language
  const creativeIndicators = text.match(/(like a|as if|as though|metaphorically|symbolically)/gi);
  if (creativeIndicators) score += creativeIndicators.length * 5;
  
  // Questions and rhetorical devices
  const questions = text.match(/\?/g);
  if (questions) score += questions.length * 3;
  
  return Math.max(0, Math.min(100, score));
}

function calculatePersonalizationScore(text) {
  let score = 50;
  
  // Personal pronouns
  const personalPronouns = text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi);
  if (personalPronouns) score += personalPronouns.length * 3;
  
  // Emotional language
  const emotionalWords = text.match(/\b(feel|felt|think|believe|wonder|hope|wish)\b/gi);
  if (emotionalWords) score += emotionalWords.length * 2;
  
  // Contractions
  const contractions = text.match(/'[a-z]{1,2}\b/gi);
  if (contractions) score += contractions.length * 2;
  
  // Informal expressions
  const informal = text.match(/\b(um|uh|like|you know|kinda|sorta)\b/gi);
  if (informal) score += informal.length * 4;
  
  return Math.min(100, score);
}

function calculateSentenceAIScore(sentence) {
  let score = 0;
  
  // Length-based scoring
  const wordCount = sentence.split(' ').length;
  if (wordCount > 25 && wordCount < 40) score += 15;
  
  // Formal transitions
  const formalTransitions = sentence.match(/\b(furthermore|moreover|consequently|thus|hence)\b/gi);
  if (formalTransitions) score += formalTransitions.length * 20;
  
  // Structural patterns
  if (sentence.match(/^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+/)) {
    score += 10; // Very structured start
  }
  
  // Human indicators (reduce score)
  if (sentence.match(/\b(um|uh|like|you know)\b/i)) score -= 30;
  if (sentence.match(/'[a-z]{1,2}\b/)) score -= 15; // Contractions
  if (sentence.match(/\b(I|me|my)\b/)) score -= 10; // Personal pronouns
  
  return Math.max(0, Math.min(100, score));
}

function detectSentencePatterns(sentence) {
  const patterns = [];
  
  if (sentence.match(/\b(furthermore|moreover|consequently|thus|hence)\b/i)) {
    patterns.push("Formal transition");
  }
  
  if (sentence.length > 30 && !sentence.match(/[,;—]/)) {
    patterns.push("Long structured sentence");
  }
  
  if (sentence.match(/^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+/)) {
    patterns.push("Formulaic sentence start");
  }
  
  if (sentence.match(/\b(um|uh|like|you know)\b/i)) {
    patterns.push("Human speech pattern");
  }
  
  return patterns;
}

function calculateConfidenceScore(text) {
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = splitIntoSentences(text).length;
  
  let confidence = 50;
  
  if (wordCount > 200) confidence += 20;
  if (wordCount > 500) confidence += 15;
  if (sentenceCount > 10) confidence += 10;
  if (sentenceCount > 20) confidence += 5;
  
  return Math.min(95, confidence);
}

function generateKeyFindings(aiPatterns, humanPatterns, aiProbability) {
  const findings = [];
  
  if (aiProbability > 70) {
    findings.push("High likelihood of AI generation based on multiple converging patterns");
  } else if (aiProbability > 40) {
    findings.push("Moderate indicators of AI assistance or refinement");
  } else {
    findings.push("Strong human writing characteristics detected");
  }
  
  if (aiPatterns.length > 5) {
    findings.push(`Multiple AI patterns identified: ${aiPatterns.slice(0, 3).join(', ')}`);
  }
  
  if (humanPatterns.length > 3) {
    findings.push(`Human writing markers present: ${humanPatterns.slice(0, 2).join(', ')}`);
  }
  
  return findings.slice(0, 5);
}

function validateAndEnhanceDetection(analysis, text, language) {
  const words = text.split(/\s+/).filter(w => w);
  const sentences = splitIntoSentences(text);
  
  // Ensure all required fields exist
  const result = {
    overallScore: analysis.overallScore || 0,
    aiProbability: analysis.aiProbability || 0,
    humanProbability: analysis.humanProbability || 100,
    confidence: analysis.confidence || calculateConfidenceScore(text),
    detectedPatterns: analysis.detectedPatterns || [],
    sentenceAnalysis: analysis.sentenceAnalysis || sentences.map(s => ({
      text: s,
      aiScore: calculateSentenceAIScore(s),
      patterns: detectSentencePatterns(s),
      highlighted: calculateSentenceAIScore(s) > 60
    })),
    detailedBreakdown: analysis.detailedBreakdown || {
      perfectionScore: calculatePerfectionScore(text),
      vocabularyScore: calculateVocabularyAIScore(text),
      structureScore: calculateStructureAIScore(text),
      creativityScore: calculateCreativityScore(text),
      personalizationScore: calculatePersonalizationScore(text)
    },
    keyFindings: analysis.keyFindings || generateKeyFindings([], [], analysis.aiProbability || 0),
    wordCount: words.length,
    language: language
  };

  return result;
}

function generateEnhancedHighlightedText(originalText, sentenceAnalysis) {
  let highlightedText = originalText;
  
  // Highlight sentences with high AI probability
  sentenceAnalysis
    .filter(s => s.highlighted && s.text && s.aiScore > 60)
    .sort((a, b) => b.text.length - a.text.length)
    .forEach(sentence => {
      const escapedText = sentence.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedText, 'gi');
      highlightedText = highlightedText.replace(regex, `***AI PATTERN DETECTED: $&***`);
    });

  return highlightedText;
}

function splitIntoSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim()).slice(0, 50);
}

// [Rest of your existing APIs: Citation Finder, Citation Generator, Humanize...]
// ... (Keep all your existing APIs exactly as they were)

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
  console.log(`🔑 OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not set'}`);
  console.log(`📚 Available APIs: Humanize, Citation Generator, Citation Finder, AI Detector`);
  console.log(`🎯 AI Detector: Enhanced accuracy with comprehensive pattern analysis`);
  console.log(`✅ Server started successfully!`);
});