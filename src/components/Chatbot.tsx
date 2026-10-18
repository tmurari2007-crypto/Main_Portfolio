import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "Who is Murarisai Tadepalli?",
  "What are his technical skills?",
  "Tell me about his projects.",
  "What is his CGPA and educational background?",
  "What is his experience with AI and IoT?",
  "How can I contact him?"
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi there! 👋 I'm **Ask Murari**, your AI portfolio assistant.\n\nCurious about Murari's skills, projects, education, or technical interests? Ask me anything, and I'll help you learn more about his journey!",
  timestamp: 'Just now'
};

/**
 * Format markdown safely for chat display:
 * Converts **bold**, *italic*, lists, and markdown links [text](url) into safe clickable links.
 */
function renderFormattedMessage(text: string): React.ReactNode {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-[13px]">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1.5" />;
        }

        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;

        // Parse links: [label](url)
        const parts: React.ReactNode[] = [];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIdx = 0;
        let match;

        while ((match = linkRegex.exec(cleanLine)) !== null) {
          if (match.index > lastIdx) {
            parts.push(renderInlineFormatting(cleanLine.substring(lastIdx, match.index)));
          }
          const label = match[1];
          const href = match[2];
          parts.push(
            <a
              key={match.index}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-[#ff1f1f] underline font-semibold hover:opacity-80 transition-opacity"
            >
              {label}
            </a>
          );
          lastIdx = match.index + match[0].length;
        }

        if (lastIdx < cleanLine.length) {
          parts.push(renderInlineFormatting(cleanLine.substring(lastIdx)));
        }

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f1f] mt-1.5 flex-shrink-0" />
              <span>{parts}</span>
            </div>
          );
        }

        return <p key={lIdx}>{parts}</p>;
      })}
    </div>
  );
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Simple bold and italic support
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={pIdx} className="font-bold text-[#0d0d0d]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={pIdx} className="italic text-[#5e5e5e]">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for context
      const history = newMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I didn't receive a valid answer. Please try asking again.";

      const botMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: "I'm temporarily unable to reach the server. Please check your connection or reach out to Murari directly at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-auto select-none">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[calc(100vw-32px)] sm:w-[390px] h-[520px] max-h-[82vh] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-[rgba(13,13,13,0.08)] flex flex-col overflow-hidden mb-3.5 transform-gpu transition-all duration-300 origin-bottom-right"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#0d0d0d] text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#ff1f1f] flex items-center justify-center text-white shadow-md">
                  <Bot size={18} />
                </div>
                {/* Assistant active pulse */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
              </div>

              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-white leading-none">
                  Ask Murari
                </h3>
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-wider">
                  Portfolio AI Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearConversation}
                title="Restart Conversation"
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fcfcfc] text-[#0d0d0d]">
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? 'bg-[#ff1f1f] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-[#1e293b] rounded-bl-none border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-[13px] leading-relaxed select-text">{msg.content}</p>
                    ) : (
                      <div className="select-text">{renderFormattedMessage(msg.content)}</div>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-[#94a3b8] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Suggested Question Chips (Only shown if less than 3 messages) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <span className="font-mono text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-2 px-1">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left font-sans text-xs px-3 py-1.5 rounded-full bg-white border border-[#ff1f1f]/20 hover:border-[#ff1f1f] hover:bg-[#ff1f1f]/5 text-[#0d0d0d] font-medium transition-colors shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-black/5 shadow-2xs w-fit">
                <div className="w-2 h-2 rounded-full bg-[#ff1f1f] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#ff1f1f] animate-bounce [animation-delay:0.15s]" />
                <div className="w-2 h-2 rounded-full bg-[#ff1f1f] animate-bounce [animation-delay:0.3s]" />
                <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider ml-1">
                  Murari AI Thinking...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[rgba(13,13,13,0.06)] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={600}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Murari..."
              disabled={isLoading}
              className="flex-1 bg-black/5 rounded-full px-4 py-2.5 text-xs text-[#0d0d0d] placeholder:text-[#94a3b8] outline-none border border-transparent focus:border-[#ff1f1f]/30 transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-[#ff1f1f] text-white hover:scale-105 active:scale-95 shadow-md'
                  : 'bg-black/10 text-black/30 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="relative flex items-center">
        {/* Tooltip on hover or initially */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-[#0d0d0d] text-white shadow-lg border border-white/10 animate-fade-in">
            <span className="font-mono text-[11px] font-medium tracking-wide">
              Ask me about Murari
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-white/60 hover:text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          data-cursor={isOpen ? "Close" : "Chat"}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_12px_36px_rgba(255,31,31,0.35)] transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-[#0d0d0d] text-white rotate-90' : 'bg-[#ff1f1f] text-white'
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </div>
  );
};
