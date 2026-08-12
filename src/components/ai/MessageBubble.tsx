import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";
import { AnalysisCard } from "./AnalysisCard";

interface MessageBubbleProps {
  message: ChatMessage;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function MessageBubble({
  message,
  onSendSOS,
  onShareLocation,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-ink-700 px-4 py-2.5 text-sm text-white shadow-glass">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
            You
          </p>
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 animate-fade-up">
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-700"
          aria-hidden="true"
        >
          <Sparkles size={13} />
        </span>

        {message.content && !message.analysis && (
          <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/80 px-4 py-2.5 text-sm text-ink-700 shadow-glass">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              HumanGrid AI
            </p>
            <p>{message.content}</p>
          </div>
        )}
      </div>

      {message.analysis && (
        <div className="pl-8">
          <AnalysisCard
            analysis={message.analysis}
            onSendSOS={onSendSOS}
            onShareLocation={onShareLocation}
          />
        </div>
      )}
    </div>
  );
}