import React from 'react';

const DashboardCard = ({ title, icon, children, className = '', onMoreDetails }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          {icon && <span className="dashboard-card-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
        {onMoreDetails && (
          <button className="more-details-btn" onClick={onMoreDetails}>
            More Details
          </button>
        )}
      </div>
      <div className="dashboard-card-body">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
