import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage, Coordinates, ServiceMode } from '@/types';
import { analyzeEmergency } from '@/services/gemini';
import { getServiceCard } from '@/services/emergency';
import { MessageBubble } from './MessageBubble';

const MODE_PROMPTS: Record<ServiceMode, string> = {
  hospital: 'Describe the medical emergency — who is affected and what symptoms are present?',
  blood_bank: 'What blood group is needed, and how urgently?',
  police: 'Describe what happened, including when and where.',
  ambulance: 'Where do you need the ambulance, and what is the condition of the patient?',
  women_safety: "You're safe here. Tell me what's happening right now.",
  child_safety: 'Tell me what happened and where the child was last seen.',
  food_support: 'How many people need food, and where are you located?',
  shelter: 'Who needs shelter, and are there any accessibility or safety needs?',
};

interface ChatInterfaceProps {
  mode: ServiceMode;
  origin: Coordinates | null;
  onRequestLocation: () => void;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function ChatInterface({ mode, origin, onRequestLocation, onSendSOS, onShareLocation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [greeting(mode)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([greeting(mode)]);
  }, [mode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!origin) onRequestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const analysis = await analyzeEmergency(mode, text, origin);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        analysis,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I couldn't complete that analysis. Please try again, or call your local emergency number directly.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onSendSOS={onSendSOS} onShareLocation={onShareLocation} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 pl-8 text-sm text-ink-400">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
            </span>
            Analyzing situation…
          </div>
        )}
      </div>

      <div className="border-t border-ink-50 bg-white/70 p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={MODE_PROMPTS[mode]}
            className="input-field max-h-32 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="btn-primary h-[42px] w-[42px] shrink-0 !rounded-full !px-0"
          >
            <Send size={16} />
          </button>
        </div>
        {!origin && (
          <button onClick={onRequestLocation} className="mt-2 text-xs font-medium text-gold-700 hover:underline">
            Enable location for nearby services →
          </button>
        )}
      </div>
    </div>
  );
}

function greeting(mode: ServiceMode): ChatMessage {
  const card = getServiceCard(mode);
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `${card.title} mode is active. ${MODE_PROMPTS[mode]}`,
    createdAt: new Date().toISOString(),
  };
}
