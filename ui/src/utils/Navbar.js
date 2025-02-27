import "./css/Navbar.css";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import userIcon from "./images/user.png";
import plusIcon from "./images/plus.png"; // Add a plus icon

const Navbar = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          HOME
        </Link>
        <Link to="/search" className="nav-link">
          Search
        </Link>
      </div>

      {user && (
        <Link to="/list" className="list-vehicle-btn">
          <img src={plusIcon} alt="List Vehicle" className="plus-icon" />
          List Vehicle
        </Link>
      )}

      {user ? (
        <div className="user-menu" ref={dropdownRef}>
          <div className="user-menu-title" onClick={toggleDropdown}>
            <img src={userIcon} alt="User Icon" className="user-icon" />
            {user.name || "User Menu"}
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/my-vehicles" className="dropdown-link">
                My Vehicles
              </Link>
              <Link to="/liked-vehicles" className="dropdown-link">
                Liked Vehicles
              </Link>
              <Link to="/settings" className="dropdown-link">
                Settings
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="nav-link">
          Login
        </Link>
      )}
    </header>
  );
};

export default Navbar;
