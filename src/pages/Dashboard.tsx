<<<<<<< HEAD
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
=======
﻿import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Layout/DashboardHeader';
import EmergencyCard from '../components/Emergency/EmergencyCard';
>>>>>>> 8d9ac64bc967aa03bd5462770bf31062e061924a

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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <section className="mb-8 sm:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-2">
            {getGreeting()}, Jatin.
          </h1>
          <p className="text-base sm:text-xl text-gray-600">How can HumanGrid help you today?</p>
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-primary mb-6">
            Emergency Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <EmergencyCard key={i} {...emergencyCards[0]} isLoading />
                ))
              : emergencyCards.map((card, index) => (
                  <EmergencyCard key={index} {...card} />
                ))}
          </div>
        </section>

        <section className="bg-primary rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="font-playfair text-xl sm:text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/map')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">View Map</p>
              <p className="text-sm text-gray-300">Find nearby services</p>
            </button>
            <button
              onClick={() => navigate('/ai')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">Chat Assistant</p>
              <p className="text-sm text-gray-300">AI-powered help</p>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">Profile</p>
              <p className="text-sm text-gray-300">View your info</p>
            </button>
          </div>
        </section>
      </main>
    </div>
>>>>>>> 8d9ac64bc967aa03bd5462770bf31062e061924a
  );
}