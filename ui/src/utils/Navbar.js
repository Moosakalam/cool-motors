// import "./Navbar.css";
// import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { getUserIdFromToken } from "./jwtDecode";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [isHovered, setIsHovered] = useState(false);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLoggedIn(true);
//       setUserId(getUserIdFromToken(token));
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   return (
//     <header className="header">
//       <div className="nav-links">
//         <Link to="/" className="nav-link">
//           HOME
//         </Link>
//         <Link to="/search" className="nav-link">
//           Search
//         </Link>
//       </div>
//       {isLoggedIn ? (
//         <div
//           className="user-menu"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <div className="user-menu-title">User Menu</div>
//           {isHovered && (
//             <div className="dropdown-menu">
//               <Link to={`/user/${userId}`} className="dropdown-link">
//                 My Profile
//               </Link>
//               <Link to="/list" className="dropdown-link">
//                 List Vehicle
//               </Link>
//               {/* <div onClick={handleLogout} className="dropdown-link logout">
//                 Logout
//               </div> */}
//               <Link to="/settings" className="dropdown-link">
//                 Settings
//               </Link>
//             </div>
//           )}
//         </div>
//       ) : (
//         <Link to="/login" className="nav-link">
//           Login
//         </Link>
//       )}
//     </header>
//   );
// };

// export default Navbar;

import "./Navbar.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import userIcon from "./images/user.png";

const Navbar = () => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="header">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          HOME
        </Link>
        <Link to="/search" className="nav-link">
          Search
        </Link>
      </div>

      {user ? (
        <div
          className="user-menu"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="user-menu-title">
            <img src={userIcon} alt="User Icon" className="user-icon" />
            {user.name || "User Menu"}
          </div>
          {isHovered && (
            <div className="dropdown-menu">
              <Link to={`/my-profile`} className="dropdown-link">
                My Profile
              </Link>
              <Link to="/list" className="dropdown-link">
                List Vehicle
              </Link>
              <Link to="/settings" className="dropdown-link">
                Settings
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="nav-link">
          Login
        </Link>
      )}
    </header>
  );
};

export default Navbar;
