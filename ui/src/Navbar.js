import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "./utils/jwtDecode";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserId(getUserIdFromToken(token));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", padding: "10px" }}>
          HOME
        </Link>
        <Link to="/search" style={{ textDecoration: "none", padding: "10px" }}>
          Search
        </Link>
      </div>
      {isLoggedIn ? (
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ cursor: "pointer" }}>User Menu</div>
          {isHovered && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                borderRadius: "4px",
                zIndex: 1,
              }}
            >
              <Link
                to={`/user/${userId}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  marginBottom: "10px",
                }}
              >
                My Profile
              </Link>
              <Link
                to="/list"
                style={{
                  display: "block",
                  textDecoration: "none",
                  marginBottom: "10px",
                }}
              >
                List Vehicle
              </Link>
              <div onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" style={{ textDecoration: "none", padding: "10px" }}>
          Login
        </Link>
      )}
    </header>
  );
};

export default Navbar;
