// src/pages/ChangePassword.js
import React, { useState } from "react";
import axios from "axios";
import "./css/ChangePassword.css"; // Optional CSS file for styling
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom"; // Import Link for navigation
import Restricted from "../utils/Restricted";
import Alert from "../utils/Alert";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/changePassword`,
        {
          currentPassword,
          password: newPassword,
          passwordConfirm: newPasswordConfirm,
        },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message || "Password changed successfully.");
      setError("");
      setShowAlert(true);

      // setTimeout(() => {
      //   navigate("/settings");
      // }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  if (!authLoading && !user) {
    // navigate("/restricted");
    return <Restricted />;
  }
  // }, [user, authLoading, navigate]);

  return (
    <div className="update-password-container">
      <h2>Change Password</h2>
      {/* {message && <p className="success-message">{message}</p>} */}
      {error && <p className="error-message">{error}</p>}
      <form
        onSubmit={handleChangePassword}
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="text"
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

        <button type="submit" className="btn-update" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
      {showAlert && (
        <Alert message={message} onClose={() => navigate("/settings")} />
      )}
    </div>
  );
};

export default ChangePassword;
