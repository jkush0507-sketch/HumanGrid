import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";
import { AnalysisCard } from "./AnalysisCard";

interface MessageBubbleProps {
  message: ChatMessage;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function MessageBubble({ message, onSendSOS, onShareLocation }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="humangrid-ai-message humangrid-ai-message-user">
        <div className="humangrid-ai-user-bubble">
          <span className="humangrid-ai-message-label">You</span>
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="humangrid-ai-message humangrid-ai-message-assistant">
      <div className="humangrid-ai-assistant-row">
        <span className="humangrid-ai-assistant-icon"><Sparkles size={14} /></span>
        {message.content && !message.analysis && (
          <div className="humangrid-ai-text-bubble">
            <span className="humangrid-ai-message-label">HumanGrid AI</span>
            <p>{message.content}</p>
          </div>
        )}
      </div>
      {message.analysis && (
        <div className="humangrid-ai-analysis-wrapper">
          <AnalysisCard analysis={message.analysis} onSendSOS={onSendSOS} onShareLocation={onShareLocation} />
        </div>
      )}
    </div>
  );
}