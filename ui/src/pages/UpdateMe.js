import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserIdFromToken } from "../utils/jwtDecode";
import "./css/UpdateMe.css";

const UpdateMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setMessage("No token found. Please log in again.");

        const userId = getUserIdFromToken(token);

        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}`
        );

        const { name, email, phoneNumber } = response.data.data.user;
        setFormData({
          name: name || "",
          email: email || "",
          phoneNumber: phoneNumber || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage(
          error.response?.data?.message ||
            "Failed to load user data. Try again."
        );
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Remove empty fields before sending
      const updatedData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value.trim() !== "") acc[key] = value;
          return acc;
        },
        {}
      );

      if (Object.keys(updatedData).length === 0) {
        setMessage("Please update at least one field.");
        return;
      }

      await axios.patch(
        "http://127.0.0.1:5000/api/v1/users/updateMe",
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
      setSuccess(true);

      setTimeout(() => navigate("/my-profile"), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="update-container">
      <h1>Update Profile</h1>
      {message && (
        <p className={`message ${success ? "success" : "error"}`}>{message}</p>
      )}
      <form onSubmit={handleSubmit} className="update-form">
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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

        <button type="submit" className="submit-btn">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateMe;
