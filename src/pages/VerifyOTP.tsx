import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "../components/ui/OTPInput";
import { supabase } from "@/lib/supabase";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    (location.state as { email?: string } | null)?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!email) {
      setError("Email information is missing.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email information is missing.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: resendError } =
        await supabase.auth.signInWithOtp({
          email,
        });

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setSuccess("A new OTP has been sent to your email.");
    } catch (err) {
      console.error(err);
      setError("Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-card">

        <div className="verify-otp-logo">
          <img
            src="/favicon.svg"
            alt="HumanGrid"
          />
        </div>

        <h1 className="verify-otp-title">
          Verify your email
        </h1>

        <p className="verify-otp-subtitle">
          Enter the 6-digit verification code sent to{" "}
          <span className="verify-otp-email">
            {email || "your email"}
          </span>
        </p>

        {error && (
          <div className="verify-otp-error">
            {error}
          </div>
        )}

        {success && (
          <div className="verify-otp-success">
            {success}
          </div>
        )}

        <div className="verify-otp-inputs">
          <OTPInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="verify-otp-button"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="verify-otp-resend"
        >
          Resend verification code
        </button>

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
};

export default VerifyOTP;