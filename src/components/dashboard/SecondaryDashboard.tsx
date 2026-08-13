import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { DashboardProfile } from "./dashboardTypes";

interface SecondaryDashboardProps {
  profile: DashboardProfile;
}

export default function SecondaryDashboard({
  profile,
}: SecondaryDashboardProps) {
  const displayName =
    profile.full_name?.trim() ||
    profile.email?.split("@")[0] ||
    "helper";

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome dashboard-welcome-secondary">
        <div>
          <p className="dashboard-section-kicker">Support workspace</p>
          <h2>Welcome, {displayName}.</h2>
          <p>
            Review support requests, manage your availability, and help people
            in your area.
          </p>
        </div>

        <div className="dashboard-helper-status">
          <span className="dashboard-status-dot" />
          Available to help
        </div>
      </section>

      <section className="dashboard-helper-summary">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <ClipboardList size={22} />
          </div>
          <span>Open requests</span>
          <strong>0</strong>
          <small>Requests awaiting support</small>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Clock3 size={22} />
          </div>
          <span>Active support</span>
          <strong>0</strong>
          <small>Currently assigned to you</small>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <CheckCircle2 size={22} />
          </div>
          <span>Completed help</span>
          <strong>0</strong>
          <small>Your completed assistance</small>
        </article>
      </section>

      <section className="dashboard-secondary-grid">
        <article className="dashboard-panel dashboard-request-panel" id="help-requests">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">Help requests</p>
              <h2>Requests near you</h2>
            </div>
            <Users size={21} className="dashboard-heading-icon" />
          </div>

          <div className="dashboard-request-empty">
            <div className="dashboard-empty-icon">
              <ClipboardList size={24} />
            </div>
            <h3>No nearby requests yet</h3>
            <p>
              New support requests will appear here when they are available.
            </p>
            <a href="/map" className="dashboard-primary-button">
              View nearby area
              <ArrowRight size={17} />
            </a>
          </div>
        </article>

        <article className="dashboard-panel" id="helper-status">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">Your status</p>
              <h2>Helper availability</h2>
            </div>
            <ShieldCheck size={21} className="dashboard-heading-icon" />
          </div>

          <div className="dashboard-availability-card">
            <div className="dashboard-availability-top">
              <span className="dashboard-status-dot" />
              <strong>Available to help</strong>
            </div>
            <p>
              You can review and accept support requests in your nearby area.
            </p>

            <button type="button" className="dashboard-outline-button">
              Manage availability
            </button>
          </div>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">Navigation</p>
              <h2>Support tools</h2>
            </div>
          </div>

          <div className="dashboard-quick-actions">
            <a href="/map" className="dashboard-quick-action">
              <MapPin size={19} />
              <span>Open nearby map</span>
            </a>

            <a href="/map" className="dashboard-quick-action">
              <Navigation size={19} />
              <span>Plan navigation</span>
            </a>

            <a href="#activity" className="dashboard-quick-action">
              <ClipboardList size={19} />
              <span>View activity</span>
            </a>
          </div>
        </article>

        <article className="dashboard-panel" id="activity">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-section-kicker">History</p>
              <h2>Recent activity</h2>
            </div>
          </div>

          <div className="dashboard-empty-state">
            <p>No support activity yet.</p>
            <span>Your accepted and completed requests will appear here.</span>
          </div>
        </article>
      </section>
    </div>
  );
}