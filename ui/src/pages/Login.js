import "./css/Login.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react"; // Import icons for toggle
import eye from "../utils/images/eye.svg";
import eyeOff from "../utils/images/eye-off.svg";
import { useAuth } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
      const redirectTo =
        new URLSearchParams(location.search).get("redirect") || "/";
      // alert("logged in");
      navigate(redirectTo);
      window.location.reload(); // Refresh after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setPassword(""); // Clear password field on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const redirectTo =
        new URLSearchParams(location.search).get("redirect") || "/";
      alert("You are already logged in.");
      navigate(redirectTo);
    }
  }, [user, authLoading, navigate, location]);

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <img src={eye} alt="" />
              ) : (
                <img src={eyeOff} alt="" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="login-footer">
        <p className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <div className="signup-prompt">
          <p>
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
