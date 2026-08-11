import { supabase } from "../lib/supabase";

// ===============================
// EMAIL + PASSWORD SIGN UP
// ===============================
export const signUp = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } = await supabase.auth.signUp({
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

// ===============================
// EMAIL + PASSWORD LOGIN
// ===============================
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

// ===============================
// GOOGLE LOGIN / SIGNUP
// ===============================
export const signInWithGoogle = async () => {
  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

  return { data, error };
};

// ===============================
// RESEND EMAIL OTP
// ===============================
export const resendEmailOtp = async (email: string) => {
  const { data, error } =
    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
    });

  return { data, error };
};

// ===============================
// VERIFY EMAIL OTP
// ===============================
export const verifyEmailOtp = async (
  email: string,
  token: string
) => {
  const { data, error } =
    await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type: "email",
    });

  return { data, error };
};

// ===============================
// PASSWORD RESET
// ===============================
export const resetPassword = async (email: string) => {
  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/login`,
      }
    );

  return { data, error };
};

// ===============================
// SIGN OUT
// ===============================
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  return { error };
};