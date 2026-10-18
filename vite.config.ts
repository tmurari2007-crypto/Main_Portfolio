import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import dotenv from 'dotenv';
import { CHATBOT_SYSTEM_PROMPT } from './src/knowledge';
import { getContextualResponse } from './src/chatbotEngine';

dotenv.config();

// Custom Vite plugin to handle /api/chat directly inside Vite dev server
function chatbotApiPlugin(): Plugin {
  return {
    name: 'chatbot-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const message = parsed.message;
              const history = parsed.history || [];

              if (!message || typeof message !== 'string' || !message.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
                return;
              }

              if (message.length > 600) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message exceeds the maximum limit of 600 characters.' }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

              // If Gemini API Key exists, call Gemini model
              if (apiKey) {
                try {
                  const contents = [
                    {
                      role: 'user',
                      parts: [{ text: `System Instruction:\n${CHATBOT_SYSTEM_PROMPT}\n\nAcknowledge your identity.` }]
                    },
                    {
                      role: 'model',
                      parts: [{ text: "Understood! I am 'Ask Murari', Murarisai Tadepalli's virtual AI portfolio assistant." }]
                    }
                  ];

                  const recentHistory = history.slice(-6);
                  for (const msg of recentHistory) {
                    contents.push({
                      role: msg.role === 'user' ? 'user' : 'model',
                      parts: [{ text: msg.content }]
                    });
                  }

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
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ reply: candidateText, source: 'gemini-ai' }));
                      return;
                    }
                  }
                } catch (e) {
                  console.warn('Gemini request failed in Vite middleware, falling back to local engine:', e);
                }
              }

              // Local grounded knowledge base
              const reply = getContextualResponse(message, history);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                reply,
                source: apiKey ? 'knowledge-base-fallback' : 'knowledge-base'
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server error processing request.' }));
            }
          });
          return;
        }

        if (req.url === '/api/health' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'ok',
            service: 'Ask Murari Vite API',
            hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
          }));
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), chatbotApiPlugin()],
});
