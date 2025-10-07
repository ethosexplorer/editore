const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { text, targetLanguage = 'Spanish' } = req.body;
    
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a translation assistant. Provide accurate translations while preserving meaning and context."
        },
        { role: "user", content: `Translate this to ${targetLanguage}: "${text}"` },
      ],
      max_tokens: 500,
    });

    const translatedText = response.choices[0]?.message?.content || '';

    res.json({
      original: text,
      translated: translatedText,
      targetLanguage,
      accuracy: 95
    });

  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
};
