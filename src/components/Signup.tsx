import {
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  signInWithGoogle,
  signUp,
} from "../services/auth";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  }

  function validatePhoneNumber(
    value: string
  ): boolean {
    return /^\+?\d{10,15}$/.test(value);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all required fields."
      );
      setLoading(false);
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(cleanPhone)) {
      setError(
        "Please enter a valid phone number."
      );
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(
        "You must accept the terms and conditions."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } =
        await signUp(
          cleanEmail,
          password,
          cleanName
        );

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        setSuccess(
          "Account created successfully. Please verify your email."
        );

        window.setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: cleanEmail,
              fullName: cleanName,
              phone: cleanPhone,
            },
          });
        }, 700);

        return;
      }

      setSuccess(
        "Account created. Please check your email to verify your account."
      );
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected signup error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup(): Promise<void> {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: googleError } =
        await signInWithGoogle();

      if (googleError) {
        setError(googleError.message);
      }
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Google signup failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">
          Sign Up for HumanGrid
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
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="+919876543210"
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

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
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(event) =>
                setAcceptTerms(
                  event.target.checked
                )
              }
              required
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

          <button
            type="submit"
            className="signup-button primary-button"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="signup-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-signup-button secondary-button"
          onClick={() => void handleGoogleSignup()}
          disabled={loading}
        >
          {loading
            ? "Connecting..."
            : "Sign Up with Google"}
        </button>

        <div className="signup-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}