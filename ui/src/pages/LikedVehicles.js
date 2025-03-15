import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
import VehicleCard from "../utils/VehicleCard";
import Restricted from "../utils/Restricted";

function LikedVehicles() {
  const { user, loading: authLoading } = useAuth();
  const [likedVehicles, setLikedVehicles] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/users/${user._id}/likes`, {
        withCredentials: true,
      })
      .then((res) => setLikedVehicles(res.data.data.likedVehicles))
      .catch((error) => console.error("Error fetching liked vehicles:", error));
  }, [user]);

  // useEffect(() => {
  if (!authLoading && !user) {
    // navigate("/restricted");
    return <Restricted />;
  }
  // }, [user, authLoading, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liked Vehicles</h2>
      {likedVehicles.length === 0 ? (
        <p>No liked vehicles</p>
      ) : (
        <div className="vehicle-grid">
          {likedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedVehicles;
