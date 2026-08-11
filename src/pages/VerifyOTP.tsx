import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "../components/ui/OTPInput";
import {
  resendEmailOtp,
  upsertProfile,
  verifyEmailOtp,
} from "../services/auth";

import "./VerifyOTP.css";

type UserType = "primary" | "secondary";

interface VerifyState {
  email?: string;
  fullName?: string;
  userType?: UserType;
}

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as VerifyState | null) ?? {};

  const email = state.email ?? "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // VERIFY EMAIL OTP
  // =========================
  const handleVerify = async () => {
    if (!email) {
      setError("Signup email is missing. Please start signup again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data, error: verifyError } = await verifyEmailOtp(
        email,
        otp
      );

      if (verifyError) {
        throw verifyError;
      }

      if (!data.user) {
        throw new Error(
          "Verification succeeded, but no session was returned."
        );
      }

      const metadata = data.user.user_metadata ?? {};

      const fullName =
        state.fullName ??
        metadata.full_name ??
        "";

      const userType: UserType =
        state.userType === "secondary" ||
        metadata.user_type === "secondary"
          ? "secondary"
          : "primary";

      // Mobile is NOT used for OTP.
      // It is only stored in the profile if it exists
      // in Supabase metadata.
      const mobile =
        metadata.mobile ??
        metadata.phone ??
        "";

      const { error: profileError } = await upsertProfile(
        data.user.id,
        {
          full_name: fullName,
          email: data.user.email ?? email,
          phone: mobile,
          user_type: userType,
        }
      );

      if (profileError) {
        throw profileError;
      }

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Email OTP verification error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND EMAIL OTP
  // =========================
  const handleResend = async () => {
    if (!email) {
      setError("Signup email is missing. Please start signup again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { error: resendError } =
        await resendEmailOtp(email);

      if (resendError) {
        throw resendError;
      }

      setSuccess(
        "A new verification code has been sent to your email."
      );
    } catch (err) {
      console.error("Resend email OTP error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-card">

        {/* LOGO */}
        <div className="verify-otp-logo">
          <img
            src="/favicon.svg"
            alt="HumanGrid"
          />
        </div>

        {/* TITLE */}
        <h1 className="verify-otp-title">
          Verify your email
        </h1>

        {/* SUBTITLE */}
        <p className="verify-otp-subtitle">
          Enter the 6-digit verification code sent to{" "}
          <span className="verify-otp-email">
            {email || "your email"}
          </span>
        </p>

        {/* ERROR */}
        {error && (
          <div className="verify-otp-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="verify-otp-success">
            {success}
          </div>
        )}

        {/* OTP INPUT */}
        <div className="verify-otp-inputs">
          <OTPInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={loading}
          />
        </div>

        {/* VERIFY */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="verify-otp-button"
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        {/* RESEND */}
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="verify-otp-resend"
        >
          Resend verification code
        </button>

        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="verify-otp-back"
        >
          ← Back to Sign Up
        </button>

      </div>
    </div>
  );
}