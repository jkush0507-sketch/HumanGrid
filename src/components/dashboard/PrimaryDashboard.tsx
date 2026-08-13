import {
  Ambulance,
  ArrowRight,
  Building2,
  Droplets,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Siren,
  Utensils,
} from "lucide-react";
import type { DashboardProfile } from "./dashboardTypes";

interface PrimaryDashboardProps {
  profile: DashboardProfile;
  onOpenAi: () => void;
}

const services = [
  {
    title: "Hospital",
    description: "Find urgent medical care nearby.",
    icon: <Building2 size={22} />,
    mode: "hospital",
  },
  {
    title: "Police",
    description: "Reach law-enforcement support.",
    icon: <Shield size={22} />,
    mode: "police",
  },
  {
    title: "Ambulance",
    description: "Request urgent medical transport.",
    icon: <Ambulance size={22} />,
    mode: "ambulance",
  },
  {
    title: "Blood bank",
    description: "Locate blood support nearby.",
    icon: <Droplets size={22} />,
    mode: "blood_bank",
  },
  {
    title: "Food support",
    description: "Find community food assistance.",
    icon: <Utensils size={22} />,
    mode: "food_support",
  },
  {
    title: "Shelter",
    description: "Find temporary safe shelter.",
    icon: <Home size={22} />,
    mode: "shelter",
  },
];

export default function PrimaryDashboard({
  profile,
  onOpenAi,
}: PrimaryDashboardProps) {
  const displayName =
    profile.full_name?.trim() ||
    profile.email?.split("@")[0] ||
    "there";

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-section-kicker">Your safety matters</p>
          <h2>Good to see you, {displayName}.</h2>
          <p>
            Get emergency guidance, nearby services, and trusted support from
            one place.
          </p>
        </div>

        <div className="dashboard-status-pill">
          <span className="dashboard-status-dot" />
          HumanGrid is ready
        </div>
      </section>

      <section className="dashboard-emergency-grid">
        <article className="dashboard-sos-card">
          <div className="dashboard-sos-icon">
            <Siren size={28} />
          </div>

          <div className="dashboard-sos-content">
            <p className="dashboard-card-eyebrow">Emergency action</p>
            <h2>Need immediate help?</h2>
            <p>
              Open the emergency panel to review options before contacting a
              service.
            </p>

            <a href="/sos" className="dashboard-light-button">
              Open emergency help
              <ArrowRight size={17} />
            </a>
          </div>
        </article>

        <article className="dashboard-ai-card">
          <div className="dashboard-ai-icon">
            <MessageCircle size={24} />
          </div>
          <p className="dashboard-card-eyebrow">HumanGrid AI</p>
          <h2>Not sure what to do?</h2>
          <p>
            Describe the situation and receive structured emergency guidance.
          </p>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={onOpenAi}
          >
            Ask HumanGrid AI
            <ArrowRight size={17} />
          </button>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-kicker">Get help faster</p>
            <h2>Nearby emergency services</h2>
          </div>

          <a href="/map" className="dashboard-text-link">
            Open map <ArrowRight size={16} />
          </a>
        </div>

        <div className="dashboard-service-grid">
          {services.map((service) => (
            <article className="dashboard-service-card" key={service.title}>
              <div className="dashboard-service-icon">{service.icon}</div>
              <div className="dashboard-service-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <a
                href={`/ai?mode=${service.mode}`}
                className="dashboard-service-action"
              >
                Find help
                <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">Quick access</p>
              <h2>Useful actions</h2>
            </div>
          </div>

          <div className="dashboard-quick-actions">
            <a href="/sos" className="dashboard-quick-action dashboard-quick-action-danger">
              <HeartPulse size={19} />
              <span>SOS help</span>
            </a>

            <button
              type="button"
              className="dashboard-quick-action"
              onClick={onOpenAi}
            >
              <MessageCircle size={19} />
              <span>AI guidance</span>
            </button>

            <a href="/map" className="dashboard-quick-action">
              <MapPin size={19} />
              <span>Open nearby map</span>
            </a>

            <a href="tel:112" className="dashboard-quick-action">
              <Phone size={19} />
              <span>Call 112</span>
            </a>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">Updates</p>
              <h2>Notifications</h2>
            </div>
            <BellPlaceholder />
          </div>

          <div className="dashboard-empty-state">
            <p>No new emergency notifications.</p>
            <span>System and request updates will appear here.</span>
          </div>
        </article>
      </section>
    </div>
  );
}

function BellPlaceholder() {
  return <span className="dashboard-panel-badge">0 new</span>;
}