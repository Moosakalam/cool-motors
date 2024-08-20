import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}`
        );
        setUserData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserVehicles = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/users/${userId}/vehicles`
        );
        setUserVehicles(response.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching user's vehicles:", error);
      }
    };

    fetchUserData();
    fetchUserVehicles();
  }, [userId]);

  return (
    <div>
      {userData ? (
        <>
          <h2>{userData.name}'s Profile</h2>
          {userVehicles.length > 0 ? (
            <div>
              {userVehicles.map((vehicle) => (
                <Link key={vehicle._id} to={`/vehicle/${vehicle._id}`}>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <h3>
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p>Year: {vehicle.year}</p>
                    <p>Price: {vehicle.price}</p>
                    <p>Fuel Type: {vehicle.fuelType}</p>
                    {/* Add more vehicle details as needed */}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No vehicles listed by this user.</p>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserProfile;
