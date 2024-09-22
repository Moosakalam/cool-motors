import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getUserIdFromToken } from "./utils/jwtDecode";

function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [listedVehicles, setListedVehicles] = useState([]);
  const [likedVehicles, setLikedVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState("listed");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}`
        );
        setUserData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

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

    fetchUserData();
    fetchListedVehicles();

    const token = localStorage.getItem("token");
    if (token) {
      const decodedUserId = getUserIdFromToken(token);
      if (decodedUserId === userId) {
        fetchLikedVehicles();
      }
    }
  }, [userId]);

  const token = localStorage.getItem("token");
  const decodedUserId = token ? getUserIdFromToken(token) : null;

  return (
    <div style={{ padding: "20px" }}>
      {userData ? (
        <>
          <h2>{userData.name}'s Profile</h2>

          {/* Show toggle buttons only if the profile belongs to the logged-in user */}
          {decodedUserId === userId && (
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => setActiveTab("listed")}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    activeTab === "listed" ? "#007bff" : "#f0f0f0",
                  color: activeTab === "listed" ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    activeTab === "listed" ? "#007bff" : "#f0f0f0")
                }
              >
                Listed Vehicles
              </button>
              <button
                onClick={() => setActiveTab("liked")}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    activeTab === "liked" ? "#007bff" : "#f0f0f0",
                  color: activeTab === "liked" ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    activeTab === "liked" ? "#007bff" : "#f0f0f0")
                }
              >
                Liked Vehicles
              </button>
            </div>
          )}

          {/* Display vehicles based on the active tab */}
          {decodedUserId === userId && activeTab === "liked" ? (
            likedVehicles.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {likedVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    onClick={() =>
                      (window.location.href = `/vehicle/${vehicle._id}`)
                    }
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={vehicle.image || "placeholder.jpg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                    <h2 style={{ margin: "0", fontSize: "18px" }}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <h1
                      style={{
                        margin: "10px 0",
                        fontSize: "22px",
                        color: "#333",
                      }}
                    >
                      ₹{vehicle.price}
                    </h1>
                  </div>
                ))}
              </div>
            ) : (
              <p>No liked vehicles.</p>
            )
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {listedVehicles.length > 0 ? (
                listedVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    onClick={() =>
                      (window.location.href = `/vehicle/${vehicle._id}`)
                    }
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={vehicle.image || "placeholder.jpg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                    <h2 style={{ margin: "0", fontSize: "18px" }}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <h1
                      style={{
                        margin: "10px 0",
                        fontSize: "22px",
                        color: "#333",
                      }}
                    >
                      ₹{vehicle.price}
                    </h1>
                  </div>
                ))
              ) : (
                <p>No vehicles listed by this user.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserProfile;
