import React, { useEffect, useState } from "react";
import axios from "axios";
import PendingVehicleCard from "../utils/PendingVehicleCard";
import "./css/PendingVehicles.css";

const PendingVehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPendingVehicles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/pending-vehicles/?page=${page}&limit=10`,
          { withCredentials: true } // Include credentials if needed
        );
        console.log(response.data.data.vehicles[0]);

        setVehicles(response.data.data.vehicles);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching pending vehicles:", error);
      }
      setLoading(false);
    };

    fetchPendingVehicles();
  }, [page]); // Fetch data when 'page' changes

  return (
    <div className="pending-vehicles-container">
      <h2>Pending Vehicles</h2>

      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No pending vehicles found.</p>
      ) : (
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <PendingVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingVehiclesList;
