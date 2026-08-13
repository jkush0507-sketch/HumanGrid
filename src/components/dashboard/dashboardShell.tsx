import { useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import type {
  DashboardNavItem,
  DashboardProfile,
  DashboardRole,
} from "./dashboardTypes";
import "./dashboard.css";

interface DashboardShellProps {
  profile: DashboardProfile;
  role: DashboardRole;
  children: ReactNode;
}

export default function DashboardShell({
  profile,
  role,
  children,
}: DashboardShellProps) {
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const displayName =
    profile.full_name?.trim() ||
    profile.email?.split("@")[0] ||
    "HumanGrid user";

  const firstLetter = displayName.charAt(0).toUpperCase();

  const navItems: DashboardNavItem[] =
    role === "primary"
      ? [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            label: "Emergency help",
            href: "/sos",
            icon: <HeartPulse size={18} />,
          },
          {
            label: "Nearby services",
            href: "/map",
            icon: <Map size={18} />,
          },
          {
            label: "HumanGrid AI",
            href: "/ai",
            icon: <HelpCircle size={18} />,
          },
        ]
      : [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            label: "Help requests",
            href: "#help-requests",
            icon: <ClipboardList size={18} />,
          },
          {
            label: "Nearby requests",
            href: "/map",
            icon: <Map size={18} />,
          },
          {
            label: "Helper status",
            href: "#helper-status",
            icon: <ShieldCheck size={18} />,
          },
        ];

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // The existing AuthContext handles Supabase sign-out errors.
    }
  }

  return (
    <div className="dashboard-app">
      <aside
        className={`dashboard-sidebar ${
          mobileMenuOpen ? "dashboard-sidebar-open" : ""
        }`}
      >
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">H</div>
          <div>
            <p className="dashboard-brand-name">HumanGrid</p>
            <p className="dashboard-brand-tagline">
              Help. Anytime. Anywhere.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={21} />
          </button>
        </div>

        <nav className="dashboard-navigation" aria-label="Dashboard navigation">
          <p className="dashboard-nav-label">Workspace</p>

          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`dashboard-nav-link ${
                item.href === "/dashboard"
                  ? "dashboard-nav-link-active"
                  : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-trust-box">
            <ShieldCheck size={19} />
            <div>
              <strong>HumanGrid care</strong>
              <span>
                {role === "primary"
                  ? "Help is available when you need it."
                  : "Your support can make a difference."}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-signout-button"
            onClick={handleSignOut}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            type="button"
            className="dashboard-mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="dashboard-header-title">
            <p className="dashboard-overline">
              {role === "primary" ? "Emergency assistance" : "Support workspace"}
            </p>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell size={19} />
              <span className="dashboard-notification-dot" />
            </button>

            <div className="dashboard-profile-wrapper">
              <button
                type="button"
                className="dashboard-profile-button"
                onClick={() => setProfileMenuOpen((current) => !current)}
                aria-expanded={profileMenuOpen}
              >
                <span className="dashboard-avatar">{firstLetter}</span>
                <span className="dashboard-profile-name">{displayName}</span>
                <ChevronDown size={16} />
              </button>

              {profileMenuOpen && (
                <div className="dashboard-profile-menu">
                  <div className="dashboard-profile-menu-heading">
                    <UserRound size={16} />
                    <span>{profile.email || "Account profile"}</span>
                  </div>

                  <button type="button" onClick={handleSignOut}>
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}