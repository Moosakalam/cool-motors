import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "./css/VehicleDetails.css";

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/vehicles/${id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setVehicle(data.data.vehicle);
        if (data.data.vehicle.listedBy) {
          return axios.get(
            `http://localhost:5001/api/v1/users/${data.data.vehicle.listedBy}`,
            { withCredentials: true }
          );
        }
      })
      .then((res) => res && setSeller(res.data.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!vehicle || !user) return;
    axios
      .get(
        `http://localhost:5001/api/v1/vehicles/${vehicle._id}/likes/is-liked`,
        { withCredentials: true }
      )
      .then(({ data }) => setLiked(data.data.isLiked))
      .catch(console.error);
  }, [vehicle, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      if (window.confirm("Login to like this vehicle?")) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      }
      return;
    }
    try {
      await axios[liked ? "delete" : "post"](
        `http://localhost:5001/api/v1/vehicles/${id}/likes`,
        {},
        { withCredentials: true }
      );
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((i) => (i + 1 < vehicle.images.length ? i + 1 : i));
  const prevImage = () => setCurrentImageIndex((i) => (i > 0 ? i - 1 : i));

  if (loading) return <div>Loading...</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div
      className={`vehicle-details ${isModalOpen ? "blur-background" : ""}`}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <div style={{ position: "relative", marginTop: 20 }}>
        <img
          src={vehicle.images?.[currentImageIndex] || "placeholder.jpg"}
          alt="Vehicle"
          style={{
            width: "100%",
            height: 400,
            objectFit: "cover",
            borderRadius: 10,
            cursor: "pointer",
          }}
          onClick={() => setIsModalOpen(true)}
        />
        <button
          onClick={handleLikeToggle}
          style={{ position: "absolute", bottom: 10, right: 10 }}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        {vehicle.images?.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: 5,
            }}
          >
            {currentImageIndex + 1}/{vehicle.images.length}
          </div>
        )}
        {currentImageIndex > 0 && (
          <button
            onClick={prevImage}
            style={{ position: "absolute", top: "50%", left: 10 }}
          >
            {"<"}
          </button>
        )}
        {currentImageIndex < vehicle.images.length - 1 && (
          <button
            onClick={nextImage}
            style={{ position: "absolute", top: "50%", right: 10 }}
          >
            {">"}
          </button>
        )}
      </div>
      <h2>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h2>
      <h1>₹{vehicle.price.toLocaleString("en-IN")}</h1>
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
        <strong>Seller:</strong>{" "}
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
