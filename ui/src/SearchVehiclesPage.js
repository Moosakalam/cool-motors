// src/SearchVehiclesPage.js
import "./SearchVehicles.css";
import React, { useState } from "react";
import axios from "axios";
import VehicleCard from "./utils/VehicleCard";

const fuelTypes = ["petrol", "diesel", "hybrid", "electric", "lpg", "cng"];
const transmissions = ["automatic", "manual"];
const engineTypes = [
  "I3",
  "I4",
  "I5",
  "I6",
  "V6",
  "V8",
  "V10",
  "V12",
  "V16",
  "W12",
  "W16",
  "H4",
  "H6",
  "rotary",
];

const SearchVehiclesPage = () => {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
    fuelType: "",
    transmission: "",
    minPrice: "",
    maxPrice: "",
    minOdometer: "",
    maxOdometer: "",
    engineType: "",
    location: "",
    sort: "",
  });

  const [vehicles, setVehicles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/v1/vehicles/search",
        {
          params: filters,
        }
      );
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  return (
    <div className="container">
      {/* Filters Section */}
      <div className="filters">
        <h2>Filters</h2>
        {Object.entries(filters).map(([key, value]) => (
          <div key={key}>
            <label>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
              :{" "}
            </label>
            {key.includes("Type") || key.includes("sort") ? (
              <select name={key} value={value} onChange={handleInputChange}>
                <option value="">Select...</option>
                {(key.includes("fuelType")
                  ? fuelTypes
                  : key.includes("transmission")
                  ? transmissions
                  : engineTypes
                ).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  key.includes("Year") ||
                  key.includes("Price") ||
                  key.includes("Odometer")
                    ? "number"
                    : "text"
                }
                name={key}
                value={value}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      {/* Results Section */}
      <div className="results">
        <h2>Search Results</h2>
        {vehicles.length === 0 ? (
          <p>No vehicles found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVehiclesPage;
