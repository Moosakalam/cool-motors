import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../utils/VehicleCard";
import Confirmation from "../utils/Confirmation";
import "./css/MyVehicles.css"; // External CSS file
import Restricted from "../utils/Restricted";

function MyVehicles() {
  const { user, loading: authLoading } = useAuth();
  const [listedVehicles, setListedVehicles] = useState([]);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5001/api/v1/users/${user._id}/vehicles`, {
        withCredentials: true,
      })
      .then((res) => setListedVehicles(res.data.data.vehicles))
      .catch((error) =>
        console.error("Error fetching listed vehicles:", error)
      );
  }, [user]);

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await axios.delete(
        `http://localhost:5001/api/v1/vehicles/${vehicleToDelete}`,
        {
          withCredentials: true,
        }
      );
      setListedVehicles((prev) =>
        prev.filter((vehicle) => vehicle._id !== vehicleToDelete)
      );
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // useEffect(() => {
  if (!authLoading && !user) {
    // navigate("/restricted");
    return <Restricted />;
  }
  // }, [user, authLoading, navigate]);

  return (
    <div className="my-vehicles-container">
      <h2>My Vehicles</h2>
      {listedVehicles.length === 0 ? (
        <p>No listed vehicles</p>
      ) : (
        <div className="vehicle-grid">
          {listedVehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card-wrapper">
              <VehicleCard
                vehicle={vehicle}
                showOptions={true}
                onEdit={() => navigate(`/edit/${vehicle._id}`)}
                onDelete={() => {
                  setShowConfirm(true);
                  setVehicleToDelete(vehicle._id);
                }}
              />
              <div className="vehicle-actions">
                {/* <div className="likes">
                  <p>
                    <img src={heart} alt="Likes" className="likes-image" /> :
                    {vehicle.numberOfLikes}
                  </p>
                </div> */}
                {/* <button
                  onClick={() => {
                    setShowConfirm(true);
                    setVehicleToDelete(vehicle._id);
                  }}
                  className="btn-delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/edit/${vehicle._id}`)}
                  className="btn-edit"
                >
                  Edit
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <Confirmation
          message="Are you sure you want to delete this vehicle?"
          confirmText="Delete"
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => handleDelete()}
        />
      )}
    </div>
  );
}

export default MyVehicles;
