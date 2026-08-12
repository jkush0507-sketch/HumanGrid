import {
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Radio,
  Share2,
  ShieldAlert,
} from "lucide-react";
import type {
  EmergencyAnalysis,
  Severity,
} from "@/types";
import { NearbyServices } from "./NearbyServices";

const SEVERITY_STYLES: Record<
  Severity,
  {
    badge: string;
    ring: string;
    label: string;
  }
> = {
  LOW: {
    badge: "bg-low/10 text-low",
    ring: "border-low/30",
    label: "Low priority",
  },
  MEDIUM: {
    badge: "bg-medium/10 text-medium",
    ring: "border-medium/30",
    label: "Medium priority",
  },
  HIGH: {
    badge: "bg-gold/20 text-gold-700",
    ring: "border-gold/40",
    label: "High priority",
  },
  CRITICAL: {
    badge: "bg-critical/10 text-critical",
    ring: "border-critical/40",
    label: "Critical priority",
  },
};

interface AnalysisCardProps {
  analysis: EmergencyAnalysis;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function AnalysisCard({
  analysis,
  onSendSOS,
  onShareLocation,
}: AnalysisCardProps) {
  const severityStyle = SEVERITY_STYLES[analysis.severity];
  const primaryContact = analysis.contacts[0];
  const primaryService = analysis.nearby_services[0];

  const immediateActions: string[] =
  analysis.immediate_actions ??
  analysis.action_steps;
  
  const warnings = analysis.warnings ?? [];
  const nextSteps = analysis.next_steps ?? [];

  return (
    <article
      className={`glass-card animate-fade-up border p-5 sm:p-6 ${severityStyle.ring}`}
      aria-label="HumanGrid AI emergency analysis"
    >
      {analysis.severity === "CRITICAL" && (
        <div
          className="mb-4 flex items-start gap-2 rounded-xl border border-critical/30 bg-critical/10 p-3 text-sm text-critical"
          role="alert"
        >
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Immediate emergency action may be required.
            </p>
            <p className="mt-1 text-xs">
              If anyone is in immediate danger, contact local emergency
              services now. HumanGrid AI has not contacted anyone for you.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            {analysis.category}
          </p>

          <h3 className="mt-1 font-display text-lg font-semibold text-ink-800">
            {analysis.summary || analysis.problem}
          </h3>

          {analysis.problem &&
            analysis.summary &&
            analysis.problem !== analysis.summary && (
              <p className="mt-2 text-sm text-ink-500">
                {analysis.problem}
              </p>
            )}
        </div>

        <span
          className={`severity-pill ${severityStyle.badge}`}
          aria-label={`Severity: ${severityStyle.label}`}
        >
          <AlertTriangle size={13} />
          {analysis.severity}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {analysis.recommended_service && (
          <span className="rounded-full bg-ink-700/5 px-3 py-1 text-xs font-semibold text-ink-700">
            Recommended: {formatLabel(analysis.recommended_service)}
          </span>
        )}

        {analysis.source === "fallback" && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            General fallback guidance
          </span>
        )}

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

      {analysis.why && (
        <div className="mt-4 rounded-xl bg-ink-700/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Why this is recommended
          </p>
          <p className="mt-1 text-sm text-ink-700">
            {analysis.why}
          </p>
        </div>
      )}

      {analysis.required_services.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Relevant support
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {analysis.required_services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-medium text-ink-700"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {immediateActions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Immediate actions
          </p>

          <ul className="mt-1.5 space-y-2">
            {immediateActions.map((step) => (
              <li
                key={step}
                className="flex items-start gap-2 text-sm text-ink-700"
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-low"
                />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
            <ShieldAlert size={14} />
            Important warnings
          </p>

          <ul className="mt-1.5 space-y-1">
            {warnings.map((warning) => (
              <li
                key={warning}
                className="text-sm text-amber-900"
              >
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nextSteps.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Next steps
          </p>

          <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-ink-700">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {analysis.nearby_services.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Nearby service suggestions
          </p>

          <div className="mt-2">
            <NearbyServices
              services={analysis.nearby_services}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-50 pt-4">
        {primaryContact && (
          <a
            href={`tel:${primaryContact.value}`}
            className="btn-primary"
          >
            <PhoneCall size={15} />
            Call {primaryContact.label}
          </a>
        )}

        {primaryService?.lat !== undefined &&
          primaryService.lng !== undefined && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${primaryService.lat},${primaryService.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Navigate
            </a>
          )}

        <button
          type="button"
          onClick={onSendSOS}
          className="btn-gold"
        >
          <Radio size={15} />
          Open SOS
        </button>

        <button
          type="button"
          onClick={onShareLocation}
          className="btn-outline"
        >
          <Share2 size={15} />
          Share location
        </button>
      </div>
    </article>
  );
}

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}