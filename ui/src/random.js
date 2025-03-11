import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import heart from "./images/heart.png";
import fullHeart from "./images/full-heart.png";

function VehicleCard({ vehicle }) {
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkIfVehicleLiked = async () => {
      if (!vehicle || !vehicle._id || !user) return; // Exit if no vehicle ID or user is available
      try {
        // Check if the vehicle is liked using the new API endpoint
        const response = await axios.get(
          `http://localhost:5001/api/v1/vehicles/${vehicle._id}/likes/is-liked`,
          {
            withCredentials: true,
          }
        );
        setLiked(response.data.data.isLiked);
      } catch (error) {
        console.error("Error checking if vehicle is liked:", error);
      }
    };
    checkIfVehicleLiked();
  }, [vehicle, user]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (window.confirm("Login to like this vehicle?")) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      }
      return;
    }
    try {
      if (liked) {
        await axios.delete(
          `http://localhost:5001/api/v1/vehicles/${vehicle._id}/likes`,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `http://localhost:5001/api/v1/vehicles/${vehicle._id}/likes`,
          {},
          {
            withCredentials: true,
          }
        );
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <a
      href={`/vehicle/${vehicle._id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        key={vehicle._id}
        style={{
          border: "1px solid #ccc",
          cursor: "pointer",
          textAlign: "center",
          borderRadius: "10px",
          overflow: "hidden",
          transition: "background-color 0.3s ease", // Smooth background transition
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0.1)" : "white", // Background dimming on hover
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            width: "100%",
            height: "200px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={
              vehicle.images && vehicle.images.length > 0
                ? vehicle.images[0]
                : "placeholder.jpg"
            }
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease", // Smooth opacity transition
              opacity: isHovered ? 0.7 : 1, // Dim image on hover
            }}
          />
          <img
            src={liked ? fullHeart : heart}
            alt="Like"
            className="like-button"
            onClick={handleLikeToggle}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
        <h2 style={{ margin: "15px 0 0 0", fontSize: "18px" }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>
        <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>
          ₹{vehicle.price.toLocaleString("en-IN")}
        </h1>
      </div>
    </a>
  );
}

export default VehicleCard;
