import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./css/ResetPassword.css";
import eye from "../utils/images/eye.svg";
import eyeOff from "../utils/images/eye-off.svg";
import Alert from "../utils/Alert";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Extract token from URL params
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match!");
      setLoading(false);
      setNewPassword("");
      setNewPasswordConfirm("");
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/resetPassword/${resetToken}`,
        {
          password: newPassword,
          passwordConfirm: newPasswordConfirm,
        },
        { withCredentials: true }
      );
      // alert(
      //   "Password has been reset successfully. Please login with the new password."
      // );
      setError("");
      setShowAlert(true);

      // setTimeout(() => {
      // navigate("/login"); // Redirect to login page
      // }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setNewPassword("");
      setNewPasswordConfirm("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      <form
        className="reset-password-form"
        onSubmit={handleSubmit}
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="newPasswordConfirm">Confirm New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="reset-password-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {showAlert && (
        <Alert
          message="Password has been reset successfully. Please login with the new password."
          onClose={() => navigate("/login")}
        />
      )}
    </div>
  );
}

export default ResetPassword;
