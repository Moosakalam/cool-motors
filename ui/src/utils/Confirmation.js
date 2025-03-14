import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Modal.css"; // Shared styles

const Confirmation = ({
  message,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  navigateTo,
  apiRequest,
}) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (apiRequest) {
      try {
        await axios(apiRequest);
      } catch (error) {
        console.error("API request failed:", error);
      }
    }
    if (navigateTo) {
      navigate(navigateTo);
    }
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="info-modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
