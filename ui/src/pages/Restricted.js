import React from "react";
import { useNavigate } from "react-router-dom";

const Restricted = () => {
  const navigate = useNavigate();

  return (
    <div className="restricted-container">
      <h2>Access Denied</h2>
      <p>You need to be logged in to access this page.</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default Restricted;
