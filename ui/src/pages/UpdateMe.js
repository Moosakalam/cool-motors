import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/UpdateMe.css";
import { useAuth } from "../AuthContext";
import Restricted from "../utils/Restricted";
import Alert from "../utils/Alert";

const UpdateMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [originalData, setOriginalData] = useState({});
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/${user._id}`,
        { withCredentials: true }
      );

      const { name, phoneNumber } = response.data.data.user;
      const userData = { name: name || "", phoneNumber: phoneNumber || "" };

      setFormData(userData);
      setOriginalData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load user data. Please try again."
      );
    }
  }, [user?._id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prevent submitting unchanged data
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      setError("No changes detected.");
      setLoading(false);
      return;
    }

    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) => value.trim() !== "" && value !== originalData[key]
        )
      );

      if (Object.keys(updatedData).length === 0) {
        setError("No valid changes detected.");
        return;
      }

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/updateMe`,
        updatedData,
        { withCredentials: true }
      );

      // setMessage("Profile updated successfully!");
      // setSuccess(true);
      // setTimeout(() => navigate("/settings"), 2000);
      setError("");
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
    <div className="update-container">
      <h1>Update Profile</h1>
      {/* {message && (
        <p className={`message ${success ? "success" : "error"}`}>{message}</p>
      )} */}
      <form
        onSubmit={handleSubmit}
        className="update-form"
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      {showAlert && (
        <Alert
          message="Profile updated successfully!"
          onClose={() => navigate("/settings")}
        />
      )}
    </div>
  );
};

export default UpdateMe;
