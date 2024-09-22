// src/SearchVehiclesPage.js
import React, { useState } from "react";
import axios from "axios";

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
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Filters Section */}
      <div style={{ width: "25%", paddingRight: "20px" }}>
        <h2>Filters</h2>
        <div>
          <label>Make:</label>
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Min Year:</label>
          <input
            type="number"
            name="minYear"
            value={filters.minYear}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Max Year:</label>
          <input
            type="number"
            name="maxYear"
            value={filters.maxYear}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Fuel Type:</label>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Transmission:</label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            {transmissions.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Min Price:</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Max Price:</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Min Odometer:</label>
          <input
            type="number"
            name="minOdometer"
            value={filters.minOdometer}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Max Odometer:</label>
          <input
            type="number"
            name="maxOdometer"
            value={filters.maxOdometer}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Engine Type:</label>
          <select
            name="engineType"
            value={filters.engineType}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            {engineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Sort:</label>
          <select name="sort" value={filters.sort} onChange={handleInputChange}>
            <option value="">Select...</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="mileageAsc">Mileage: Low to High</option>
            <option value="mileageDesc">Mileage: High to Low</option>
          </select>
        </div>
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      {/* Results Section */}
      <div style={{ width: "75%" }}>
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
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <h2 style={{ margin: "15px 0 0 0", fontSize: "18px" }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <h1
                  style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}
                >
                  ₹{vehicle.price}
                </h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVehiclesPage;
