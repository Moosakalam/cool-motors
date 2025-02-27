import React, { useState } from "react";

function VehicleCard({ vehicle }) {
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  return (
    <a
      href={`/vehicle/${vehicle._id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        key={vehicle._id}
        // onClick={() => (window.location.href = `/vehicle/${vehicle._id}`)}
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
            src={
              vehicle.images && vehicle.images.length > 0
                ? vehicle.images[0]
                : "placeholder.jpg"
            }
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
          ₹{vehicle.price.toLocaleString("en-IN")}
        </h1>
      </div>
    </a>
  );
}

export default VehicleCard;

// import React, { useState } from "react";
// import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
// import Confirmation from "./Confirmation";
// import heart from "./images/heart.png";
// import fullHeart from "./images/full-heart.png";

// function VehicleCard({ vehicle }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleLikeClick = (e) => {
//     e.preventDefault();
//     if (!user) {
//       setShowConfirm(true);
//     } else {
//       // Logic for liking/unliking the vehicle
//       console.log("Like functionality goes here.");
//     }
//   };

//   return (
//     <>
//       <a
//         href={`/vehicle/${vehicle._id}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ textDecoration: "none", color: "inherit" }}
//       >
//         <div
//           key={vehicle._id}
//           onClick={() => (window.location.href = `/vehicle/${vehicle._id}`)}
//           style={{
//             border: "1px solid #ccc",
//             cursor: "pointer",
//             textAlign: "center",
//             borderRadius: "10px",
//             overflow: "hidden",
//             transition: "background-color 0.3s ease",
//             backgroundColor: isHovered ? "rgba(0, 0, 0, 0.1)" : "white",
//             position: "relative", // Added for absolute positioning of the like button
//           }}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {/* Like Button */}
//           <div
//             onClick={handleLikeClick}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               width: "30px",
//               height: "30px",
//               backgroundColor: "rgba(255, 255, 255, 0.7)", // Light white transparent background
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <img
//               src={user ? fullHeart : { heart }}
//               alt="Like"
//               style={{ width: "80%", height: "80%" }}
//             />
//           </div>

//           <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
//             <img
//               src={
//                 vehicle.images && vehicle.images.length > 0
//                   ? vehicle.images[0]
//                   : "placeholder.jpg"
//               }
//               alt={`${vehicle.make} ${vehicle.model}`}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 transition: "opacity 0.3s ease",
//                 opacity: isHovered ? 0.7 : 1,
//               }}
//             />
//           </div>

//           <h2 style={{ margin: "15px 0 0 0", fontSize: "18px" }}>
//             {vehicle.year} {vehicle.make} {vehicle.model}
//           </h2>
//           <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>
//             ₹{vehicle.price.toLocaleString("en-IN")}
//           </h1>
//         </div>
//       </a>

//       {/* Show Confirmation Modal when user clicks like without logging in */}
//       {showConfirm && (
//         <Confirmation
//           message="You need to log in to like vehicles. Do you want to proceed?"
//           confirmText="Login"
//           onCancel={() => setShowConfirm(false)}
//           onConfirm={() => navigate("/login")}
//         />
//       )}
//     </>
//   );
// }

// export default VehicleCard;
