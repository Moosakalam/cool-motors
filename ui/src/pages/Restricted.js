import "./css/Restricted.css"; // Import the CSS file
import React from "react";
import { useNavigate } from "react-router-dom";

const Restricted = () => {
  const navigate = useNavigate();

  return (
    <div className="restricted-container">
      <h2 className="restricted-title">Access Denied</h2>
      <p className="restricted-message">
        You need to be logged in to access this page.
      </p>
      <button className="restricted-button" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
};

export default Restricted;
