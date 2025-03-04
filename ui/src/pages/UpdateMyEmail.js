import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/UpdateMe.css";
import { useAuth } from "../AuthContext";
import Restricted from "../utils/Restricted";
import Alert from "../utils/Alert";

const UpdateMyEmail = () => {
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  // const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        "http://localhost:5001/api/v1/users/update-email",
        { email },
        { withCredentials: true }
      );

      // setMessage("Verification email sent. Please check your inbox.");
      // setSuccess(true);

      // setTimeout(() => navigate("/settings"), 2500);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating email:", error);
      setError(
        error.response?.data?.message || "An error occurred. Try again."
      );
      // setSuccess(false);
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
      <h1>Update Email</h1>
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      {showAlert && (
        <Alert
          message="Verification email sent. Please check your inbox."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default UpdateMyEmail;
