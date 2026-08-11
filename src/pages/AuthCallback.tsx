import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const completeOAuth = async () => {
      const url = new URL(window.location.href);
      const authError = url.searchParams.get("error_description");

      if (authError) {
        setError(authError);
        return;
      }

      const code = url.searchParams.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (!mounted) return;

      if (data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    completeOAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Google login failed</h1>
          <p className="mt-3 text-red-600">{error}</p>
          <button
            className="mt-5 rounded-lg border px-4 py-2"
            onClick={() => navigate("/login")}
          >
            Return to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Completing Google login...</p>
    </main>
  );
}