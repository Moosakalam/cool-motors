import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserIdFromToken } from "../utils/jwtDecode";

function VehicleDetails() {
  const { id } = useParams(); // Vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false); // State for like status
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // Fetch vehicle details
        const vehicleResponse = await axios.get(
          `http://127.0.0.1:5000/api/v1/vehicles/${id}`
        );
        const fetchedVehicle = vehicleResponse.data.data.vehicle;
        setVehicle(fetchedVehicle);

        // Fetch seller details if available
        if (fetchedVehicle.listedBy) {
          const sellerResponse = await axios.get(
            `http://127.0.0.1:5000/api/v1/users/${fetchedVehicle.listedBy}`
          );
          setSeller(sellerResponse.data.data.user);
        }

        const token = localStorage.getItem("token");
        // Decode the token to get the user ID
        const decodedUserId = getUserIdFromToken(token);
        setUserId(decodedUserId);
      } catch (error) {
        console.error("Error fetching vehicle or seller details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return; // Exit if no userId is available

      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Exit if no token is available

        // Fetch current user details using the decoded user ID
        const userResponse = await axios.get(
          `http://127.0.0.1:3000/api/v1/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const currentUser = userResponse.data.data.user;

        // Check if the vehicle is liked by the user
        const isLiked = currentUser.likedVehicles.includes(vehicle._id);
        setLiked(isLiked);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId, vehicle]);

  // Function to handle like/unlike
  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login"); // Exit if no token is available

      if (liked) {
        // Unlike the vehicle
        await axios.patch(
          `http://127.0.0.1:5000/api/v1/users/unlike/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Like the vehicle
        await axios.post(
          `http://127.0.0.1:5000/api/v1/users/like/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Toggle the liked state
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
      <div style={{ position: "relative" }}>
        <img
          src={
            vehicle.images && vehicle.images.length > 0
              ? vehicle.images[currentImageIndex]
              : "placeholder.jpg"
          }
          alt={`${vehicle.make} ${vehicle.model}`}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        <button
          onClick={handleLikeToggle}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: liked ? "#ff4d4d" : "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        {/* Previous Button */}
        {vehicle.images && vehicle.images.length > 1 && (
          <button
            onClick={prevImage}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontFamily: "cursive",
              fontSize: 25,
            }}
          >
            {"<"}
          </button>
        )}
        {/* Next Button */}
        {vehicle.images && vehicle.images.length > 1 && (
          <button
            onClick={nextImage}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontFamily: "cursive",
              fontSize: 25,
            }}
          >
            {">"}
          </button>
        )}
      </div>
      <h2 style={{ fontSize: "32px", marginTop: "20px" }}>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h2>
      <h1 style={{ fontSize: "36px", color: "#333", margin: "10px 0" }}>
        ₹{vehicle.price}
      </h1>
      <p>Fuel Type: {vehicle.fuelType}</p>
      <p>Transmission: {vehicle.transmission}</p>
      <p>Engine Displacement: {vehicle.engineDisplacement}L</p>
      <p>Engine Type: {vehicle.engineType}</p>
      <p>Odometer: {vehicle.odometer} km</p>
      <p>Ownership: {vehicle.ownership}</p>
      <p>Location: {vehicle.location}</p>
      <p>
        Seller:{" "}
        {seller ? (
          <Link to={`/user/${seller._id}`}>{seller.name}</Link>
        ) : (
          "Loading seller details..."
        )}
      </p>
    </div>
  );
}

export default VehicleDetails;
