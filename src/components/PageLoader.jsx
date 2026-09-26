import React from "react";

export default function PageLoader() {
  return (
    <div className="page-loader-backdrop" role="status" aria-live="polite">
      <div className="page-loader-card">
        <div className="page-loader-spinner-ring">
          <div className="page-loader-compass">🧭</div>
        </div>
        <div className="page-loader-brand">
          Travel<span>_Guruji</span>
        </div>
        <div className="page-loader-bar">
          <div className="page-loader-progress"></div>
        </div>
        <span className="page-loader-text">Loading experience...</span>
      </div>
    </div>
  );
}
