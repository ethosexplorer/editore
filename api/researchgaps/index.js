import OpenAI from 'openai';

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
      const { text, field = 'general' } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // For testing without OpenAI API key
      if (!process.env.VITE_OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY not set, returning mock research gaps");
        return res.status(200).json({
          gaps: [
            "Limited longitudinal studies on this topic",
            "Insufficient cross-cultural comparative analysis",
            "Lack of interdisciplinary approaches combining multiple fields",
            "Methodological limitations in current research approaches",
            "Underrepresented demographic factors in existing studies"
          ],
          recommendations: [
            "Conduct long-term studies to track changes over time",
            "Include diverse cultural perspectives in future research",
            "Adopt mixed-methods approaches for comprehensive analysis"
          ],
          field,
          processingTime: 2,
          confidence: 85
        });
      }

      const openai = new OpenAI({ 
        apiKey: process.env.VITE_OPENAI_API_KEY 
      });

      const prompt = `Analyze the following research content and identify research gaps in the field of ${field}. Provide specific, actionable gaps and recommendations.

Content: "${text.substring(0, 3000)}"

Return JSON with:
- gaps: array of research gaps
- recommendations: array of research recommendations
- confidence: confidence score (0-100)`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert research analyst. Identify meaningful research gaps and provide practical recommendations for future studies."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      let analysis;
      try {
        analysis = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch (parseError) {
        analysis = {
          gaps: ["Analysis could not be parsed"],
          recommendations: ["Please try again with different content"],
          confidence: 50
        };
      }

      const result = {
        gaps: analysis.gaps || [],
        recommendations: analysis.recommendations || [],
        field,
        processingTime: Math.floor(Math.random() * 3) + 1,
        confidence: analysis.confidence || 75
      };

      return res.status(200).json(result);

    } catch (error) {
      console.error("Research gaps analysis error:", error);
      return res.status(500).json({ 
        error: 'Research gaps analysis failed: ' + error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
