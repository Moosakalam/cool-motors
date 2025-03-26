import { useNavigate } from "react-router-dom";

const NoMorePendingVehicles = () => {
  const navigate = useNavigate();

  return (
    <div
      className="no-more-pending-container"
      style={{ backgroundColor: "#a9f2b9", textAlign: "center" }}
    >
      <h2>No More Pending Vehicles 🎉</h2>
      <p>You've reviewed all pending vehicles.</p>
      <button onClick={() => navigate("/")} className="back-btn">
        Home
      </button>
    </div>
  );
};

export default NoMorePendingVehicles;
