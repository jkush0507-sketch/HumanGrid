import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp, signInWithGoogle } from "../services/auth";
import "./Signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await signUp(
        email.trim().toLowerCase(),
        password,
        fullName.trim()
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      /*
       * Supabase email confirmation flow.
       * User must enter the OTP sent to their email.
       */
      if (data.user) {
        setSuccess(
          "Account created successfully! Please check your email for the verification code."
        );

        navigate("/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            fullName: fullName.trim(),
          },
        });

        return;
      }

      setSuccess(
        "Account created! Please check your email for the verification code."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message);
      }

      /*
       * If Google OAuth starts successfully,
       * Supabase redirects the browser automatically.
       */
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Google signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        <h2 className="signup-title">
          Create your HumanGrid account
        </h2>

        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}

        {success && (
          <div className="signup-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="signup-form"
        >

          {/* FULL NAME */}

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group password-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="form-group password-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {/* TERMS */}

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) =>
                setAcceptTerms(e.target.checked)
              }
            />

            <label htmlFor="acceptTerms">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* SIGN UP */}

          <button
            type="submit"
            className="signup-button primary-button"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        {/* DIVIDER */}

        <div className="signup-divider">
          <span>OR</span>
        </div>

        {/* GOOGLE */}

        <button
          type="button"
          className="google-signup-button secondary-button"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          {loading
            ? "Connecting..."
            : "Sign Up with Google"}
        </button>

        {/* LOGIN */}

        <div className="signup-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;