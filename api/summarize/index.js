const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { text, length = 'medium' } = req.body;
    
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a summarization assistant. Create concise summaries while preserving key information."
        },
        { role: "user", content: `Summarize this text in ${length} length: "${text}"` },
      ],
      max_tokens: 300,
    });

    const summary = response.choices[0]?.message?.content || '';

    res.json({
      originalLength: text.length,
      summaryLength: summary.length,
      summary,
      reduction: Math.round(((text.length - summary.length) / text.length) * 100)
    });

  } catch (error) {
    res.status(500).json({ error: 'Summarization failed' });
  }
};
