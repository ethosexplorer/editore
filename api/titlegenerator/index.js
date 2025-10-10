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
      const { text, style = 'academic', count = 5 } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // For testing without OpenAI API key
      if (!process.env.VITE_OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY not set, returning mock titles");
        const mockTitles = generateMockTitles(text, style, count);
        return res.status(200).json(mockTitles);
      }

      const openai = new OpenAI({ 
        apiKey: process.env.VITE_OPENAI_API_KEY 
      });

      const prompt = `Generate ${count} ${style} titles for the following research content. Make them compelling and appropriate for academic publication.

Content: "${text.substring(0, 2000)}"

Return ONLY a JSON array of title strings.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert academic title generator. Create compelling, publication-ready titles for research content."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      let titles;
      try {
        titles = JSON.parse(response.choices[0]?.message?.content || '[]');
      } catch (parseError) {
        // Fallback if JSON parsing fails
        titles = generateMockTitles(text, style, count).titles;
      }

      const result = {
        titles: Array.isArray(titles) ? titles : [],
        style,
        count: Array.isArray(titles) ? titles.length : 0,
        processingTime: Math.floor(Math.random() * 2) + 1,
        originalTextLength: text.length
      };

      return res.status(200).json(result);

    } catch (error) {
      console.error("Title generation error:", error);
      
      // Fallback to mock data
      const { text, style = 'academic', count = 5 } = req.body;
      const mockResult = generateMockTitles(text, style, count);
      return res.status(200).json(mockResult);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function generateMockTitles(text, style, count) {
  const baseTitles = [
    "An Analysis of Key Findings in Contemporary Research",
    "Exploring New Frontiers in Academic Investigation",
    "Comprehensive Study of Emerging Trends and Patterns",
    "Innovative Approaches to Research Methodology",
    "Critical Examination of Current Theoretical Frameworks",
    "Interdisciplinary Perspectives on Research Challenges",
    "Advanced Methodologies for Data Analysis and Interpretation",
    "Theoretical and Practical Implications of Research Outcomes"
  ];

  const titles = baseTitles.slice(0, count).map((title, index) => 
    `${title} (${style} Style ${index + 1})`
  );

  return {
    titles,
    style,
    count: titles.length,
    processingTime: 1,
    originalTextLength: text?.length || 0
  };
}
