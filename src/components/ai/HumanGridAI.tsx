import { useEffect, useRef, useState } from "react";
import { CheckCircle2, MapPin, ShieldAlert, X } from "lucide-react";
import * as Icons from "lucide-react";
import type { Coordinates, ServiceMode } from "@/types";
import { getServiceCard } from "@/services/emergency";
import { getCurrentPosition, LocationError } from "@/services/location";
import { ChatInterface } from "./ChatInterface";
import { AIModeSelector } from "./AIModeSelector";
import "./AI.css";

interface HumanGridAIProps {
  mode: ServiceMode | null;
  onClose: () => void;
  onModeChange?: (mode: ServiceMode) => void;
  onOpenSOS?: () => void;
}

export function HumanGridAI({ mode, onClose, onModeChange, onOpenSOS }: HumanGridAIProps) {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mode) return;
    void requestLocation();
  }, [mode]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function requestLocation(): Promise<void> {
    try {
      const coordinates = await getCurrentPosition();
      setOrigin(coordinates);
      setLocationError(null);
    } catch (error: unknown) {
      const message = error instanceof LocationError ? error.message : "Location access is unavailable.";
      setLocationError(message);
    }
  }

  function handleOpenSOS(): void {
    if (onOpenSOS) {
      onOpenSOS();
      return;
    }
    setToast("SOS is user-controlled. Open the SOS page when you are ready.");
  }

  async function handleShareLocation(): Promise<void> {
    if (!origin) {
      setToast("Location is not available. Enable location access and try again.");
      return;
    }
    const locationText = `My HumanGrid location: https://www.google.com/maps?q=${origin.lat},${origin.lng}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "HumanGrid location", text: locationText });
        setToast("Location sharing opened.");
        return;
      } catch {
        // User cancelled
      }
    }
    if (!navigator.clipboard) {
      setToast("Location sharing is unavailable in this browser.");
      return;
    }
    try {
      await navigator.clipboard.writeText(locationText);
      setToast("Location link copied to clipboard.");
    } catch {
      setToast("The location link could not be copied.");
    }
  }

  if (!mode) return null;

  const card = getServiceCard(mode);
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon] ?? Icons.AlertTriangle;

  return (
    <div className="humangrid-ai-overlay" role="dialog" aria-modal="true" aria-label="HumanGrid AI emergency assistant">
      <div className="humangrid-ai-panel">
        <header className="humangrid-ai-header">
          <div className="humangrid-ai-title-group">
            <span className="humangrid-ai-title-icon"><Icon size={19} /></span>
            <div className="humangrid-ai-title-copy">
              <p>{card.title}</p>
              <span><MapPin size={12} />{origin ? "Location available" : locationError ?? "Checking location..."}</span>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close HumanGrid AI" className="humangrid-ai-close">
            <X size={19} />
          </button>
        </header>
        {onModeChange && (
          <div className="humangrid-ai-mode-area">
            <AIModeSelector value={mode} onChange={onModeChange} />
          </div>
        )}
        {locationError && (
          <div className="humangrid-ai-location-warning" role="status">
            <ShieldAlert size={17} />
            <div>
              <strong>Nearby recommendations are limited</strong>
              <p>{locationError} You can still use HumanGrid AI without location access.</p>
              <button type="button" onClick={() => void requestLocation()}>Try location again</button>
            </div>
          </div>
        )}
        <div className="humangrid-ai-body">
          <ChatInterface key={mode} mode={mode} origin={origin} onRequestLocation={() => void requestLocation()} onSendSOS={handleOpenSOS} onShareLocation={() => void handleShareLocation()} />
        </div>
        {toast && (
          <div className="humangrid-ai-toast" role="status">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}