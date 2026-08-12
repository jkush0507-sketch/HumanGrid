import { useEffect, useRef, useState } from "react";
import { AlertCircle, Send } from "lucide-react";
import type {
  ChatMessage,
  Coordinates,
  ServiceMode,
} from "@/types";
import { analyzeEmergency } from "@/services/gemini";
import { getServiceCard } from "@/services/emergency";
import { MessageBubble } from "./MessageBubble";

const MODE_PROMPTS: Record<ServiceMode, string> = {
  hospital:
    "Describe the medical emergency, symptoms, injuries, and when it started.",
  blood_bank:
    "What blood group is needed, how much is needed, and how urgent is it?",
  police:
    "Describe what happened, where it happened, and whether anyone is in immediate danger.",
  ambulance:
    "Describe the patient's condition and where medical transport is needed.",
  women_safety:
    "Tell me what is happening and whether you are in immediate danger right now.",
  child_safety:
    "Describe what happened, where the child was last seen, and whether the child may be in danger.",
  food_support:
    "How many people need food support, where are they located, and how urgently is help needed?",
  shelter:
    "Who needs shelter, where are they located, and are there safety or accessibility needs?",
  general_emergency:
    "Describe the emergency, where it is happening, and whether anyone is in immediate danger.",
};

interface ChatInterfaceProps {
  mode: ServiceMode;
  origin: Coordinates | null;
  onRequestLocation: () => void;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function ChatInterface({
  mode,
  origin,
  onRequestLocation,
  onSendSOS,
  onShareLocation,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    greeting(mode),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!origin) {
      onRequestLocation();
    }
  }, [mode, origin, onRequestLocation]);

  async function handleSend(): Promise<void> {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);
    setInput("");
    setLoading(true);

    try {
      const analysis = await analyzeEmergency(
        mode,
        text,
        origin
      );

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        analysis,
        createdAt: new Date().toISOString(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "HumanGrid AI could not complete that analysis. If anyone is in immediate danger, contact local emergency services directly.",
        createdAt: new Date().toISOString(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6"
        aria-live="polite"
        aria-label="HumanGrid AI conversation"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSendSOS={onSendSOS}
            onShareLocation={onShareLocation}
          />
        ))}

        {loading && (
          <div
            className="flex items-center gap-2 pl-8 text-sm text-ink-400"
            role="status"
            aria-label="HumanGrid AI is analyzing your message"
          >
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
            </span>
            Analyzing your situation...
          </div>
        )}
      </div>

      <div className="border-t border-ink-50 bg-white/70 p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="humangrid-ai-input">
            Describe your emergency
          </label>

          <textarea
            id="humangrid-ai-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={loading}
            placeholder={MODE_PROMPTS[mode]}
            className="input-field max-h-32 min-h-[42px] resize-none"
          />

          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!input.trim() || loading}
            aria-label="Send emergency description"
            className="btn-primary h-[42px] w-[42px] shrink-0 !rounded-full !px-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11px] text-ink-400">
            <AlertCircle size={13} />
            HumanGrid AI does not replace emergency professionals.
          </p>

          {!origin && (
            <button
              type="button"
              onClick={onRequestLocation}
              className="text-xs font-medium text-gold-700 hover:underline focus:outline-none focus:ring-2 focus:ring-gold"
            >
              Enable location for nearby services
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function greeting(mode: ServiceMode): ChatMessage {
  const card = getServiceCard(mode);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: `${card.title} mode is active. ${MODE_PROMPTS[mode]}`,
    createdAt: new Date().toISOString(),
  };
}