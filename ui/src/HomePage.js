// src/HomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch random vehicles
    const fetchRandomVehicles = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/v1/vehicles/random-vehicles?limit=16"
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
            <div
              key={vehicle._id}
              onClick={() => (window.location.href = `/vehicle/${vehicle._id}`)}
              style={{
                border: "1px solid #ccc",
                cursor: "pointer",
                textAlign: "center",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{ width: "100%", height: "200px", overflow: "hidden" }}
              >
                <img
                  src={vehicle.image || "placeholder.jpg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h2 style={{ margin: "15px 0 0 0", fontSize: "18px" }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>
                ₹{vehicle.price}
              </h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
