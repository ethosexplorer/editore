import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({
        multiples: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });

      const [fields, files] = await form.parse(req);
      const file = files.file?.[0];

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('Processing file:', file.originalFilename);

      // Read file content
      const fileContent = fs.readFileSync(file.filepath, 'utf8');
      
      // Use OpenAI for intelligent analysis
      const analysis = await analyzeWithOpenAI(fileContent, file.originalFilename);
      
      // Clean up uploaded file
      fs.unlinkSync(file.filepath);

      return res.status(200).json(analysis);

    } catch (error) {
      console.error("Dataset processing error:", error);
      
      // Fallback to basic analysis
      try {
        const form = formidable({
          multiples: false,
          maxFileSize: 10 * 1024 * 1024,
        });
        
        const [fields, files] = await form.parse(req);
        const file = files.file?.[0];
        const fileContent = fs.readFileSync(file.filepath, 'utf8');
        const fallbackAnalysis = generateDatasetAnalysis(fileContent, file.originalFilename);
        fs.unlinkSync(file.filepath);
        return res.status(200).json(fallbackAnalysis);
      } catch (fallbackError) {
        return res.status(500).json({ 
          error: 'Dataset processing failed: ' + error.message,
          note: 'Please check your OpenAI API key and try again'
        });
      }
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function analyzeWithOpenAI(content, filename) {
  // Check if OpenAI API key is available
  if (!process.env.VITE_OPENAI_API_KEY) {
    console.log('OpenAI API key not found, using fallback analysis');
    return generateDatasetAnalysis(content, filename);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY,
    });

    const prompt = `Analyze this research dataset/document and provide a comprehensive analysis.

DOCUMENT: "${filename}"
CONTENT: "${content.substring(0, 8000)}"

Please provide a JSON response with:
{
  "summary": "2-3 paragraph summary",
  "keyFindings": ["array of 3-5 important findings"],
  "researchAreas": ["main topics covered"],
  "methodology": "research methods used",
  "recommendations": ["suggestions for further research"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert research data analyst. Analyze research documents and return valid JSON.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    return {
      fileName: filename,
      fileSize: content.length,
      summary: analysis.summary || generateSummary(content, filename),
      keyFindings: analysis.keyFindings || extractKeyFindings(content),
      researchAreas: analysis.researchAreas || extractResearchAreas(content),
      methodology: analysis.methodology || "AI analysis of document content",
      recommendations: analysis.recommendations || generateRecommendations(content),
      statistics: generateBasicStatistics(content),
      processingTime: 2,
      confidence: 85,
      aiGenerated: true
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return generateDatasetAnalysis(content, filename);
  }
}

function generateDatasetAnalysis(content, filename) {
  return {
    fileName: filename,
    fileSize: content.length,
    summary: generateSummary(content, filename),
    keyFindings: extractKeyFindings(content),
    researchAreas: extractResearchAreas(content),
    methodology: "Automated content analysis",
    recommendations: generateRecommendations(content),
    statistics: generateBasicStatistics(content),
    processingTime: 1,
    confidence: 70,
    aiGenerated: false,
    note: "Basic analysis - OpenAI API not available"
  };
}

function generateBasicStatistics(content) {
  const words = content.split(/\s+/).filter(w => w);
  const lines = content.split('\n').filter(l => l.trim());
  
  return {
    wordCount: words.length,
    characterCount: content.length,
    lineCount: lines.length,
    hasNumbers: /\d/.test(content),
    hasPercentages: /\d+%/.test(content),
  };
}

function generateSummary(content, filename) {
  return `Dataset file "${filename}" processed successfully. Contains ${content.length} characters with structured research data suitable for analysis.`;
}

function extractKeyFindings(content) {
  const findings = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if ((trimmed.match(/\d+%/) || trimmed.match(/\d+\.\d+/)) && trimmed.length > 20) {
      findings.push(trimmed);
    }
  });
  
  return findings.length > 0 ? findings.slice(0, 3) : [
    "Quantitative data points identified",
    "Structured research content",
    "Suitable for academic analysis"
  ];
}

function extractResearchAreas(content) {
  const domains = ['Healthcare', 'Technology', 'Education', 'Business', 'Science'];
  const contentLower = content.toLowerCase();
  return domains.filter(domain => 
    contentLower.includes(domain.toLowerCase())
  ).slice(0, 2);
}

function generateRecommendations(content) {
  return [
    "Perform statistical analysis on quantitative data",
    "Create visualizations for key findings",
    "Compare with existing research literature"
  ];
}
