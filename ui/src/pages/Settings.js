import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?._id) return;

      const userId = user._id;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/users/${userId}`,
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

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  const handleUpdateProfile = () => {
    navigate("/update-me");
  };

  const handleUpdateEmail = () => {
    navigate("/update-my-email");
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        await axios.get("http://localhost:5001/api/v1/users/logout", {
          withCredentials: true,
        });

        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };

  const handleReviewVehicles = () => {
    navigate("/admin/review-vehicles");
  };

  const handleDeleteAccount = async () => {
    const firstName = user?.name?.split(" ")[0] || "your";
    const confirmationText = `delete ${firstName}'s account`;
    const userInput = prompt(
      `To confirm account deletion, type: "${confirmationText}"`
    );

    if (userInput !== confirmationText) {
      alert("Account deletion canceled. The input did not match.");
      return;
    }

    try {
      await axios.delete("http://localhost:5001/api/v1/users/deleteMe", {
        withCredentials: true,
      });
      await axios.get("http://localhost:5001/api/v1/users/logout", {
        withCredentials: true,
      });

      alert("Your account has been deleted successfully.");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/restricted");
    }
  }, [user, authLoading, navigate]);

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
      <button
        onClick={handleUpdateEmail}
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
        Update Email
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
      <button
        onClick={handleDeleteAccount}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "10px 20px",
          backgroundColor: "#ff4500",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Delete My Account
      </button>
    </div>
  );
};

export default Settings;
