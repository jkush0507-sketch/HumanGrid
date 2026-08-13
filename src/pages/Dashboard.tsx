import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { supabase } from "../lib/supabase";
import DashboardShell from "../components/dashboard/dashboardShell";
import PrimaryDashboard from "../components/dashboard/PrimaryDashboard";
import SecondaryDashboard from "../components/dashboard/SecondaryDashboard";
import type {
  DashboardProfile,
  DashboardRole,
} from "../components/dashboard/dashboardTypes";
import { HumanGridAI } from "../components/ai/HumanGridAI";
import type { ServiceMode } from "../types";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<ServiceMode | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) {
        if (mounted) {
          setProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);
      setProfileError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, mobile, user_type")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setProfileError(error.message);
        setProfileLoading(false);
        return;
      }

      if (!data) {
        setProfileError(
          "Your account profile could not be found. Please contact HumanGrid support."
        );
        setProfileLoading(false);
        return;
      }

      const role =
        data.user_type === "primary" || data.user_type === "secondary"
          ? data.user_type
          : null;

      if (!role) {
        setProfileError(
          "Your account role is missing. Please contact HumanGrid support."
        );
        setProfileLoading(false);
        return;
      }

      setProfile({
        user_id: data.user_id,
        full_name: data.full_name,
        email: data.email,
        mobile: data.mobile,
        user_type: role,
      });
      setProfileLoading(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (authLoading || profileLoading) {
    return (
      <div className="dashboard-loading-screen">
        <div className="dashboard-loader" />
        <p>Preparing your HumanGrid dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profileError || !profile || !profile.user_type) {
    return (
      <div className="dashboard-loading-screen dashboard-error-screen">
        <div className="dashboard-error-card">
          <h1>Dashboard unavailable</h1>
          <p>
            {profileError ||
              "We could not load your HumanGrid profile safely."}
          </p>
          <a href="/login" className="dashboard-primary-button">
            Return to login
          </a>
        </div>
      </div>
    );
  }

  const role: DashboardRole = profile.user_type;

  return (
    <>
      <DashboardShell profile={profile} role={role}>
        {role === "primary" ? (
          <PrimaryDashboard
            profile={profile}
            onOpenAi={() => setAiMode("hospital")}
          />
        ) : (
          <SecondaryDashboard profile={profile} />
        )}
      </DashboardShell>

      {aiMode && (
        <HumanGridAI
          mode={aiMode}
          onClose={() => setAiMode(null)}
        />
      )}
    </>
  );
}