import React, { useState } from "react";

function VehicleCard({ vehicle }) {
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  return (
    <div
      key={vehicle._id}
      onClick={() => (window.location.href = `/vehicle/${vehicle._id}`)}
      style={{
        border: "1px solid #ccc",
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "10px",
        overflow: "hidden",
        transition: "background-color 0.3s ease", // Smooth background transition
        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.1)" : "white", // Background dimming on hover
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
        <img
          src={vehicle.image || "placeholder.jpg"}
          alt={`${vehicle.make} ${vehicle.model}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease", // Smooth opacity transition
            opacity: isHovered ? 0.7 : 1, // Dim image on hover
          }}
        />
      </div>
      <h2 style={{ margin: "15px 0 0 0", fontSize: "18px" }}>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h2>
      <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>
        ₹{vehicle.price}
      </h1>
    </div>
  );
}

export default VehicleCard;
