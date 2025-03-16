// src/components/BankAdmin/BankAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BankAdminDashboard.css';

const BankAdminDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/bankadmin/checkNotifications');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications.');
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    navigate('/bank-admin/login');
  };

  return (
    <div className="bank-admin-dashboard-container">
      <header className="bank-admin-dashboard-header">
        <div className="bank-admin-dashboard-branding">
          <Link to="/bank-admin/dashboard" className="bank-admin-dashboard-logo">Student Loan Services</Link>
        </div>
        <div className="bank-admin-dashboard-actions">
          <Link to="/bank-admin/approve-registrations" className="bank-admin-dashboard-nav-link">Approve Registrations</Link>
          <Link to="/bank-admin/manage-applications" className="bank-admin-dashboard-nav-link">Manage Applications</Link>
          <Link to="/bank-admin/manage-offers" className="bank-admin-dashboard-nav-link">Manage Offers</Link>
          <Link to="/bank-admin/admin-list" className="bank-admin-dashboard-nav-link">Admin List</Link>
          <button className="bank-admin-dashboard-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="bank-admin-dashboard-main">
        <h1 className="bank-admin-dashboard-title">Bank Admin Dashboard</h1>
        <div className="bank-admin-dashboard-notifications">
          <h2>Notifications</h2>
          {error ? (
            <p className="bank-admin-dashboard-error">{error}</p>
          ) : notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification.message}</li>
              ))}
            </ul>
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BankAdminDashboard;