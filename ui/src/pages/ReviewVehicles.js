import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/ReviewVehicles.css"; // Import the CSS file for styling

const ReviewVehicles = () => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRandomVehicle();
  }, []);

  const fetchRandomVehicle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/api/v1/pending-vehicles/random-vehicle",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request header
          },
        }
      );
      if (!response.data.data.vehicle) {
        setError("No more vehicles");
        setLoading(false);
        return;
      }
      setVehicle(response.data.data.vehicle);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vehicle");
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!vehicle) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:5000/api/v1/pending-vehicles/approve/${vehicle._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request header
          },
        }
      );
      fetchRandomVehicle(); // Fetch next vehicle after approval
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve vehicle");
    }
  };

  const handleDisapprove = async () => {
    if (!vehicle) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:5000/api/v1/pending-vehicles/disapprove/${vehicle._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request header
          },
        }
      );
      fetchRandomVehicle(); // Fetch next vehicle after disapproval
    } catch (err) {
      setError("Failed to disapprove vehicle");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-slideshow">
      <div className="vehicle-slide">
        <img
          src={vehicle.images[0] || "placeholder.jpg"}
          alt={vehicle.name}
          className="vehicle-image"
        />
        <div className="vehicle-info">
          <p>
            <strong>Make:</strong> {vehicle.make}
          </p>
          <p>
            <strong>Model:</strong> {vehicle.model}
          </p>
          <p>
            <strong>Year:</strong> {vehicle.year}
          </p>
          <p>
            <strong>Price:</strong> ₹{vehicle.price}
          </p>
          <p>
            <strong>Fuel Type:</strong> {vehicle.fuelType}
          </p>
          <p>
            <strong>Transmission:</strong> {vehicle.transmission}
          </p>
          <p>
            <strong>Engine Displacement:</strong> {vehicle.engineDisplacement}L
          </p>
          <p>
            <strong>Engine Type:</strong> {vehicle.engineType}
          </p>
          <p>
            <strong>Odometer:</strong> {vehicle.odometer} km
          </p>
          <p>
            <strong>Ownership:</strong> {vehicle.ownership} Owners
          </p>
          <p>
            <strong>State:</strong> {vehicle.state}
          </p>
          <p>
            <strong>Location:</strong> {vehicle.location}
          </p>
          <p>
            <strong>Description:</strong> {vehicle.description}
          </p>
        </div>
        <div className="action-buttons">
          <button onClick={handleApprove} className="approve-btn">
            Approve
          </button>
          <button onClick={handleDisapprove} className="disapprove-btn">
            Disapprove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewVehicles;
