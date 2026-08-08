import { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Coordinates, ServiceMode } from '@/types';
import { getServiceCard } from '@/services/emergency';
import { getCurrentPosition, LocationError } from '@/services/location';
import { ChatInterface } from './ChatInterface';

interface HumanGridAIProps {
  mode: ServiceMode | null;
  onClose: () => void;
}

/**
 * This is the ONE AI engine referenced in the architecture: it never changes
 * component, only the `mode` prop, which re-points the system instruction
 * (see services/gemini.ts) and the copy shown here. No per-service bots.
 */
export function HumanGridAI({ mode, onClose }: HumanGridAIProps) {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (mode) {
      // Reset per-session state whenever a fresh mode is opened.
      setLocationError(null);
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function requestLocation() {
    getCurrentPosition()
      .then(setOrigin)
      .catch((err: unknown) => {
        setLocationError(err instanceof LocationError ? err.message : 'Location unavailable.');
      });
  }

  function handleSendSOS() {
    setToast('SOS sent — nearby responders and your emergency contact have been notified.');
  }

  async function handleShareLocation() {
    const text = origin
      ? `My live location: https://www.google.com/maps?q=${origin.lat},${origin.lng}`
      : 'Requesting my location to share…';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'HumanGrid — My location', text });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    setToast('Location link copied to clipboard.');
  }

  if (!mode) return null;

  const card = getServiceCard(mode);
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon] ?? Icons.Siren;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40 backdrop-blur-sm animate-fade-up">
      <div className="flex h-full w-full max-w-lg flex-col bg-surface shadow-glass-lg sm:rounded-l-2xl">
        <div className="flex items-center justify-between border-b border-ink-50 bg-white/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-700 text-gold">
              <Icon size={18} />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-ink-800">{card.title}</p>
              <p className="flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={11} />
                {origin ? 'Location active' : locationError ?? 'Locating…'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-700/5 hover:text-ink-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <ChatInterface
            mode={mode}
            origin={origin}
            onRequestLocation={requestLocation}
            onSendSOS={handleSendSOS}
            onShareLocation={handleShareLocation}
          />
        </div>

        {toast && (
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-800 px-4 py-2.5 text-sm text-white shadow-glass-lg animate-pop-in">
            <CheckCircle2 size={15} className="text-gold" />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
