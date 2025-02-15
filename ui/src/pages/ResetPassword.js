import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./css/ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Extract token from URL params

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5001/api/v1/users/resetPassword/${resetToken}`,
        {
          password: newPassword,
          passwordConfirm: newPasswordConfirm,
        }
      );

      setMessage("Password reset successfully! Redirecting to login...");
      setError("");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPasswordConfirm">Confirm New Password</label>
          <input
            type="password"
            id="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ResetPassword;
