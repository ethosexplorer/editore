const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { text, language } = req.body;
    
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze this text for grammar, spelling, and punctuation errors. Return a JSON array of issues with this structure:
    [{
      "id": number,
      "type": "grammar" | "spelling" | "punctuation",
      "subtype": string,
      "severity": "error" | "warning" | "suggestion",
      "text": string,
      "suggestion": string,
      "explanation": string,
      "rule": string,
      "position": { "start": number, "end": number }
    }]
    
    Text to analyze:
    "${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a grammar checking engine. Analyze text for grammar, spelling, and punctuation errors. Provide specific corrections with explanations and grammar rules. Always return valid JSON array."
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const issues = JSON.parse(response.choices[0]?.message?.content || '[]');

    res.status(200).json({
      issues,
      wordCount: text.split(/\s+/).filter(w => w).length,
      characterCount: text.length
    });

  } catch (error) {
    console.error("Grammar check error:", error);
    res.status(500).json({ error: 'Grammar check failed' });
  }
};
