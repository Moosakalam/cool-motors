import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { getUserIdFromToken } from "../utils/jwtDecode";
import VehicleCard from "../utils/VehicleCard";

function MyProfile() {
  const [username, setUsername] = useState("");
  const [listedVehicles, setListedVehicles] = useState([]);
  const [likedVehicles, setLikedVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState("listed");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login status
  const [vehicleToDelete, setVehicleToDelete] = useState(null); // Track the vehicle to be deleted
  const [showModal, setShowModal] = useState(false); // Control the modal visibility

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/v1/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUsername(response.data.data.user.name); // Set the username
      } catch (error) {
        console.error("Error fetching user's data:", error);
      }
    };

    const fetchListedVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/v1/users/${userId}/vehicles`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer token
              withCredentials: true,
            },
          }
        );
        setListedVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching user's listed vehicles:", error);
      }
    };

    const fetchLikedVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/v1/users/${userId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer token
              withCredentials: true,
            },
          }
        );
        setLikedVehicles(response.data.data.likedVehicles);
      } catch (error) {
        console.error("Error fetching user's liked vehicles:", error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchListedVehicles();
      fetchLikedVehicles();
    } else {
      setIsLoggedIn(false); // Set login status to false if no token
    }
  }, []);

  const handleDelete = async (vehicleId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://127.0.0.1:5001/api/v1/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });
      setListedVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle._id !== vehicleId)
      );
      setShowModal(false); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const openModal = (vehicleId) => {
    setVehicleToDelete(vehicleId); // Set the vehicle to be deleted
    setShowModal(true); // Open modal
  };

  const closeModal = () => {
    setVehicleToDelete(null); // Clear the vehicle to delete
    setShowModal(false); // Close modal
  };

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
      <h2>{username ? `${username}'s Profile (You)` : "My Profile"}</h2>
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
            <p>No Liked Vehicles</p>
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
            <p>No Listed Vehicles</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {listedVehicles.map((vehicle) => (
                <div key={vehicle._id}>
                  <VehicleCard vehicle={vehicle} />
                  <div
                    style={{ marginTop: "10px", display: "flex", gap: "10px" }}
                  >
                    <button
                      onClick={() => openModal(vehicle._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/edit/${vehicle._id}`)
                      }
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>Are you sure?</h3>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleDelete(vehicleToDelete)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
