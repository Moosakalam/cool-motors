// src/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  //sfv
  //sdfv
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token removed from local storage after logout");
    // navigate("/login"); // Redirect to login page after logout
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
