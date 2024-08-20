import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "./utils/jwtDeocde";

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Fetch random vehicles
    const fetchRandomVehicles = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/v1/vehicles/random-vehicles?limit=5"
        );
        setVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchRandomVehicles();

    // Check if user is logged in (placeholder logic)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserId(getUserIdFromToken(token));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        {isLoggedIn && (
          <Link to="/list" style={{ textDecoration: "none", padding: "10px" }}>
            List Vehicle
          </Link>
        )}
        <div>
          {isLoggedIn ? (
            <Link
              to={`/user/${userId}`}
              style={{ textDecoration: "none", padding: "10px" }}
            >
              My Profile
            </Link>
          ) : (
            <Link
              to="/login"
              style={{ textDecoration: "none", padding: "10px" }}
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <h1>Home Page</h1>
      {vehicles.length === 0 ? (
        <p>Loading vehicles...</p>
      ) : (
        <div>
          {vehicles.map((vehicle) => (
            <Link to={`/vehicle/${vehicle._id}`}>
              <div
                key={vehicle._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>
                  {vehicle.make} {vehicle.model}
                </h3>
                <p>Year: {vehicle.year}</p>
                <p>Price: {vehicle.price}</p>
                <p>Fuel Type: {vehicle.fuelType}</p>
                {/* Add more vehicle details as needed */}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
