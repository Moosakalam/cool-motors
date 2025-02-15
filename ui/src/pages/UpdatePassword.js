// src/pages/UpdatePassword.js
import React, { useState } from "react";
import axios from "axios";
import "./css/UpdatePassword.css"; // Optional CSS file for styling
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom"; // Import Link for navigation

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        "http://localhost:5001/api/v1/users/updatePassword",
        {
          currentPassword,
          password: newPassword,
          passwordConfirm: newPasswordConfirm,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message || "Password updated successfully.");
      setError("");

      setTimeout(() => {
        navigate("/settings");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setMessage("");
    }
  };

  if (!user) {
    navigate("/restricted");
    return;
  }

  return (
    <div className="update-password-container">
      <h2>Update Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdatePassword}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="text"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPasswordConfirm">Confirm New Password:</label>
          <input
            type="text"
            id="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-update">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
