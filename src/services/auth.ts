import { supabase } from "../lib/supabase";


// ================================
// SIGN UP — EMAIL + PASSWORD
// ================================

export const signUp = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } =
    await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

  return { data, error };
};


// ================================
// LOGIN — EMAIL + PASSWORD
// ================================

export const signIn = async (
  email: string,
  password: string
) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

  return { data, error };
};


// ================================
// GOOGLE AUTH
// ================================

export const signInWithGoogle = async () => {
  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          `${window.location.origin}/dashboard`,
      },
    });

  return { data, error };
};


// ================================
// EMAIL OTP VERIFICATION
// ================================

export const verifyEmailOtp = async (
  email: string,
  token: string
) => {
  return await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token,
    type: "email",
  });
};


// ================================
// RESEND EMAIL OTP
// ================================

export const resendEmailOtp = async (
  email: string
) => {
  return await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
  });
};


// ================================
// PROFILE
// ================================

export const upsertProfile = async (
  userId: string,
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    user_type?: "primary" | "secondary";
  }
) => {
  return await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        full_name: profile.full_name,
        email: profile.email,
        mobile: profile.phone ?? "",
        user_type: profile.user_type ?? "primary",
      },
      {
        onConflict: "user_id",
      }
    );
};