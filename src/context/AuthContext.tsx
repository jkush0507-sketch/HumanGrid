import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;

  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<void>;

  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;

  signInWithGoogle: () => Promise<void>;

  sendPasswordReset: (
    email: string
  ) => Promise<void>;

  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data, error } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error(
          "Failed to get session:",
          error
        );
      }

      setSession(data.session);
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,

    async signInWithPassword(
      email,
      password
    ) {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        throw error;
      }
    },

    async signUpWithPassword(
      email,
      password,
      fullName
    ) {
      const { error } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

      if (error) {
        throw error;
      }
    },

    async signInWithGoogle() {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/dashboard`,
          },
        });

      if (error) {
        throw error;
      }
    },

    async sendPasswordReset(email) {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo:
              `${window.location.origin}/login`,
          }
        );

      if (error) {
        throw error;
      }
    },

    async signOut() {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSession(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}