// src/VehicleDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/vehicles/${id}`
        );
        setVehicle(response.data.data.vehicle);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div>
      <h2>
        {vehicle.make} {vehicle.model}
      </h2>
      <p>Year: {vehicle.year}</p>
      <p>Price: {vehicle.price}</p>
      <p>Fuel Type: {vehicle.fuelType}</p>
      <p>Transmission: {vehicle.transmission}</p>
      <p>Engine Displacement: {vehicle.engineDisplacement}L</p>
      <p>Engine Type: {vehicle.engineType}</p>
      <p>Odometer: {vehicle.odometer} km</p>
      <p>Ownership: {vehicle.ownership}</p>
      <p>Location: {vehicle.location}</p>
      <Link to={`/user/${vehicle.listedBy}`}>View Seller's Profile</Link>
    </div>
  );
}

export default VehicleDetails;
