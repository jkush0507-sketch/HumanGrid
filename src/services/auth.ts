import { supabase } from "../lib/supabaseClient";

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

export const verifyEmailOtp = async (
  email: string,
  token: string
) => {
  return await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: "email",
  });
};

export const resendEmailOtp = async (
  email: string
) => {
  return await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
  });
};

export const resetPassword = async (
  email: string
) => {
  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo:
          `${window.location.origin}/login`,
      }
    );

  return { data, error };
};

export const signInWithPhone = async (
  phone: string
) => {
  const { data, error } =
    await supabase.auth.signInWithOtp({
      phone: phone.trim(),
    });

  return { data, error };
};

export const verifyPhoneOtp = async (
  phone: string,
  token: string
) => {
  const { data, error } =
    await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: token.trim(),
      type: "sms",
    });

  return { data, error };
};

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

export const signOut = async () => {
  const { error } =
    await supabase.auth.signOut();

  return { error };
};