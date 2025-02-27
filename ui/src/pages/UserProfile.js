import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate for redirect
import axios from "axios";
import VehicleCard from "../utils/VehicleCard";
import { useAuth } from "../AuthContext";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate(); // Use navigate for redirection
  const [userData, setUserData] = useState(null);
  const [listedVehicles, setListedVehicles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/users/${userId}`,
          { withCredentials: true }
        );
        setUserData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchListedVehicles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/users/${userId}/vehicles`,
          { withCredentials: true }
        );
        setListedVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching user's listed vehicles:", error);
      }
    };

    fetchUserData();
    fetchListedVehicles();

    if (user) {
      if (user._id === userId) {
        // Redirect the user to MyProfile if viewing their own profile
        navigate("/my-vehicles");
      }
    }
  }, [userId, navigate, user]);

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
