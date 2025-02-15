import React, { useState } from "react";
import axios from "axios";
import "./css/ForgotPassword.css"; // Add your styles here

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/users/forgotPassword",
        { email },
        {
          withCredentials: true,
        }
      );
      setMessage(
        response.data.message || "Reset link sent to your email.(Mailtrap)"
      );
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response.data.message || "Something went wrong.");
      setMessage(""); // Clear success message
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Enter your email address:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Send Reset Link
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
