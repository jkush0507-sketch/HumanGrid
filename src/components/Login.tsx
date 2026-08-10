import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/humangrid-logo.png";
import { useState } from "react";
import { signIn, signInWithGoogle } from "../services/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  try {
    setLoading(true);

    const { error } = await signIn(
      email,
      password
    );

    if (error) {
  alert(error.message);
  return;
}

navigate("/dashboard");

    alert("Login successful.");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="login-page">
      <div className="login-visual">
        <div className="login-visual-overlay">
          <span className="login-badge">♥</span>
          <h2>Help. Anytime. Anywhere.</h2>
          <p>
            One account gets you connected to hospitals, blood banks, police,
            shelters and every emergency service on HumanGrid.
          </p>
          <ul className="login-visual-points">
            <li>Verified emergency contacts near you</li>
            <li>24/7 support, always one tap away</li>
            <li>Trusted by 10,000+ people across the country</li>
          </ul>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div className="login-logo">
            <img src={logo} alt="HumanGrid Logo" className="login-logo-mark" />
            <div>
              <h1>HumanGrid</h1>
              <p className="login-tagline">Help. Anytime. Anywhere.</p>
            </div>
          </div>

          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Log in to reach the right help, right on time.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-row">
              <label className="login-checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="login-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
              {!loading && <span className="login-btn-arrow">→</span>}
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="login-social-row">
            <button
  className="login-social-btn"
  type="button"
  onClick={async () => {
    try {
      setLoading(true);

      const { error } = await signInWithGoogle();

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      console.error(error);
      alert("Google login failed.");
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
>
  Google
</button>
            <button className="login-social-btn" type="button">
              Phone OTP
            </button>
          </div>

          <p className="login-footer-text">
            New to HumanGrid?{" "}
            <Link to="/signup" className="login-link login-link-strong">
  Create an account
</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;