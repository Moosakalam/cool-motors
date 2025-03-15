// src/Signup.js
import "./css/Signup.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import eye from "../utils/images/eye.svg";
import eyeOff from "../utils/images/eye-off.svg";
import Alert from "../utils/Alert";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [success, setSuccess] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") setPassword(value);
    if (name === "passwordConfirm") setPasswordConfirm(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/signup`,
        formData,
        {
          withCredentials: true,
        }
      );
      setSuccess("Signup successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      setError("");
      setShowAlert(true);
      // alert(
      //   "A verification link has been sent to you. Please visit it to verify your email."
      // );
      // navigate("/"); // Redirect to home page after login
      // window.location.reload(); // Refresh the page after login
    } catch (err) {
      setError(err.message || "Signup failed");
      setPassword("");
      setPasswordConfirm("");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      alert("You are already logged in.");
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="container">
      <h2>Signup</h2>
      <br></br>
      <form
        onSubmit={handleSubmit}
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
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
        <input
          type={showPassword ? "text" : "password"}
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <div className="phone-number-container">
          <span className="phone-code">+91</span> {/* Hardcoded +91 */}
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            maxLength="10"
            className="phone-input" // Add a class for styling
          />
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div style={{ marginTop: "20px" }}>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
      {showAlert && (
        <Alert
          message="A verification link has been sent to you. Please visit it to verify your email."
          onClose={() => {
            navigate("/");
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default Signup;
