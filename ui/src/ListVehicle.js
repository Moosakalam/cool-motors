import React, { useState } from "react";
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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:5000/api/v1/vehicles/list", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Vehicle added successfully!");
      setFormData({
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
      });
      setError("");
    } catch (err) {
      setError(err.response.data.message || "Failed to add vehicle");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make"
          required
        />
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
          required
        />
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          placeholder="Fuel Type"
          required
        />
        <input
          type="text"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="Transmission"
          required
        />
        <input
          type="number"
          step="0.1"
          name="engineDisplacement"
          value={formData.engineDisplacement}
          onChange={handleChange}
          placeholder="Engine Displacement"
        />
        <input
          type="text"
          name="engineType"
          value={formData.engineType}
          onChange={handleChange}
          placeholder="Engine Type"
        />
        <input
          type="number"
          name="odometer"
          value={formData.odometer}
          onChange={handleChange}
          placeholder="Odometer"
          required
        />
        <input
          type="number"
          name="ownership"
          value={formData.ownership}
          onChange={handleChange}
          placeholder="Ownership"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <button type="submit">Add Vehicle</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default ListVehicle;
