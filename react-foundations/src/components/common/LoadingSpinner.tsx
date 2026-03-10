import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading your library...</p>
    </div>
  );
};
