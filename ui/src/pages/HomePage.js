// src/HomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import VehicleCard from "../utils/VehicleCard";

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch random vehicles
    const fetchRandomVehicles = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/v1/vehicles/random?limit=16"
        );
        setVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchRandomVehicles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Home Page</h1>
      {vehicles.length === 0 ? (
        <p>Loading vehicles...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
