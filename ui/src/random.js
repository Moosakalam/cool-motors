import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/UpdateMe.css"; // Import CSS file for styling

const UpdateMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      const token = localStorage.getItem("token"); // Retrieve the token from local storage

      // Filter out empty fields from the formData before sending
      const updatedData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value.trim() !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(updatedData).length === 0) {
        setMessage("Please fill out at least one field to update.");
        return;
      }

      await axios.patch(
        "http://localhost:5001/api/v1/users/updateMe",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully!");
      setSuccess(true);

      // Redirect to my-profile after a short delay
      setTimeout(() => {
        navigate("/my-profile");
      }, 2000);
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
