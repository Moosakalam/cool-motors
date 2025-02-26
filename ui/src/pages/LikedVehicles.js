import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../utils/VehicleCard";

function LikedVehicles() {
  const { user, loading: authLoading } = useAuth();
  const [likedVehicles, setLikedVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5001/api/v1/users/${user._id}/likes`, {
        withCredentials: true,
      })
      .then((res) => setLikedVehicles(res.data.data.likedVehicles))
      .catch((error) => console.error("Error fetching liked vehicles:", error));
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/restricted");
    }
  }, [user, authLoading, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liked Vehicles</h2>
      {likedVehicles.length === 0 ? (
        <p>No liked vehicles</p>
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
  );
}

export default LikedVehicles;
