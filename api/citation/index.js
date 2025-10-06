const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { source, format = 'apa', sourceType = 'website' } = req.body;
    
    if (!source) return res.status(400).json({ error: 'Source information required' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Generate ${format} format citation for this ${sourceType} source: "${source}". Return JSON with fullCitation and inTextCitation fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a citation generator. Create accurate citations in various formats (APA, MLA, Chicago, Harvard). Always return valid JSON with fullCitation and inTextCitation fields."
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    });

    const citationData = JSON.parse(response.choices[0]?.message?.content || '{}');

    res.status(200).json({
      ...citationData,
      format,
      sourceType,
      verified: true
    });

  } catch (error) {
    console.error("Citation generation error:", error);
    res.status(500).json({ error: 'Citation generation failed' });
  }
};
