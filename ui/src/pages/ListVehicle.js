import "./css/ListVehicle.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use this for redirection
import { useAuth } from "../AuthContext";
import axios from "axios";

function ListVehicle() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    fuelType: "",
    transmission: "",
    engineDisplacement: "",
    engineType: "",
    odometer: "",
    ownership: "",
    location: "",
    state: "",
  });

  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  const states = [
    // States
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

    // Union Territories
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

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
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    // Store selected files in state
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formDataWithFiles = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithFiles.append(key, formData[key]);
      });

      if (selectedFiles) {
        // Append each selected file to the FormData
        selectedFiles.forEach((file) => {
          formDataWithFiles.append("images", file);
        });
      }

      await axios.post(
        "http://localhost:5001/api/v1/pending-vehicles/list",
        formDataWithFiles,
        {
          withCredentials: true,
        }
      );

      setSuccess("Vehicle added successfully!");
      setError("");

      // After 3 seconds, hide the modal and redirect
      setTimeout(() => {
        setSuccess(false);
        navigate("/my-profile");
      }, 3000); // 3 seconds delay
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/restricted");
  }

  return (
    <div className="vehicle-list-container">
      <h2 className="form-title">List Vehicle</h2>
      {/* <form className="vehicle-form" onSubmit={handleSubmit}> */}
      <form
        className="vehicle-form"
        onSubmit={handleSubmit}
        style={{
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div className="form-group">
          <label htmlFor="make">Make*</label>
          <input
            type="text"
            name="make"
            list="carMakes"
            value={formData.make}
            onChange={handleChange}
            required
          />
          <datalist id="carMakes">
            {carMakes.map((make) => (
              <option key={make} value={make} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="model">Model*</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="variant">Variant</label>
          <input
            type="text"
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            // required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year*</label>
          <input
            type="text"
            name="year"
            list="years"
            value={formData.year}
            onChange={handleChange}
            required
          />
          <datalist id="years">
            {years.map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fuelType">Fuel Type*</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transmission">Transmission*</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
          >
            <option value="">Select Transmission</option>
            {transmissions.map((transmission) => (
              <option key={transmission} value={transmission}>
                {transmission}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="engineDisplacement">Engine Displacement</label>
          <input
            type="number"
            step="0.1"
            name="engineDisplacement"
            value={formData.engineDisplacement}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="engineType">Engine Type</label>
          <select
            name="engineType"
            value={formData.engineType}
            onChange={handleChange}
          >
            <option value="">Select Engine Type</option>
            {engineTypes.map((engine) => (
              <option key={engine} value={engine}>
                {engine}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="odometer">Odometer*</label>
          <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ownership">Ownership*</label>
          <input
            type="text"
            name="ownership"
            list="ownerships"
            value={formData.ownership}
            onChange={handleChange}
            required
          />
          <datalist id="ownerships">
            {ownerships.map((num) => (
              <option key={num} value={num} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5" // You can adjust this value to make the text area taller or shorter
            style={{ width: "100%" }}
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation(); // Prevents the form from submitting on Enter
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State*</label>
          <input
            type="text"
            name="state"
            list="states"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <datalist id="states">
            {states.map((num) => (
              <option key={num} value={num} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            name="location"
            list="locations"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <datalist id="locations">
            {locations.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
        {/* IMAGES ------------------------------------------------- */}
        <div className="form-group">
          <label htmlFor="file">Upload Images (up to 20)*</label>
          <input
            type="file"
            multiple // Enable multiple file selection
            onChange={handleFileChange}
            // required
            accept="image/*" // Accept only image files
          />
        </div>
        {/*------------------------------------------------------------ */}
        {/* <button type="submit" className="submit-button">
          Add Vehicle
        </button> */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <div className="success-modal">
          <p>Vehicle added successfully! Redirecting...</p>
        </div>
      )}{" "}
    </div>
  );
}

export default ListVehicle;
