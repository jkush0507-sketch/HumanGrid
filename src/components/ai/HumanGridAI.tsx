import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";
import * as Icons from "lucide-react";
import type {
  Coordinates,
  ServiceMode,
} from "@/types";
import { getServiceCard } from "@/services/emergency";
import {
  getCurrentPosition,
  LocationError,
} from "@/services/location";
import { ChatInterface } from "./ChatInterface";
import { AIModeSelector } from "./AIModeSelector";
import "./AI.css";

interface HumanGridAIProps {
  mode: ServiceMode | null;
  onClose: () => void;
  onModeChange?: (mode: ServiceMode) => void;
  onOpenSOS?: () => void;
}

export function HumanGridAI({
  mode,
  onClose,
  onModeChange,
  onOpenSOS,
}: HumanGridAIProps) {
  const [origin, setOrigin] =
  useState<Coordinates | null>(null);

const [locationError, setLocationError] =
  useState<string | null>(null);

const [toast, setToast] =
  useState<string | null>(null);

const closeButtonRef =
  useRef<HTMLButtonElement>(null);

useEffect(() => {
  // effects
}, []);

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (!mode) {
      return;
    }

    void requestLocation();
  }, [mode]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 4200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  async function requestLocation(): Promise<void> {
    try {
      const coordinates = await getCurrentPosition();

      setOrigin(coordinates);
      setLocationError(null);
    } catch (error: unknown) {
      const message =
        error instanceof LocationError
          ? error.message
          : "Location access is unavailable.";

      setLocationError(message);
    }
  }

  function handleOpenSOS(): void {
    if (onOpenSOS) {
      onOpenSOS();
      return;
    }

    setToast(
      "SOS is user-controlled. Open the SOS page when you are ready."
    );
  }

  async function handleShareLocation(): Promise<void> {
    if (!origin) {
      setToast(
        "Location is not available. Enable location access and try again."
      );
      return;
    }

    const locationText =
      `My HumanGrid location: ` +
      `https://www.google.com/maps?q=${origin.lat},${origin.lng}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "HumanGrid location",
          text: locationText,
        });

        setToast("Location sharing opened.");
        return;
      } catch {
        // The user may have cancelled sharing.
        // Clipboard fallback is attempted below.
      }
    }

    if (!navigator.clipboard) {
      setToast(
        "Location sharing is unavailable in this browser."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(locationText);
      setToast("Location link copied to clipboard.");
    } catch {
      setToast("The location link could not be copied.");
    }
  }

  if (!mode) {
    return null;
  }

  const card = getServiceCard(mode);

  const Icon =
    (Icons as unknown as Record<
      string,
      Icons.LucideIcon
    >)[card.icon] ?? Icons.AlertTriangle;

  return (
    <div
      className="humangrid-ai-overlay fixed inset-0 z-50 flex justify-end bg-ink-900/40 backdrop-blur-sm animate-fade-up"
      role="dialog"
      aria-modal="true"
      aria-label="HumanGrid AI emergency assistant"
    >
      <div className="humangrid-ai-panel flex h-full w-full max-w-lg flex-col bg-surface shadow-glass-lg sm:rounded-l-2xl">
        <header className="flex items-center justify-between border-b border-ink-50 bg-white/80 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-gold">
              <Icon size={18} />
            </span>

            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold text-ink-800">
                {card.title}
              </p>

              <p className="flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={11} />

                {origin
                  ? "Location available"
                  : locationError ?? "Checking location..."}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close HumanGrid AI"
            className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-700/5 hover:text-ink-700 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <X size={18} />
          </button>
        </header>

        {onModeChange && (
          <div className="border-b border-ink-50 bg-white/70 px-5 py-3">
            <AIModeSelector
              value={mode}
              onChange={onModeChange}
            />
          </div>
        )}

        {locationError && (
          <div
            className="humangrid-ai-location-warning flex items-start gap-2 border-b border-ink-50 bg-amber-50 px-5 py-3 text-xs text-amber-900"
            role="status"
          >
            <ShieldAlert
              size={15}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Nearby recommendations are limited
              </p>

              <p className="mt-1">
                {locationError} You can still use HumanGrid AI
                without location access.
              </p>

              <button
                type="button"
                onClick={() => void requestLocation()}
                className="mt-2 font-semibold underline underline-offset-2"
              >
                Try location again
              </button>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1">
          <ChatInterface
            key={mode}
            mode={mode}
            origin={origin}
            onRequestLocation={() =>
              void requestLocation()
            }
            onSendSOS={handleOpenSOS}
            onShareLocation={() =>
              void handleShareLocation()
            }
          />
        </div>

        {toast && (
          <div
            className="absolute bottom-24 left-1/2 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2 rounded-xl bg-ink-800 px-4 py-3 text-sm text-white shadow-glass-lg animate-pop-in"
            role="status"
          >
            <CheckCircle2
              size={15}
              className="shrink-0 text-gold"
            />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}