import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Restricted from "../utils/Restricted";
import Confirmation from "../utils/Confirmation";
import Alert from "../utils/Alert";
import "./css/Settings.css";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?._id) return;

      const userId = user._id;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setIsAdmin(response.data.data.user.role === "admin");
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info.");
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleLogout = async () => {
    // const confirmed = window.confirm("Are you sure you want to log out?");
    setShowConfirm(false);
    // if (confirmed) {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/logout`, {
        withCredentials: true,
      });

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    // }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/users/deleteMe`,
        {
          withCredentials: true,
          data: { password }, // Send password in request body
        }
      );
      await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/logout`, {
        withCredentials: true,
      });
      setShowAlert(true);
    } catch (err) {
      alert(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  if (!authLoading && !user) {
    return <Restricted />;
  }

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h2>Settings</h2>
        <div
          className="settings-option"
          onClick={() => navigate("/update-password")}
        >
          Change Password
        </div>
        <div className="settings-option" onClick={() => navigate("/update-me")}>
          Update Profile
        </div>
        <div
          className="settings-option"
          onClick={() => navigate("/update-my-email")}
        >
          Update Email
        </div>
        {isAdmin && (
          <div
            className="settings-option"
            onClick={() => navigate("/admin/review-vehicles")}
          >
            Review Vehicles (Admin)
          </div>
        )}
        <div
          className="settings-option logout-text"
          onClick={() => setShowConfirm(true)}
        >
          Logout
        </div>
        <div
          className="settings-option delete-text"
          onClick={handleDeleteAccount}
        >
          Delete My Account
        </div>
      </div>

      {showConfirm && (
        <Confirmation
          message="Are you sure you want to logout?"
          confirmText="Logout"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleLogout}
        />
      )}

      {showAlert && (
        <Alert
          message="Your account has been deleted successfully."
          onClose={() => {
            navigate("/");
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Settings;
