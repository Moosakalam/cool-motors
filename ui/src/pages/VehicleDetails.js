import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/VehicleDetails.css"; // Import the CSS for the modal and blur effect

function VehicleDetails() {
  const { id } = useParams(); // Vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false); // State for like status
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
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
      } catch (error) {
        console.error("Error fetching vehicle or seller details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     if (!userId) return; // Exit if no userId is available

  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return; // Exit if no token is available

  //       // Fetch current user details using the decoded user ID
  //       const userResponse = await axios.get(
  //         `http://127.0.0.1:5000/api/v1/users/${userId}`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       const currentUser = userResponse.data.data.user;

  //       // Check if the vehicle is liked by the user
  //       const isLiked = currentUser.likedVehicles.includes(vehicle._id);
  //       // console.log("hi");

  //       setLiked(isLiked);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };

  //   fetchUserDetails();
  // }, [userId, vehicle]);

  useEffect(() => {
    const checkIfVehicleLiked = async () => {
      if (!vehicle || !vehicle._id) return; // Exit if no vehicle ID is available

      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Exit if no token is available

        // Check if the vehicle is liked using the new API endpoint
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/likes/is-liked/${vehicle._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLiked(response.data.data.isLiked);
      } catch (error) {
        console.error("Error checking if vehicle is liked:", error);
      }
    };

    checkIfVehicleLiked();
  }, [vehicle]);

  // Function to handle like/unlike
  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login"); // Exit if no token is available

      if (liked) {
        // Unlike the vehicle
        await axios.delete(
          `http://127.0.0.1:5000/api/v1/vehicles/${id}/likes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Like the vehicle
        await axios.post(
          `http://127.0.0.1:5000/api/v1/vehicles/${id}/likes`,
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

  // Memoized function to go to the next image
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
    );
  }, [vehicle]);

  // Memoized function to go to the previous image
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
    );
  }, [vehicle]);

  // Function to handle image click and open modal
  const openImageModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal when the 'Esc' key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, nextImage, prevImage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div>
      <div
        className={`vehicle-details ${isModalOpen ? "blur-background" : ""}`}
        style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}
      >
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
              cursor: "pointer", // Add pointer to indicate clickable
            }}
            onClick={openImageModal} // Open modal on click
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
        <p>{vehicle.variant ? vehicle.variant : ""}</p>
        <h1 style={{ fontSize: "36px", color: "#333", margin: "10px 0" }}>
          ₹{vehicle.price.toLocaleString("en-IN")}
        </h1>
        <p>
          <strong>Fuel Type:</strong> {vehicle.fuelType}
        </p>
        <p>
          <strong>Transmission:</strong> {vehicle.transmission}
        </p>
        <p>
          <strong>Odometer:</strong> {vehicle.odometer} km
        </p>
        <p>
          <strong>No. of Owners:</strong> {vehicle.ownership}
        </p>
        <p>
          <strong>State:</strong> {vehicle.state ? vehicle.state : "--"}
        </p>
        <p>
          <strong>Location:</strong> {vehicle.location}
        </p>
        <p>
          <strong>Description:</strong>
          <br />
          {vehicle.description
            ? vehicle.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            : "--"}
        </p>
        <p>
          <strong>Date Listed:</strong>{" "}
          {new Date(vehicle.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
          <strong>Engine:</strong>{" "}
          {!vehicle.engineDisplacement && !vehicle.engineType ? "--" : ""}
          {vehicle.engineDisplacement
            ? `${vehicle.engineDisplacement}L`
            : ""}{" "}
          {vehicle.engineType ? vehicle.engineType : ""}
        </p>
        <p>
          <strong>Sellers's Phone Number:</strong>{" "}
          {seller.phoneNumber ? `+91 ${seller.phoneNumber}` : "--"}
        </p>
        <p>
          {seller.phoneNumber ? (
            <a
              href={`https://wa.me/+918885498289?text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Chat
            </a>
          ) : (
            ""
          )}
        </p>
        <p>
          <strong>Seller:</strong>{" "}
          {seller ? (
            <Link to={`/user/${seller._id}`}>{seller.name}</Link>
          ) : (
            "Loading seller details..."
          )}
        </p>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          {/* Previous Button */}
          <button
            className="prev-button"
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
              fontSize: "25px",
              zIndex: 1,
            }}
          >
            {"<"}
          </button>
          <img
            className="modal-content"
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
          {/* Next Button */}
          <button
            className="next-button"
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
              fontSize: "25px",
              zIndex: 1,
            }}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
