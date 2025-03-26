import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../utils/VehicleCard";
import SoldVehicleCard from "../utils/SoldVehicleCard";
import Confirmation from "../utils/Confirmation";
import "./css/MyVehicles.css";
import Restricted from "../utils/Restricted";

function MyVehicles() {
  const { user, loading: authLoading } = useAuth();
  const [listedVehicles, setListedVehicles] = useState([]);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [soldVehicles, setSoldVehicles] = useState([]);
  const [isSoldVehicle, setIsSoldVehicle] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/${user._id}/vehicles`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setListedVehicles(res.data.data.vehicles))
      .catch((error) =>
        console.error("Error fetching listed vehicles:", error)
      );
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/users/sold-vehicles`, {
        withCredentials: true,
      })
      .then((res) => setSoldVehicles(res.data.data.soldVehicles))
      .catch((error) => console.error("Error fetching sold vehicles:", error));
  }, [user]);

  // const handleDelete = async () => {
  //   setShowConfirm(false);
  //   try {
  //     await axios.delete(
  //       `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicleToDelete}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setListedVehicles((prev) =>
  //       prev.filter((vehicle) => vehicle._id !== vehicleToDelete)
  //     );
  //     setShowConfirm(false);
  //   } catch (error) {
  //     console.error("Error deleting vehicle:", error);
  //   }
  // };

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      const endpoint = isSoldVehicle
        ? `${process.env.REACT_APP_API_URL}/api/v1/sold-vehicles/${vehicleToDelete}`
        : `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicleToDelete}`;

      await axios.delete(endpoint, { withCredentials: true });

      if (isSoldVehicle) {
        setSoldVehicles((prev) =>
          prev.filter((vehicle) => vehicle._id !== vehicleToDelete)
        );
      } else {
        setListedVehicles((prev) =>
          prev.filter((vehicle) => vehicle._id !== vehicleToDelete)
        );
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const markAsSold = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to mark this vehicle as sold?"))
      return;
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/vehicles/${vehicleId}/sold`,
        {},
        { withCredentials: true }
      );

      // setListedVehicles((prev) =>
      //   prev.filter((vehicle) => vehicle._id !== vehicleId)
      // );

      // const soldVehicle = listedVehicles.find((v) => v._id === vehicleId);
      // if (soldVehicle) {
      //   setSoldVehicles((prev) => [...prev, soldVehicle]);
      // }
      window.location.reload();
    } catch (error) {
      console.error("Error marking vehicle as sold:", error);
    }
  };

  if (!authLoading && !user) {
    return <Restricted />;
  }

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
                  setIsSoldVehicle(false);
                }}
                onMarkAsSold={() => markAsSold(vehicle._id)}
              />
              <div className="vehicle-actions"></div>
            </div>
          ))}
        </div>
      )}

      {soldVehicles.length !== 0 && (
        <>
          <h2>Sold Vehicles</h2>
          <div className="vehicle-grid">
            {soldVehicles.map((vehicle) => (
              <SoldVehicleCard
                vehicle={vehicle}
                showOptions={true}
                onDelete={() => {
                  setShowConfirm(true);
                  setVehicleToDelete(vehicle._id);
                  setIsSoldVehicle(true);
                }}
              />
            ))}
          </div>
        </>
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
