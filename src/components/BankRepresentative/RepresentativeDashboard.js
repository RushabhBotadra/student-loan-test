// src/components/BankRepresentative/RepresentativeDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RepresentativeDashboard.css';

const RepresentativeDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [error, setError] = useState(null);

  // Handle logout
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-branding">
          <Link to="/" className="logo">Student Loan Service</Link>
        </div>
        <div className="header-actions">
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2 className="dashboard-title">Bank Representative Dashboard</h2>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
            <button className="close-btn" onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/bank-representative/process-applications" className="action-btn">
              <i className="fas fa-check"></i> Process Loan Application<br />
              <p className="continue-btn">Click to continue</p>
            </Link>
            <Link to="/bank-representative/assign-applications" className="action-btn">
              <i className="fas fa-list"></i> View New Applications<br />
              <p className="continue-btn">Click to continue</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepresentativeDashboard;


