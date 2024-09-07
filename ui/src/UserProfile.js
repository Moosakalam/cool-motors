import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);

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

    const fetchUserVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}/vehicles`
        );
        setUserVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching user's vehicles:", error);
      }
    };

    fetchUserData();
    fetchUserVehicles();
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      {userData ? (
        <>
          <h2>{userData.name}'s Profile</h2>
          {userVehicles.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {userVehicles.map((vehicle) => (
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
            <p>No vehicles listed by this user.</p>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserProfile;
