import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./css/VehicleDetails.css"; // Import the CSS for the modal and blur effect
import { useAuth } from "../AuthContext";
import left from "../utils/images/left.png";
import right from "../utils/images/right.png";
import whatsApp from "../utils/images/WhatsAppButton.png";
import heart from "../utils/images/heart.png";
import fullHeart from "../utils/images/full-heart.png";
import { isMobile } from "../utils/tools";

function VehicleDetails() {
  const { id } = useParams(); // Vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false); // State for like status
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // Fetch vehicle details
        const vehicleResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${id}`,
          {
            withCredentials: true,
          }
        );
        const fetchedVehicle = vehicleResponse.data.data.vehicle;
        setVehicle(fetchedVehicle);
        // Fetch seller details if available
        if (fetchedVehicle.listedBy) {
          const sellerResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/users/${fetchedVehicle.listedBy}`,
            {
              withCredentials: true,
            }
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

  useEffect(() => {
    const checkIfVehicleLiked = async () => {
      if (!vehicle || !vehicle._id || !user) return; // Exit if no vehicle ID or user is available
      try {
        // Check if the vehicle is liked using the new API endpoint
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicle._id}/likes/is-liked`,
          {
            withCredentials: true,
          }
        );
        setLiked(response.data.data.isLiked);
      } catch (error) {
        console.error("Error checking if vehicle is liked:", error);
      }
    };
    checkIfVehicleLiked();
  }, [vehicle, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      if (window.confirm("Do you want to Login to like this vehicle?")) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      }
      return;
    }
    try {
      if (liked) {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${id}/likes`,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${id}/likes`,
          {},
          {
            withCredentials: true,
          }
        );
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

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
            onClick={openImageModal}
          />
          <button onClick={handleLikeToggle} className="like-button">
            <img
              src={liked ? fullHeart : heart}
              alt="Like"
              // className="heart-icon"
              style={{ width: "30px", height: "30px" }}
            />
          </button>
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
              className="img-nav-button left"
            />
          )}

          {/* Next Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={right}
              alt="Next"
              onClick={nextImage}
              className="img-nav-button right"
            />
          )}
        </div>
        <h2
          style={{ fontSize: "28px", marginTop: "20px", marginBottom: "10px" }}
        >
          {vehicle.year} {vehicle.make} {vehicle.model}
          {vehicle.variant && (
            <span
              style={{ fontSize: "20px", color: "#555", marginLeft: "6px" }}
            >
              ({vehicle.variant})
            </span>
          )}
        </h2>
        {/* <p>{vehicle.variant ? vehicle.variant : ""}</p> */}
        <h1 style={{ fontSize: "36px", color: "#333", margin: "10px 0" }}>
          ₹{vehicle.price.toLocaleString("en-IN")}
        </h1>
        <table className="vehicle-details-table">
          <tbody>
            {isMobileScreen ? (
              // Mobile View: 2 Columns (Property | Value)
              <>
                <tr>
                  <td>
                    <strong>Fuel Type:</strong>
                  </td>
                  <td>{vehicle.fuelType}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Transmission:</strong>
                  </td>
                  <td>{vehicle.transmission}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Odometer:</strong>
                  </td>
                  <td>{vehicle.odometer.toLocaleString("en-IN")} km</td>
                </tr>
                <tr>
                  <td>
                    <strong>No. of Owners:</strong>
                  </td>
                  <td>{vehicle.ownership}</td>
                </tr>
                <tr>
                  <td>
                    <strong>State:</strong>
                  </td>
                  <td>{vehicle.state ? vehicle.state : "--"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Location:</strong>
                  </td>
                  <td>{vehicle.location}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Engine:</strong>
                  </td>
                  <td>
                    {!vehicle.engineDisplacement && !vehicle.engineType
                      ? "--"
                      : ""}
                    {vehicle.engineDisplacement
                      ? `${vehicle.engineDisplacement}L`
                      : ""}{" "}
                    {vehicle.engineType ? vehicle.engineType : ""}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Date Listed:</strong>
                  </td>
                  <td>
                    {vehicle.createdAt
                      ? new Date(vehicle.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Seller:</strong>
                  </td>
                  <td>
                    {seller ? (
                      <Link to={`/user/${seller._id}`}>{seller.name}</Link>
                    ) : (
                      "Loading seller details..."
                    )}
                    {/* {seller && seller.phoneNumber && (
                      <a
                        href={
                          isMobile()
                            ? `whatsapp://send?phone=${seller.phoneNumber}&text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})`
                            : `https://wa.me/${seller.phoneNumber}?text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={whatsApp}
                          alt="WhatsApp Chat"
                          className="whatsapp-icon"
                        />
                      </a>
                    )} */}
                    {seller && seller.phoneNumber && (
                      <a
                        href={
                          isMobile()
                            ? `whatsapp://send?phone=${seller.phoneNumber}&text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})%0A${window.location.origin}/vehicle/${vehicle._id}`
                            : `https://wa.me/${seller.phoneNumber}?text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})%0A${window.location.origin}/vehicle/${vehicle._id}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={whatsApp}
                          alt="WhatsApp Chat"
                          className="whatsapp-icon"
                        />
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Description:</strong>
                  </td>
                  <td>
                    {vehicle.description
                      ? vehicle.description.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))
                      : "--"}
                  </td>
                </tr>
              </>
            ) : (
              // Desktop View: 4 Columns (Property | Value | Property | Value)
              <>
                <tr>
                  <td>
                    <strong>Fuel Type:</strong>
                  </td>
                  <td>{vehicle.fuelType}</td>
                  <td>
                    <strong>Transmission:</strong>
                  </td>
                  <td>{vehicle.transmission}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Odometer:</strong>
                  </td>
                  <td>{vehicle.odometer.toLocaleString("en-IN")} km</td>
                  <td>
                    <strong>No. of Owners:</strong>
                  </td>
                  <td>{vehicle.ownership}</td>
                </tr>
                <tr>
                  <td>
                    <strong>State:</strong>
                  </td>
                  <td>{vehicle.state ? vehicle.state : "--"}</td>
                  <td>
                    <strong>Location:</strong>
                  </td>
                  <td>{vehicle.location}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Engine:</strong>
                  </td>
                  <td>
                    {!vehicle.engineDisplacement && !vehicle.engineType
                      ? "--"
                      : ""}
                    {vehicle.engineDisplacement
                      ? `${vehicle.engineDisplacement}L`
                      : ""}{" "}
                    {vehicle.engineType ? vehicle.engineType : ""}
                  </td>
                  <td>
                    <strong>Date Listed:</strong>
                  </td>
                  <td>
                    {vehicle.createdAt
                      ? new Date(vehicle.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Seller:</strong>
                  </td>
                  <td colSpan="3">
                    {seller ? (
                      <Link to={`/user/${seller._id}`}>{seller.name}</Link>
                    ) : (
                      "Loading seller details..."
                    )}
                    {/* {seller && seller.phoneNumber && (
                      <a
                        href={
                          isMobile()
                            ? `whatsapp://send?phone=${seller.phoneNumber}&text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})`
                            : `https://wa.me/${seller.phoneNumber}?text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={whatsApp}
                          alt="WhatsApp Chat"
                          className="whatsapp-icon"
                        />
                      </a>
                    )} */}
                    {seller && seller.phoneNumber && (
                      <a
                        href={
                          isMobile()
                            ? `whatsapp://send?phone=${seller.phoneNumber}&text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})%0A${window.location.origin}/vehicle/${vehicle._id}`
                            : `https://wa.me/${seller.phoneNumber}?text=I'm%20interested%20in%20your%20car%20for%20sale%20(${vehicle.make}%20${vehicle.model})%0A${window.location.origin}/vehicle/${vehicle._id}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={whatsApp}
                          alt="WhatsApp Chat"
                          className="whatsapp-icon"
                        />
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <strong>Description:</strong>
                  </td>
                  <td colSpan="3">
                    {vehicle.description
                      ? vehicle.description.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))
                      : "--"}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
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
              className="img-nav-button left"
            />
          )}
          <img
            className="modal-content"
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.make} ${vehicle.model}`}
          />
          {/* Next Button */}
          {vehicle.images?.length > 1 && (
            <img
              src={right}
              alt="Next"
              onClick={nextImage}
              className="img-nav-button right"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
