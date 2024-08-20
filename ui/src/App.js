// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"; // Import the HomePage component
// import VehicleList from "./VehicleList";
import UserProfile from "./UserProfile";
import ListVehicle from "./ListVehicle";
import VehicleDetails from "./VehicleDetails";
import Signup from "./Signup";
import Login from "./Login";
import LogoutButton from "./LogoutButton";

function App() {
  return (
    <Router>
      <div className="App">
        <LogoutButton />
        <a href="/">HOME</a>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<VehicleList />} /> */}
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/list" element={<ListVehicle />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
