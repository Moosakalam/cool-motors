import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
// import "./css/VehicleDetails.css"; // Import the CSS for the modal and blur effect
import "./css/ReviewVehicles.css"; // Import the CSS for the modal and blur effect

function ReviewVehicles() {
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  // const [liked, setLiked] = useState(false); // State for like status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    setFetchLoading(true);
    try {
      // Fetch vehicle details
      const response = await axios.get(
        "http://localhost:5001/api/v1/pending-vehicles/oldest",
        {
          withCredentials: true,
        }
      );
      if (!response.data.data.vehicle) {
        setError("No pending vehicles");
        setFetchLoading(false);
        return;
      }
      const fetchedVehicle = response.data.data.vehicle;
      setVehicle(fetchedVehicle);

      // Fetch seller details if available
      if (fetchedVehicle.listedBy) {
        const sellerResponse = await axios.get(
          `http://localhost:5001/api/v1/users/${fetchedVehicle.listedBy}`,
          {
            withCredentials: true,
          }
        );
        setSeller(sellerResponse.data.data.user);
      }
    } catch (error) {
      if (error.response.status === 403) {
        setError("You don't have access to this page");
        setFetchLoading(false);
        return;
      }
      setError("Failed to fetch vehicle");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!vehicle) return;
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5001/api/v1/pending-vehicles/${vehicle._id}/approve`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchVehicle(); // Fetch next vehicle after approval
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleDisapprove = async () => {
    if (!vehicle) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/v1/pending-vehicles/${vehicle._id}/disapprove`,
        {
          withCredentials: true,
        }
      );
      fetchVehicle(); // Fetch next vehicle after disapproval
    } catch (err) {
      setError("Failed to disapprove vehicle");
    } finally {
      setLoading(false);
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
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, nextImage, prevImage]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/restricted");
    }
  }, [user, authLoading, navigate]);

  if (error) {
    return (
      <div>
        <h2 align="center">{error}</h2>
      </div>
    );
  }

  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div>
      <div
        className={`vehicle-details ${isModalOpen ? "blur-background" : ""}`}
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "left",
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <div
          style={{
            position: "relative",
            marginTop: "20px",
          }}
        >
          <img
            src={
              vehicle.images?.[currentImageIndex] || "/default-placeholder.jpg"
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
          <strong>Seller:</strong>{" "}
          {seller ? (
            <Link to={`/user/${seller._id}`}>{seller.name}</Link>
          ) : (
            "Loading seller details..."
          )}
        </p>

        <div className="action-buttons">
          <button
            onClick={handleApprove}
            className="approve-btn"
            disabled={loading}
          >
            {loading ? "Loading" : "Approve"}
          </button>
          <button
            onClick={handleDisapprove}
            className="disapprove-btn"
            disabled={loading}
          >
            {loading ? "Loading" : "Disapprove"}
          </button>
        </div>
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

export default ReviewVehicles;
