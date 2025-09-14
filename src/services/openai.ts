import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export interface ParaphraseOptions {
  tone?: 'formal' | 'casual' | 'academic' | 'creative';
  length?: 'shorter' | 'same' | 'longer';
}

export interface GrammarCheckResult {
  correctedText: string;
  suggestions: Array<{
    original: string;
    suggestion: string;
    reason: string;
    type: 'grammar' | 'spelling' | 'style' | 'punctuation';
  }>;
}

export class OpenAIService {
  async paraphraseText(text: string, options: ParaphraseOptions = {}): Promise<string> {
    try {
      const { tone = 'formal', length = 'same' } = options;
      
      const prompt = `Please paraphrase the following text with these requirements:
- Tone: ${tone}
- Length: ${length === 'shorter' ? 'make it more concise' : length === 'longer' ? 'expand with more detail' : 'keep similar length'}
- Maintain the original meaning
- Use different vocabulary and sentence structure
- Make it natural and fluent

Text to paraphrase: "${text}"

Provide only the paraphrased text without any additional commentary.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert writing assistant specializing in paraphrasing text while maintaining meaning and improving clarity.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('Error paraphrasing text:', error);
      throw new Error('Failed to paraphrase text. Please try again.');
    }
  }

  async checkGrammar(text: string): Promise<GrammarCheckResult> {
    try {
      const prompt = `Please analyze the following text for grammar, spelling, style, and punctuation errors. Provide:
1. The corrected version of the text
2. A list of specific suggestions with explanations

Format your response as JSON with this structure:
{
  "correctedText": "the corrected version",
  "suggestions": [
    {
      "original": "original text/phrase",
      "suggestion": "corrected text/phrase",
      "reason": "explanation of the correction",
      "type": "grammar|spelling|style|punctuation"
    }
  ]
}

Text to check: "${text}"`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert grammar checker and writing assistant. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      try {
        const result = JSON.parse(content);
        return {
          correctedText: result.correctedText || text,
          suggestions: result.suggestions || []
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          correctedText: content,
          suggestions: []
        };
      }
    } catch (error) {
      console.error('Error checking grammar:', error);
      throw new Error('Failed to check grammar. Please try again.');
    }
  }

  async improveWriting(text: string): Promise<string> {
    try {
      const prompt = `Please improve the following text by:
- Enhancing clarity and readability
- Improving sentence structure and flow
- Using more precise vocabulary
- Maintaining the original meaning and tone
- Making it more engaging

Text to improve: "${text}"

Provide only the improved text without any additional commentary.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert writing coach specializing in improving text clarity, style, and engagement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.6
      });

      return response.choices[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('Error improving writing:', error);
      throw new Error('Failed to improve writing. Please try again.');
    }
  }
}

export const openAIService = new OpenAIService();