import React, { useState, useEffect } from "react";
import axios from "axios";
import VehicleCard from "../utils/VehicleCard";
import "./css/HomePage.css";
import HeroSection from "../utils/HeroSection";
import VehicleCarousel from "../utils/VehicleCarousel";

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomVehicles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/random?limit=16`,
          { withCredentials: true }
        );
        setVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles. Please try again later.");
      }
    };

    fetchRandomVehicles();
  }, []);

  return (
    <div className="home-container">
      <HeroSection />
      {error ? (
        <p>{error}</p>
      ) : vehicles.length === 0 ? (
        <p>Loading vehicles...</p>
      ) : (
        <>
          <VehicleCarousel vehicles={vehicles} />
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;