import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate for redirect
import axios from "axios";
import { getUserIdFromToken } from "../utils/jwtDecode";
import VehicleCard from "../utils/VehicleCard";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate(); // Use navigate for redirection
  const [userData, setUserData] = useState(null);
  const [listedVehicles, setListedVehicles] = useState([]);

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

    fetchUserData();
    fetchListedVehicles();

    const token = localStorage.getItem("token");
    if (token) {
      const decodedUserId = getUserIdFromToken(token);
      if (decodedUserId === userId) {
        // Redirect the user to MyProfile if viewing their own profile
        console.log("hello");

        navigate("/my-profile");
      }
    }
  }, [userId, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      {userData ? (
        <>
          <h2>{userData.name}'s Profile</h2>
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
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))
            ) : (
              <p>No vehicles listed by this user.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserProfile;
