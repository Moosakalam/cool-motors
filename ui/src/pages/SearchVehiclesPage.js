import "./css/SearchVehicles.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import VehicleCard from "../utils/VehicleCard";

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
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const sorts = ["priceAsc", "priceDesc", "mileageAsc", "mileageDesc"];

const SearchVehiclesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    state: "",
    sort: "",
  });

  const [vehicles, setVehicles] = useState([]);

  // Parse query parameters from the URL on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};
    for (const [key, value] of params.entries()) {
      newFilters[key] = value;
    }
    setFilters((prev) => ({ ...prev, ...newFilters }));
    fetchVehicles(newFilters);
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    // Only include filters that have values
    const activeFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    const queryParams = new URLSearchParams(activeFilters);
    navigate(`/search?${queryParams.toString()}`);

    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Adds smooth scrolling
    });
  };

  const fetchVehicles = async (activeFilters) => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/vehicles/search",
        {
          params: activeFilters,
          withCredentials: true,
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
            {[
              "fuelType",
              "transmission",
              "engineType",
              "state",
              "sort",
            ].includes(key) ? (
              <select name={key} value={value} onChange={handleInputChange}>
                <option value="">Select...</option>
                {(key === "fuelType"
                  ? fuelTypes
                  : key === "transmission"
                  ? transmissions
                  : key === "state"
                  ? states
                  : key === "sort"
                  ? sorts
                  : engineTypes
                ).map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  [
                    "minYear",
                    "maxYear",
                    "minPrice",
                    "maxPrice",
                    "minOdometer",
                    "maxOdometer",
                  ].includes(key)
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

        <button className="apply-filter-btn" onClick={handleApplyFilters}>
          Apply Filters
        </button>
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
