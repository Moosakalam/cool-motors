import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "../utils/jwtDecode"; // Adjust the import path if needed
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      try {
        const userId = getUserIdFromToken(token);
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAdmin(response.data.data.user.role === "admin");
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChangePassword = () => {
    navigate("/change-password"); // Redirect to the change password page
  };

  const handleUpdatePassword = () => {
    navigate("/update-password"); // Redirect to the change password page
  };

  const handleUpdateProfile = () => {
    navigate("/update-me"); // Redirect to the change password page
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // Refresh to clear state
  };

  const handleReviewVehicles = () => {
    navigate("/admin/review-vehicles"); // Redirect to the admin review vehicles page
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Settings</h2>
      <button
        onClick={handleChangePassword}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Change Password
      </button>
      <button
        onClick={handleUpdatePassword}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Update Password
      </button>

      <button
        onClick={handleUpdateProfile}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Update Profile
      </button>

      {isAdmin && (
        <button
          onClick={handleReviewVehicles}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Review Vehicles (Admin Only)
        </button>
      )}

      <button
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
