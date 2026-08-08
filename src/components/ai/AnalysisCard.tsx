import { AlertTriangle, CheckCircle2, PhoneCall, Radio, Share2 } from 'lucide-react';
import type { EmergencyAnalysis, Severity } from '@/types';
import { NearbyServices } from './NearbyServices';

const SEVERITY_STYLES: Record<Severity, { badge: string; ring: string }> = {
  LOW: { badge: 'bg-low/10 text-low', ring: 'border-low/30' },
  MEDIUM: { badge: 'bg-medium/10 text-medium', ring: 'border-medium/30' },
  HIGH: { badge: 'bg-gold/20 text-gold-700', ring: 'border-gold/40' },
  CRITICAL: { badge: 'bg-critical/10 text-critical', ring: 'border-critical/40' },
};

interface AnalysisCardProps {
  analysis: EmergencyAnalysis;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function AnalysisCard({ analysis, onSendSOS, onShareLocation }: AnalysisCardProps) {
  const severityStyle = SEVERITY_STYLES[analysis.severity];
  const primaryContact = analysis.contacts[0];
  const primaryService = analysis.nearby_services[0];

  return (
    <div className={`glass-card animate-fade-up border p-5 sm:p-6 ${severityStyle.ring}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            {analysis.category}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-semibold text-ink-800">
            {analysis.problem}
          </h3>
        </div>
        <span className={`severity-pill ${severityStyle.badge}`}>
          <AlertTriangle size={13} />
          {analysis.severity}
        </span>
      </div>

      {(analysis.blood_group || analysis.danger_level) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.blood_group && (
            <span className="rounded-full bg-ink-700/5 px-3 py-1 text-xs font-semibold text-ink-700">
              Blood group: {analysis.blood_group}
            </span>
          )}
          {analysis.danger_level && (
            <span className="rounded-full bg-ink-700/5 px-3 py-1 text-xs font-semibold text-ink-700">
              Danger level: {analysis.danger_level}
            </span>
          )}
        </div>
      )}

      {analysis.required_services.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Required resources
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {analysis.required_services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-medium text-ink-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.action_steps.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Immediate actions
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {analysis.action_steps.map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm text-ink-700">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-low" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.nearby_services.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Nearby services
          </p>
          <div className="mt-2">
            <NearbyServices services={analysis.nearby_services} />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-50 pt-4">
        {primaryContact && (
          <a href={`tel:${primaryContact.value}`} className="btn-primary">
            <PhoneCall size={15} />
            Call now
          </a>
        )}
        {primaryService?.lat && primaryService?.lng && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${primaryService.lat},${primaryService.lng}`}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Navigate
          </a>
        )}
        <button onClick={onSendSOS} className="btn-gold">
          <Radio size={15} />
          Send SOS
        </button>
        <button onClick={onShareLocation} className="btn-outline">
          <Share2 size={15} />
          Share location
        </button>
      </div>
    </div>
  );
}
