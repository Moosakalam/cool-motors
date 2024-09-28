// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"; // Import the HomePage component
// import VehicleList from "./VehicleList";
import UserProfile from "./UserProfile";
import MyProfile from "./MyProfile";
import ListVehicle from "./ListVehicle";
import VehicleDetails from "./VehicleDetails";
import Signup from "./Signup";
import Login from "./Login";
import Navbar from "./Navbar"; // Import the Navbar
import SearchVehiclesPage from "./SearchVehiclesPage";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
