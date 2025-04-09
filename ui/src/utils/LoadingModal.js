import React from "react";
import "./css/LoadingModal.css";

function LoadingModal({ message }) {
  return (
    <div className="loading-modal-backdrop">
      <div className="loading-modal">
        <div className="spinner" />
        <p>{message || "Processing... Please wait."}</p>
      </div>
    </div>
  );
}

export default LoadingModal;
