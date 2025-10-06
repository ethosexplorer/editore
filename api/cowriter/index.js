const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { prompt, context, tone = 'professional', action = 'write' } = req.body;
    
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let systemPrompt = "You are a helpful writing assistant.";
    let userPrompt = prompt;

    if (action === 'tone-optimize') {
      systemPrompt = "You are a tone optimizer. Convert text to formal academic style while maintaining the original meaning.";
      userPrompt = `Optimize this text to ${tone} tone: "${prompt}"${context ? `\nContext: ${context}` : ''}`;
    } else if (action === 'paraphrase') {
      systemPrompt = "You are a paraphrasing assistant. Rewrite text to avoid plagiarism while preserving meaning.";
      userPrompt = `Paraphrase this text: "${prompt}"`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '';

    res.status(200).json({
      original: prompt,
      result: content,
      tone,
      action,
      wordCount: content.split(' ').length
    });

  } catch (error) {
    console.error("Co-writing error:", error);
    res.status(500).json({ error: 'Co-writing failed' });
  }
};
