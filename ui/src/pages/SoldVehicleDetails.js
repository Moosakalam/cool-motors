import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./css/VehicleDetails.css"; // Import the CSS for the modal and blur effect
import { useAuth } from "../AuthContext";
import Restricted from "../utils/Restricted";
import left from "../utils/images/left.png";
import right from "../utils/images/right.png";

function SoldVehicleDetails() {
  const { id } = useParams(); // Vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  //   const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  //   const location = useLocation();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        // Fetch vehicle details
        const vehicleResponse = await axios.get(
          `http://localhost:5001/api/v1/sold-vehicles/${id}`,
          {
            withCredentials: true,
          }
        );
        const fetchedVehicle = vehicleResponse.data.data.vehicle;
        // if (user._id !== fetchedVehicle.listedBy) {
        //   setError("You don't have access to this page.");
        //   console.log("hioidc");
        // }
        setVehicle(fetchedVehicle);
      } catch (error) {
        if (error.response.status === 403) {
          setError("You don't have access to this vehicle.");
          return;
        }
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id, user]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
    );
  }, [vehicle]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
    );
  }, [vehicle]);

  const openImageModal = () => {
    setIsModalOpen(true);
  };

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

  if (!authLoading && !user) {
    return <Restricted />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div>
      <div
        className={`vehicle-details ${isModalOpen ? "blur-background" : ""}`}
        style={{ opacity: "0.6", filter: "grayscale(50%)" }}
      >
        <div className="image-container">
          <img
            src={
              vehicle.images && vehicle.images.length > 0
                ? vehicle.images[currentImageIndex]
                : "placeholder.jpg"
            }
            alt={`${vehicle.make} ${vehicle.model}`}
            className="vehicle-image"
            style={{
              objectFit: "contain",
            }}
            onClick={openImageModal} // Open modal on click
          />
          {
            <div className="image-counter">
              {currentImageIndex + 1}/{vehicle.images.length}
            </div>
          }
          {/* Previous Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={left}
              alt="Previuos"
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)", // Centers it vertically
                height: "3rem", // Reduce size
                width: "3rem",
                cursor: "pointer",
                opacity: 0.7,
                background: "#fff",
              }}
              className="nav-arrow left-arrow"
            />
          )}

          {/* Next Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={right}
              alt="Next"
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)", // Centers it vertically
                height: "3rem", // Reduce size
                width: "3rem",
                cursor: "pointer",
                opacity: 0.7,
                background: "#fff",
              }}
            />
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
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          {
            <div className="image-counter-modal">
              {currentImageIndex + 1}/{vehicle.images.length}
            </div>
          }
          {/* Previous Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={left}
              alt="Previuos"
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)", // Centers it vertically
                height: "3rem", // Reduce size
                width: "3rem",
                cursor: "pointer",
                opacity: 0.7,
                background: "#fff",
                borderRadius: "10px",
              }}
            />
          )}
          <img
            className="modal-content"
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              // objectFit: "contain",
            }}
          />
          {/* Next Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={right}
              alt="Next"
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)", // Centers it vertically
                height: "3rem", // Reduce size
                width: "3rem",
                cursor: "pointer",
                opacity: 0.7,
                background: "#fff",
                borderRadius: "10px",
              }}
            />
          )}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SoldVehicleDetails;
