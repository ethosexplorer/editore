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
      const { word, context, sentence, language = 'en-US' } = req.body;
      
      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      // Mock response if no API key
      if (!process.env.VITE_OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY not set, using mock synonyms");
        const mockSynonyms = generateEnhancedMockSynonyms(word, sentence || context);
        return res.status(200).json({
          word: word,
          synonyms: mockSynonyms,
          language: language,
          context: sentence || context,
          message: "Using mock synonyms - Set OPENAI_API_KEY for AI synonyms"
        });
      }

      const openai = new OpenAI({ 
        apiKey: process.env.VITE_OPENAI_API_KEY 
      });

      const contextInfo = sentence || context || '';
      const prompt = contextInfo 
        ? `Provide 6-8 highly relevant synonyms for "${word}" in this context: "${contextInfo}". 
           
Return JSON: {"synonyms": ["synonym1", "synonym2", ...]}`
        
        : `Provide 6-8 synonyms for "${word}".
           
Return JSON: {"synonyms": ["synonym1", "synonym2", ...]}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You provide context-aware synonyms. Return only valid JSON with a "synonyms" array.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      let synonyms = [];

      if (content) {
        try {
          const parsed = JSON.parse(content);
          synonyms = parsed.synonyms || parsed.words || parsed.alternatives || [];
        } catch (parseError) {
          console.error("Parse error:", parseError);
          synonyms = generateEnhancedMockSynonyms(word, contextInfo);
        }
      }

      synonyms = synonyms
        .filter(syn => syn && typeof syn === 'string')
        .map(syn => syn.trim())
        .filter(syn => {
          const cleanSyn = syn.toLowerCase();
          const cleanWord = word.toLowerCase();
          return cleanSyn !== cleanWord && syn.length > 1 && /^[a-zA-Z\s-]+$/.test(syn);
        })
        .slice(0, 8);

      if (synonyms.length === 0) {
        synonyms = generateEnhancedMockSynonyms(word, contextInfo);
      }

      return res.status(200).json({
        word: word,
        synonyms: [...new Set(synonyms)],
        language: language,
        context: contextInfo,
        count: synonyms.length,
        source: "ai_generated"
      });

    } catch (error) {
      console.error("Synonyms API error:", error);
      
      const mockSynonyms = generateEnhancedMockSynonyms(
        req.body.word, 
        req.body.sentence || req.body.context
      );
      
      return res.status(200).json({
        word: req.body.word,
        synonyms: mockSynonyms,
        language: req.body.language || 'en-US',
        context: req.body.sentence || req.body.context,
        error: "AI synonyms unavailable",
        source: "error_fallback"
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function generateEnhancedMockSynonyms(word, context = "") {
  const synonymDatabase = {
    // Common words
    good: ["excellent", "superb", "outstanding", "great", "fine", "splendid"],
    bad: ["poor", "terrible", "awful", "inferior", "dreadful", "horrible"],
    big: ["large", "huge", "substantial", "considerable", "massive", "sizeable"],
    small: ["tiny", "little", "compact", "miniature", "petite", "minute"],
    
    // Verbs
    make: ["create", "produce", "generate", "build", "construct", "craft"],
    use: ["utilize", "employ", "apply", "leverage", "deploy", "implement"],
    help: ["assist", "aid", "support", "facilitate", "enable", "benefit"],
    show: ["demonstrate", "display", "exhibit", "illustrate", "reveal", "present"],
    get: ["obtain", "acquire", "receive", "gain", "secure", "procure"],
    
    // Marketing/Business
    businesses: ["companies", "enterprises", "organizations", "firms", "corporations"],
    can: ["could", "may", "might", "able to", "capable of"],
    now: ["currently", "presently", "today", "at present"],
    interact: ["engage", "communicate", "connect", "interface"],
    clients: ["customers", "consumers", "patrons", "buyers"],
    with: ["using", "via", "through", "by means of"],
    previously: ["formerly", "earlier", "before", "prior"],
    unheard: ["unprecedented", "unknown", "novel", "new"],
    of: ["regarding", "concerning", "about", "relating to"],
    accuracy: ["precision", "correctness", "exactness", "reliability"],
    and: ["plus", "as well as", "along with", "also"],
    efficiency: ["effectiveness", "productivity", "performance"],
    thanks: ["due", "owing", "attributed", "because of"],
    to: ["toward", "for", "in order to"],
    artificial: ["synthetic", "simulated", "manufactured"],
    intelligence: ["intellect", "understanding", "reasoning"],
    which: ["that", "what", "this"],
    is: ["remains", "stands", "exists"],
    revolutionising: ["transforming", "changing", "reshaping"],
    the: ["this", "that", "such"],
    marketing: ["promotion", "advertising", "branding"],
    environment: ["landscape", "arena", "sphere", "field"],
    ai: ["artificial intelligence", "machine learning"],
    enables: ["allows", "permits", "empowers", "facilitates"],
    marketers: ["advertisers", "promoters", "professionals"],
    develop: ["create", "build", "design", "produce"],
    scalable: ["expandable", "flexible", "adaptable"],
    impactful: ["effective", "powerful", "influential"],
    personalised: ["customized", "tailored", "individualized"],
    campaigns: ["initiatives", "drives", "efforts", "programs"],
    by: ["through", "via", "using", "by means of"],
    utilising: ["using", "employing", "leveraging", "applying"],
    data: ["information", "statistics", "metrics", "analytics"],
    driven: ["powered", "fueled", "based", "guided"],
    insights: ["understanding", "knowledge", "intelligence"],
    automation: ["mechanization", "computerization"],
    predictive: ["forecasting", "anticipatory", "projective"],
    analytics: ["analysis", "metrics", "statistics"],
    this: ["the", "such", "said", "that"],
    article: ["piece", "post", "document", "publication"],
    examines: ["explores", "investigates", "analyzes"],
    main: ["primary", "key", "principal", "chief"],
    uses: ["applications", "purposes", "functions"],
    advantages: ["benefits", "merits", "strengths"],
    difficulties: ["challenges", "obstacles", "problems"],
    prospects: ["possibilities", "opportunities", "potential"],
    
    // Additional common words
    important: ["crucial", "vital", "essential", "critical"],
    different: ["distinct", "diverse", "varied", "unique"],
    problem: ["issue", "challenge", "difficulty", "obstacle"],
    solution: ["answer", "resolution", "remedy", "fix"]
  };

  const lowerWord = word.toLowerCase().replace(/[^\w'-]/g, '');
  
  if (synonymDatabase[lowerWord]) {
    return synonymDatabase[lowerWord];
  }
  
  for (const [key, synonyms] of Object.entries(synonymDatabase)) {
    if (lowerWord.includes(key) || key.includes(lowerWord)) {
      return synonyms;
    }
  }
  
  if (lowerWord.endsWith('ing')) {
    return ["performing", "executing", "conducting", "implementing"];
  }
  if (lowerWord.endsWith('ed')) {
    return ["completed", "finished", "accomplished", "executed"];
  }
  if (lowerWord.endsWith('ly')) {
    return ["quickly", "rapidly", "swiftly", "promptly"];
  }
  
  return ["alternative", "substitute", "replacement", "equivalent"];
}
