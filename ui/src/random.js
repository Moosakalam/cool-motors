import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";
import heart from "./images/heart.png";
import fullHeart from "./images/full-heart.png";

function VehicleCard({ vehicle }) {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false); // Track like state
  const navigate = useNavigate();

  const handleLikeClick = (e) => {
    e.preventDefault(); // Prevent navigation on click

    if (!user) {
      // User not logged in, ask to login
      const confirmLogin = window.confirm(
        "You need to login to like this vehicle. Do you want to login?"
      );
      if (confirmLogin) {
        navigate("/login");
      }
      return;
    }

    // Toggle liked state (if logged in)
    setLiked(!liked);
  };

  return (
    <a
      href={`/vehicle/${vehicle._id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="vehicle-card"
        key={vehicle._id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Like Button */}
        <img
          src={liked ? fullHeart : heart}
          alt="Like"
          className="like-button"
          onClick={handleLikeClick}
        />

        {/* Vehicle Image */}
        <div className="vehicle-image">
          <img
            src={
              vehicle.images && vehicle.images.length > 0
                ? vehicle.images[0]
                : "placeholder.jpg"
            }
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`vehicle-img ${isHovered ? "dimmed" : ""}`}
          />
        </div>

        {/* Vehicle Details */}
        <h2 className="vehicle-title">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>
        <h1 className="vehicle-price">
          ₹{vehicle.price.toLocaleString("en-IN")}
        </h1>
      </div>
    </a>
  );
}

export default VehicleCard;
