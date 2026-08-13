<<<<<<< HEAD
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
=======
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
>>>>>>> 8d9ac64bc967aa03bd5462770bf31062e061924a

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

<<<<<<< HEAD
=======
  if (!isSupabaseConfigured) return <>{children}</>;

>>>>>>> 8d9ac64bc967aa03bd5462770bf31062e061924a
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
<<<<<<< HEAD
}

export default ProtectedRoute;
=======
}
>>>>>>> 8d9ac64bc967aa03bd5462770bf31062e061924a
