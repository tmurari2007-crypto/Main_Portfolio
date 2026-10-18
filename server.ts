import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CHATBOT_SYSTEM_PROMPT } from './src/knowledge.js';
import { getContextualResponse } from './src/chatbotEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20kb' }));

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Ask Murari AI Backend',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
  });
});

/**
 * Chat endpoint: POST /api/chat
 */
app.post('/api/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      error: 'Too many requests. Please slow down and try again in a moment.'
    });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  if (message.length > 600) {
    return res.status(400).json({ error: 'Message exceeds the maximum limit of 600 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // 1. If Gemini API Key is configured, attempt call using Google Generative AI REST API
  if (apiKey) {
    try {
      // Build conversation contents for Gemini REST API
      const contents = [];

      // System instruction as context
      contents.push({
        role: 'user',
        parts: [{ text: `System Instruction:\n${CHATBOT_SYSTEM_PROMPT}\n\nPlease acknowledge and wait for visitor questions.` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: "Understood! I am 'Ask Murari', Murarisai Tadepalli's virtual AI portfolio assistant. I will strictly answer based on his verified portfolio facts." }]
      });

      // Append up to last 6 history messages
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
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
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return res.json({
            reply: candidateText,
            source: 'gemini-ai'
          });
        }
      }
      console.warn('Gemini API call was non-ok, falling back to local grounded knowledge engine.');
    } catch (err) {
      console.error('Error invoking Gemini API:', err);
    }
  }

  // 2. Local Grounded Knowledge Engine (Fallback or Zero-API-Key mode)
  const localReply = getContextualResponse(message, history);
  return res.json({
    reply: localReply,
    source: apiKey ? 'knowledge-base-fallback' : 'knowledge-base'
  });
});

app.listen(PORT, () => {
  console.log(`[Ask Murari Backend] Running on http://localhost:${PORT}`);
});
