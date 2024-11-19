import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./css/EditVehicle.css";

const carMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Lexus",
  "Jaguar",
  "Land Rover",
  "Volvo",
  "Tesla",
  "Porsche",
  "Ferrari",
  "Lamborghini",
];
const years = Array.from(
  { length: new Date().getFullYear() - 1900 + 1 },
  (_, i) => 1900 + i
);
const fuelTypes = ["petrol", "diesel", "electric", "hybrid", "CNG", "LPG"];
const transmissions = ["manual", "automatic"];
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
  "Rotary",
];
const ownerships = Array.from({ length: 10 }, (_, i) => i + 1);
const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Other",
];

const EditVehicle = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(null);
  const [customLocation, setCustomLocation] = useState(""); // For custom location
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const fetchVehicleData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:5000/api/v1/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredData = filterFields(response.data.data.vehicle);
      setVehicleData(filteredData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vehicle data");
      setLoading(false);
    }
  };

  const filterFields = (data) => {
    const { listedBy, __v, updatedAt, images, _id, ...filteredData } = data;
    return filteredData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Update location field with custom location if applicable
      const updatedData = { ...vehicleData };
      if (vehicleData.location === "Other") {
        updatedData.location = customLocation;
      }

      await axios.patch(
        `http://127.0.0.1:5000/api/v1/vehicles/update/${vehicleId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Vehicle updated successfully!");
      setTimeout(() => navigate("/my-profile"), 2000);
    } catch (err) {
      setError("Failed to update vehicle");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-vehicle-container">
      <h2>Edit Vehicle</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleUpdate} className="edit-vehicle-form">
        {Object.keys(vehicleData).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            {key === "make" ? (
              <>
                <input
                  type="text"
                  name="make"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="carMakes" // Ensure the list is correctly linked
                  required
                />
                <datalist id="carMakes">
                  {carMakes.map((make) => (
                    <option key={make} value={make} />
                  ))}
                  {/* <option key="hello" value="hello" />
                  <option key="hi" value="hi" /> */}
                </datalist>
              </>
            ) : key === "year" ? (
              <>
                <input
                  type="text"
                  name="year"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="years"
                  required
                />
                <datalist id="years">
                  {years.map((year) => (
                    <option key={year} value={year} />
                  ))}
                </datalist>
              </>
            ) : key === "transmission" ? (
              <>
                <input
                  type="text"
                  name="transmission"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="transmissions"
                  required
                />
                <datalist id="transmissions">
                  {transmissions.map((transmission) => (
                    <option key={transmission} value={transmission} />
                  ))}
                </datalist>
              </>
            ) : key === "ownership" ? (
              <>
                <input
                  type="text"
                  name="ownership"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="ownerships"
                  required
                />
                <datalist id="ownerships">
                  {ownerships.map((ownership) => (
                    <option key={ownership} value={ownership} />
                  ))}
                </datalist>
              </>
            ) : key === "engineType" ? (
              <>
                <input
                  type="text"
                  name="engineType"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="engineTypes"
                  required
                />
                <datalist id="engineTypes">
                  {engineTypes.map((engine) => (
                    <option key={engine} value={engine} />
                  ))}
                </datalist>
              </>
            ) : key === "fuelType" ? (
              <>
                <input
                  type="text"
                  name="fuelType"
                  value={vehicleData[key]}
                  onChange={handleInputChange}
                  className="form-input"
                  list="fuelTypes"
                  required
                />
                <datalist id="fuelTypes">
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel} />
                  ))}
                </datalist>
              </>
            ) : key === "location" ? (
              <>
                <input
                  type="text"
                  name="location"
                  value={vehicleData[key]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVehicleData((prevData) => ({
                      ...prevData,
                      location: value,
                    }));
                    if (value !== "Other") {
                      setCustomLocation(""); // Clear custom location
                    }
                  }}
                  className="form-input"
                  list="locations"
                  required
                />
                <datalist id="locations">
                  {locations.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
                {vehicleData.location === "Other" && (
                  <input
                    type="text"
                    name="customLocation"
                    value={customLocation}
                    placeholder="Enter custom location"
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="form-input"
                  />
                )}
              </>
            ) : (
              <input
                type={typeof vehicleData[key] === "number" ? "number" : "text"}
                id={key}
                name={key}
                value={vehicleData[key]}
                placeholder={`Enter ${key}`}
                onChange={handleInputChange}
                className="form-input"
              />
            )}
          </div>
        ))}
        <button type="submit" className="update-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditVehicle;
