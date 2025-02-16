import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `http://localhost:5001/api/v1/users/verify-email/${verificationToken}`,
          {
            withCredentials: true,
          }
        );
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => {
          navigate("/");
          window.location.reload(); // Refresh to update navbar state
        }, 2000);
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid or expired verification link."
        );
      }
    };

    verifyEmail();
  }, [verificationToken, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{error ? "Verification Failed" : "Verifying Email"}</h2>
      <p style={{ color: error ? "red" : "green" }}>{error || message}</p>
      {error && <button onClick={() => navigate("/")}>Go to Home</button>}
    </div>
  );
};

export default VerifyEmail;
