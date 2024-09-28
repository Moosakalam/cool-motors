import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { getUserIdFromToken } from "./utils/jwtDecode";
import VehicleCard from "./utils/VehicleCard";

function MyProfile() {
  const [listedVehicles, setListedVehicles] = useState([]);
  const [likedVehicles, setLikedVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState("listed");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login status

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;

    const fetchListedVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}/vehicles`
        );
        setListedVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching user's listed vehicles:", error);
      }
    };

    const fetchLikedVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}/liked-vehicles`
        );
        setLikedVehicles(response.data.data.likedVehicles);
      } catch (error) {
        console.error("Error fetching user's liked vehicles:", error);
      }
    };

    if (userId) {
      fetchListedVehicles();
      fetchLikedVehicles();
    } else {
      setIsLoggedIn(false); // Set login status to false if no token
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>You need to log in first!</h2>
        <p>
          Please <Link to="/login">log in</Link> to view your profile and
          vehicles.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("listed")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "listed" ? "#007bff" : "#f0f0f0",
            color: activeTab === "listed" ? "#fff" : "#333",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Listed Vehicles
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "liked" ? "#007bff" : "#f0f0f0",
            color: activeTab === "liked" ? "#fff" : "#333",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Liked Vehicles
        </button>
      </div>

      {/* Show the active tab's content */}
      {activeTab === "liked" ? (
        <div>
          {likedVehicles.length === 0 ? (
            <p>Loading vehicles...</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {likedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {listedVehicles.length === 0 ? (
            <p>Loading vehicles...</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {listedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyProfile;
