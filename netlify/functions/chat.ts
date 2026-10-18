import { CHATBOT_SYSTEM_PROMPT } from '../../src/knowledge';
import { getContextualResponse } from '../../src/chatbotEngine';

interface RequestBody {
  message?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export const handler = async (event: any) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || '{}');
    const message = body.message?.trim();
    const history = body.history || [];

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message cannot be empty.' }),
      };
    }

    if (message.length > 600) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message exceeds the maximum limit of 600 characters.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const contents: any[] = [
          {
            role: 'user',
            parts: [{ text: `System Instruction:\n${CHATBOT_SYSTEM_PROMPT}\n\nPlease acknowledge and wait for visitor questions.` }],
          },
          {
            role: 'model',
            parts: [{ text: "Understood! I am 'Ask Murari', Murarisai Tadepalli's virtual AI portfolio assistant. I will strictly answer based on his verified portfolio facts." }],
          },
        ];

        const recentHistory = history.slice(-6);
        for (const msg of recentHistory) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ reply: candidateText, source: 'gemini-ai' }),
            };
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiError);
      }
    }

    // Grounded knowledge base fallback
    const reply = getContextualResponse(message, history);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply, source: 'knowledge-base-fallback' }),
    };
  } catch (error: any) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
