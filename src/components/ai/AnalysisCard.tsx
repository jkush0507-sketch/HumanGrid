import { AlertTriangle, CheckCircle2, PhoneCall, Radio, Share2, ShieldAlert } from "lucide-react";
import type { EmergencyAnalysis, Severity } from "@/types";
import { NearbyServices } from "./NearbyServices";

const SEVERITY_LABELS: Record<Severity, string> = { LOW: "Low priority", MEDIUM: "Medium priority", HIGH: "High priority", CRITICAL: "Critical priority" };

interface AnalysisCardProps {
  analysis: EmergencyAnalysis;
  onSendSOS: () => void;
  onShareLocation: () => void;
}

export function AnalysisCard({ analysis, onSendSOS, onShareLocation }: AnalysisCardProps) {
  const actions: string[] = analysis.immediate_actions ?? analysis.action_steps;
  const warnings = analysis.warnings ?? [];
  const nextSteps = analysis.next_steps ?? [];
  const primaryContact = analysis.contacts[0];

  return (
    <article className={`humangrid-ai-analysis humangrid-ai-analysis-${analysis.severity.toLowerCase()}`} aria-label="HumanGrid AI emergency analysis">
      {analysis.severity === "CRITICAL" && (
        <div className="humangrid-ai-critical-alert" role="alert">
          <ShieldAlert size={18} />
          <div>
            <strong>Immediate emergency action may be required.</strong>
            <p>If anyone is in immediate danger, contact local emergency services now. HumanGrid AI has not contacted anyone for you.</p>
          </div>
        </div>
      )}

      <div className="humangrid-ai-analysis-header">
        <div>
          <span className="humangrid-ai-analysis-category">{analysis.category}</span>
          <h3>{analysis.summary || analysis.problem}</h3>
          {analysis.problem && analysis.summary && analysis.problem !== analysis.summary && <p className="humangrid-ai-problem">{analysis.problem}</p>}
        </div>
        <span className="humangrid-ai-severity">
          <AlertTriangle size={13} />
          {analysis.severity}
          <span className="humangrid-ai-sr-only">{SEVERITY_LABELS[analysis.severity]}</span>
        </span>
      </div>

      <div className="humangrid-ai-tags">
        {analysis.recommended_service && <span>Recommended: {formatLabel(analysis.recommended_service)}</span>}
        {analysis.source === "fallback" && <span className="humangrid-ai-fallback-tag">General fallback guidance</span>}
        {analysis.blood_group && <span>Blood group: {analysis.blood_group}</span>}
        {analysis.danger_level && <span>Danger level: {analysis.danger_level}</span>}
      </div>

      {analysis.why && (
        <section className="humangrid-ai-analysis-section humangrid-ai-why">
          <h4>Why this is recommended</h4>
          <p>{analysis.why}</p>
        </section>
      )}

      {analysis.required_services.length > 0 && (
        <section className="humangrid-ai-analysis-section">
          <h4>Relevant support</h4>
          <div className="humangrid-ai-service-tags">
            {analysis.required_services.map((service: string) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </section>
      )}

      {actions.length > 0 && (
        <section className="humangrid-ai-analysis-section">
          <h4>Immediate actions</h4>
          <ul className="humangrid-ai-action-list">
            {actions.map((action) => (
              <li key={action}>
                <CheckCircle2 size={15} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {warnings.length > 0 && (
        <section className="humangrid-ai-analysis-section humangrid-ai-warnings">
          <h4><ShieldAlert size={14} /> Important warnings</h4>
          <ul>
            {warnings.map((warning: string) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      )}

      {nextSteps.length > 0 && (
        <section className="humangrid-ai-analysis-section">
          <h4>Next steps</h4>
          <ol className="humangrid-ai-next-steps">
            {nextSteps.map((step: string) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {analysis.nearby_services.length > 0 && (
        <section className="humangrid-ai-analysis-section">
          <h4>Nearby service suggestions</h4>
          <NearbyServices services={analysis.nearby_services} />
        </section>
      )}

      <div className="humangrid-ai-analysis-actions">
        {primaryContact && (
          <a href={`tel:${primaryContact.value}`} className="humangrid-ai-button humangrid-ai-button-primary">
            <PhoneCall size={15} />
            Call {primaryContact.label}
          </a>
        )}
        <button type="button" onClick={onSendSOS} className="humangrid-ai-button humangrid-ai-button-danger">
          <Radio size={15} />
          Open SOS
        </button>
        <button type="button" onClick={onShareLocation} className="humangrid-ai-button humangrid-ai-button-outline">
          <Share2 size={15} />
          Share location
        </button>
      </div>
    </article>
  );
}

function formatLabel(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}