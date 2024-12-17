// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Import the HomePage component
// import VehicleList from "./VehicleList";
import UserProfile from "./pages/UserProfile";
import MyProfile from "./pages/MyProfile";
import ListVehicle from "./pages/ListVehicle";
import VehicleDetails from "./pages/VehicleDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./utils/Navbar"; // Import the Navbar
import SearchVehiclesPage from "./pages/SearchVehiclesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import UpdatePassword from "./pages/UpdatePassword";
import ReviewVehicles from "./pages/ReviewVehicles";
import EditVehicle from "./pages/EditVehicle";
import UpdateMe from "./pages/UpdateMe";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar will be rendered on all pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<VehicleList />} /> */}
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/list" element={<ListVehicle />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchVehiclesPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/admin/review-vehicles" element={<ReviewVehicles />} />
          <Route path="/edit/:vehicleId" element={<EditVehicle />} />
          <Route path="/update-me" element={<UpdateMe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
