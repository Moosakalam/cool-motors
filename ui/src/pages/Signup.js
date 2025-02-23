// src/Signup.js
import "./css/Signup.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

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
  const [success, setSuccess] = useState("");
  const { user, loading: authLoading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/v1/users/signup", formData, {
        withCredentials: true,
      });
      setSuccess("Signup successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      setError("");
      alert(
        "A verification link has been sent to you. Please visit it to verify your email."
      );
      navigate("/"); // Redirect to home page after login
      window.location.reload(); // Refresh the page after login
    } catch (err) {
      setError(err.response.data.message || "Signup failed");
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
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
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
        <button type="submit" disabled={loading}>
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
    </div>
  );
}

export default Signup;
