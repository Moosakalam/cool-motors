import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import heart from "./images/heart.png";
import fullHeart from "./images/full-heart.png";
import moreIcon from "./images/more.png";

function VehicleCard({ vehicle, showOptions, onEdit, onDelete, onMarkAsSold }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkIfVehicleLiked = async () => {
      if (!vehicle || !vehicle._id || !user) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicle._id}/likes/is-liked`,
          { withCredentials: true }
        );
        setLiked(response.data.data.isLiked);
      } catch (error) {
        console.error("Error checking if vehicle is liked:", error);
      }
    };
    checkIfVehicleLiked();
  }, [vehicle, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".vehicle-card-options")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (window.confirm("Do you want to Login to like this vehicle?")) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      }
      return;
    }
    try {
      if (liked) {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicle._id}/likes`,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicle._id}/likes`,
          {},
          { withCredentials: true }
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
          borderRadius: "10px",
          overflow: "hidden",
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="vehicle-card-image">
          <img
            src={
              vehicle.images && vehicle.images.length > 0
                ? vehicle.images[0]
                : "placeholder.jpg"
            }
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{
              width: "300px",
              height: "200px",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
          />
          {showOptions && (
            <div
              className="vehicle-card-options"
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                padding: "5px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }}
            >
              <img
                src={moreIcon}
                alt="Options"
                style={{ width: "20px", height: "20px" }}
              />
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "25px",
                    right: "0",
                    background: "white",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    overflow: "hidden",
                    minWidth: "95px",
                    zIndex: 10,
                    width: "auto",
                  }}
                >
                  <button
                    onClick={onEdit}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={onMarkAsSold}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    Mark As Sold
                  </button>
                  <button
                    onClick={onDelete}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "red",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: "10px", position: "relative" }}>
          <h2
            style={{
              margin: "10px 0 0 0",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h2>

          <h1
            style={{
              margin: "5px 0",
              fontSize: "20px",
              color: "#333",
              textAlign: "left",
            }}
          >
            ₹{vehicle.price.toLocaleString("en-IN")}
          </h1>

          <p
            style={{
              margin: "2px 0",
              fontSize: "12px",
              color: "#666",
              textAlign: "left",
            }}
          >
            {vehicle.odometer.toLocaleString("en-IN")} km
          </p>

          <p
            style={{
              margin: "2px 0 10px",
              fontSize: "12px",
              color: "#777",
              textAlign: "left",
            }}
          >
            {vehicle.location}, {vehicle.state}
          </p>

          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <img
              src={liked ? fullHeart : heart}
              alt="Like"
              onClick={handleLikeToggle}
              style={{
                width: "14px",
                height: "14px",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: "12px", color: "#777" }}>
              {vehicle.numberOfLikes || 0}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default VehicleCard;