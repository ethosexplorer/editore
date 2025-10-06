import OpenAI from 'openai';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests (for testing)
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "AI Detection API is running!",
      usage: "Send POST request with JSON body",
      example: {
        text: "Your text to analyze",
        language: "en"
      }
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      let body;
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }

      const { text, language = 'en' } = body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      console.log('Received detection request for text length:', text.length);

      // For testing without OpenAI API key
      if (!process.env.VITE_OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY not set, returning mock detection response");
        const mockResult = generateMockAnalysis(text, language);
        return res.status(200).json(mockResult);
      }

      const openai = new OpenAI({ 
        apiKey: process.env.VITE_OPENAI_API_KEY 
      });

      const prompt = `Analyze this text to detect AI-generated content. Be VERY conservative - only flag text as AI if it clearly shows AI patterns. 

IMPORTANT: Text with natural human imperfections like "um", "like", "you know", informal language, contractions, sentence fragments, and conversational style should be considered HUMAN.

Focus on identifying ONLY text that shows:
1. Perfect, structured sentences without natural human flaws
2. Overly formal or academic language in casual contexts
3. Repetitive, formulaic patterns that lack human variation
4. Unnatural consistency in tone and structure
5. Lack of personal voice or authentic human quirks

Return JSON with:
- overallScore: overall AI detection confidence (0-100)
- aiGenerated: percentage AI-generated (0-100)
- aiRefined: percentage AI-refined (0-100) 
- humanWritten: percentage human-written (0-100)
- sentences: array of {text, aiProbability, patterns[], highlighted}
- detailedAnalysis: {vocabulary, syntax, coherence, creativity} scores (0-100)

Text to analyze:
"${text.substring(0, 3000)}"

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a conservative AI detection expert. You must be VERY careful about flagging text as AI-generated. 

CRITICAL RULES:
1. Text with natural human speech patterns (fillers, contractions, informal language) = HUMAN
2. Only flag text as AI if it shows clear, undeniable AI patterns
3. Sentence fragments, run-ons, and natural imperfections = HUMAN
4. Conversational tone with personal voice = HUMAN
5. Only flag if text is overly structured, formal, or shows repetitive AI patterns

Human indicators: "um", "like", "you know", contractions, informal language, personal opinions, natural errors
AI indicators: perfect structure, formal transitions, repetitive patterns, lack of human quirks

Be conservative - when in doubt, mark as human.`
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });

      let analysisResult;
      try {
        analysisResult = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        analysisResult = generateConservativeAnalysis(text, language);
      }

      // Validate and enhance the analysis result
      const finalResult = validateAndEnhanceAnalysis(analysisResult, text, language);
      
      // Generate highlighted text - only highlight sentences with very high AI probability
      finalResult.highlightedText = generateHighlightedText(text, finalResult.sentences);

      return res.status(200).json(finalResult);

    } catch (error) {
      console.error("Detection error:", error);
      
      // Fallback to conservative analysis
      const fallbackResult = generateConservativeAnalysis(text, language);
      return res.status(200).json(fallbackResult);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Generate conservative analysis that favors human text
function generateConservativeAnalysis(text, language) {
  const words = text.split(/\s+/).filter(w => w);
  const sentences = splitIntoSentences(text);
  
  // Check for strong human indicators
  const humanIndicators = countHumanIndicators(text);
  const aiIndicators = countAIIndicators(text);
  
  // Conservative scoring - favor human unless clear AI patterns
  let aiGenerated = 0;
  let aiRefined = 0;
  
  // Only flag as AI if there are strong AI patterns AND few human indicators
  if (aiIndicators > 3 && humanIndicators < 2) {
    aiGenerated = Math.min(30, aiIndicators * 5);
  } else if (aiIndicators > 1 && humanIndicators < 3) {
    aiRefined = Math.min(15, aiIndicators * 3);
  }
  
  const humanWritten = Math.max(80, 100 - aiGenerated - aiRefined);
  const overallScore = Math.min(20, (aiGenerated + aiRefined) / 2);

  const sentenceAnalysis = sentences.map(sentence => {
    const sentenceAIScore = calculateConservativeSentenceScore(sentence);
    return {
      text: sentence,
      aiProbability: sentenceAIScore,
      patterns: detectConservativeSentencePatterns(sentence),
      highlighted: sentenceAIScore > 80 // Only highlight very clear AI
    };
  });

  return {
    overallScore: Math.round(overallScore),
    aiGenerated: Math.round(aiGenerated),
    aiRefined: Math.round(aiRefined),
    humanWritten: Math.round(humanWritten),
    predictabilityScore: Math.round(calculatePredictabilityScore(text)),
    formulaicPatterns: Math.round(countAIIndicators(text) * 8),
    sentences: sentenceAnalysis,
    detailedAnalysis: {
      vocabulary: Math.round(calculateLexicalDiversity(text)),
      syntax: Math.round(calculateNaturalSyntaxScore(text)),
      coherence: Math.round(70 + (Math.random() * 20)),
      creativity: Math.round(60 + (Math.random() * 30))
    },
    wordCount: words.length,
    language: language,
    note: "Conservative analysis - favors human text unless clear AI patterns"
  };
}

// Count human speech indicators
function countHumanIndicators(text) {
  const indicators = [
    ' um ', ' uh ', ' like ', ' you know ', ' kinda ', ' sorta ', ' kinda ',
    ' i mean ', ' honestly ', ' actually ', ' basically ', ' literally ',
    ' pretty ', ' really ', ' totally ', ' absolutely ', ' seriously ',
    ' wait ', ' no ', ' yeah ', ' yep ', ' nope ', ' huh ', ' right?',
    "i'm", "it's", "that's", "what's", "there's", "here's", "how's",
    "don't", "can't", "won't", "isn't", "aren't", "wasn't", "weren't",
    "gonna", "wanna", "gotta", "shoulda", "coulda", "woulda"
  ];
  
  const lowerText = text.toLowerCase();
  return indicators.filter(indicator => lowerText.includes(indicator)).length;
}

// Count AI indicators (conservative)
function countAIIndicators(text) {
  const indicators = [
    'furthermore', 'moreover', 'consequently', 'additionally', 
    'nevertheless', 'thus', 'hence', 'therefore', 'accordingly',
    'in conclusion', 'to summarize', 'overall', 'in summary',
    'it is important to', 'it is crucial to', 'it is essential to',
    'in order to', 'with the aim of', 'for the purpose of'
  ];
  
  const lowerText = text.toLowerCase();
  return indicators.filter(indicator => lowerText.includes(indicator)).length;
}

// Conservative sentence scoring
function calculateConservativeSentenceScore(sentence) {
  const humanScore = countHumanIndicators(sentence) * 25;
  const aiScore = countAIIndicators(sentence) * 15;
  
  // Base score favors human, only high if clear AI patterns
  let score = 10 + aiScore - humanScore;
  
  // Check for natural human patterns
  if (sentence.includes('?') || sentence.includes('...') || sentence.includes('—')) {
    score -= 20;
  }
  
  // Check for informal language
  if (sentence.match(/like|um|uh|you know|kinda|sorta/i)) {
    score -= 30;
  }
  
  return Math.max(0, Math.min(100, score));
}

function detectConservativeSentencePatterns(sentence) {
  const patterns = [];
  
  // Only flag clear AI patterns
  if (sentence.match(/furthermore|moreover|consequently|thus|hence/i)) {
    patterns.push("Formal transitions");
  }
  
  if (sentence.match(/in conclusion|to summarize|overall|in summary/i)) {
    patterns.push("Summary phrases");
  }
  
  if (sentence.length > 35 && !sentence.match(/[,;—]/)) {
    patterns.push("Long structured sentence");
  }
  
  return patterns;
}

// Validation and enhancement functions
function validateAndEnhanceAnalysis(analysis, text, language) {
  const words = text.split(/\s+/).filter(w => w);
  const sentences = splitIntoSentences(text);
  
  // Ensure all required fields exist with conservative defaults
  const result = {
    overallScore: analysis.overallScore || 15,
    aiGenerated: analysis.aiGenerated || 0,
    aiRefined: analysis.aiRefined || 0,
    humanWritten: analysis.humanWritten || Math.max(80, 100 - (analysis.aiGenerated || 0) - (analysis.aiRefined || 0)),
    predictabilityScore: analysis.predictabilityScore || 40,
    formulaicPatterns: analysis.formulaicPatterns || 20,
    sentences: analysis.sentences || sentences.map(s => ({
      text: s,
      aiProbability: calculateConservativeSentenceScore(s),
      patterns: detectConservativeSentencePatterns(s),
      highlighted: calculateConservativeSentenceScore(s) > 80
    })),
    detailedAnalysis: analysis.detailedAnalysis || {
      vocabulary: 70,
      syntax: 65,
      coherence: 75,
      creativity: 70
    },
    wordCount: words.length,
    language: language
  };

  // Normalize scores conservatively
  return normalizeScoresConservative(result);
}

function normalizeScoresConservative(analysis) {
  const totalAI = analysis.aiGenerated + analysis.aiRefined;
  if (totalAI > 30) {
    // Cap AI scores at reasonable levels
    const ratio = analysis.aiGenerated / totalAI;
    analysis.aiGenerated = Math.round(30 * ratio);
    analysis.aiRefined = 30 - analysis.aiGenerated;
  }
  
  analysis.humanWritten = Math.max(70, 100 - analysis.aiGenerated - analysis.aiRefined);
  analysis.overallScore = Math.round((analysis.aiGenerated + analysis.aiRefined) / 2);
  
  // Ensure conservative bounds
  analysis.overallScore = Math.max(0, Math.min(30, analysis.overallScore));
  analysis.aiGenerated = Math.max(0, Math.min(25, analysis.aiGenerated));
  analysis.aiRefined = Math.max(0, Math.min(15, analysis.aiRefined));
  analysis.humanWritten = Math.max(70, Math.min(100, analysis.humanWritten));
  
  return analysis;
}

// Text analysis helper functions
function calculateLexicalDiversity(text) {
  const words = text.toLowerCase().split(/\s+/);
  if (words.length === 0) return 70;
  
  const uniqueWords = new Set(words).size;
  return Math.min(100, (uniqueWords / words.length) * 100);
}

function calculateNaturalSyntaxScore(text) {
  const sentences = splitIntoSentences(text);
  let naturalScore = 50;
  
  // Reward natural human patterns
  sentences.forEach(sentence => {
    if (sentence.match(/[?!…—]/)) naturalScore += 5;
    if (sentence.match(/\b(um|uh|like|you know|kinda)\b/i)) naturalScore += 10;
    if (sentence.match(/'.*?'|".*?"/)) naturalScore += 3;
    if (sentence.length < 10 || sentence.length > 40) naturalScore += 5; // Variation
  });
  
  return Math.min(100, naturalScore);
}

function calculatePredictabilityScore(text) {
  // Lower predictability for human text
  const humanIndicators = countHumanIndicators(text);
  return Math.max(20, 60 - (humanIndicators * 5));
}

function splitIntoSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim()).slice(0, 20);
}

function generateHighlightedText(originalText, sentences) {
  let highlightedText = originalText;
  
  // Only highlight sentences with very high AI probability (>80%)
  sentences
    .filter(s => s.highlighted && s.text && s.aiProbability > 80)
    .sort((a, b) => b.text.length - a.text.length)
    .forEach(sentence => {
      const escapedText = sentence.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedText, 'gi');
      highlightedText = highlightedText.replace(regex, `***$&***`);
    });

  return highlightedText;
}
