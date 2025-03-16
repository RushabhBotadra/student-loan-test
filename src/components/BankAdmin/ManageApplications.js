// src/components/BankAdmin/ManageApplications.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageApplications.css';

const ManageApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/StudentLoanServices/bankadmin/getApplications');
        const mappedApps = response.data.map(app => ({
          id: app.applicationId,
          studentName: `${app.applicant.firstName} ${app.applicant.lastName}`,
          amount: app.loanAmount,
          program: app.applicant.educationDetails,
          submittedDate: app.applicationDate,
          purpose: app.purpose,
          guarantor: app.guarantor,
        }));
        setApplications(mappedApps);
        if (mappedApps.length > 0) setSelectedApplication(mappedApps[0]);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleGenerateOffer = async (applicationId) => {
    try {
      const response = await axios.post(`http://localhost:8080/bankadmin/generateOffer/${applicationId}`);
      if (response.status === 200) {
        setApplications(applications.filter(app => app.id !== applicationId));
        if (selectedApplication?.id === applicationId) setSelectedApplication(null);
        setMessage('Offer generated successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError('Failed to generate offer.');
    }
  };

  const handleLogout = () => {
    navigate('/bank-admin/login');
  };

  return (
    <div className="manage-applications-container">
      <header className="manage-applications-header">
        <div className="manage-applications-branding">
          <Link to="/bank-admin/dashboard" className="manage-applications-logo">Student Loan Services</Link>
        </div>
        <div className="manage-applications-actions">
          <Link to="/bank-admin/dashboard" className="manage-applications-nav-link">Dashboard</Link>
          <Link to="/bank-admin/approve-registrations" className="manage-applications-nav-link">Approve Registrations</Link>
          <Link to="/bank-admin/manage-offers" className="manage-applications-nav-link">Manage Offers</Link>
          <Link to="/bank-admin/admin-list" className="manage-applications-nav-link">Admin List</Link>
          <button className="manage-applications-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="manage-applications-main">
        <h1 className="manage-applications-title">Manage Applications</h1>
        {error && <p className="manage-applications-error">{error}</p>}
        {message && (
          <div className="manage-applications-success-message">
            <span>{message}</span>
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="manage-applications-content">
            <div className="manage-applications-pending-list">
              <h2 className="manage-applications-section-title">Approved Applications</h2>
              {applications.length > 0 ? (
                applications.map(app => (
                  <div
                    key={app.id}
                    className={`manage-applications-pending-card ${selectedApplication?.id === app.id ? 'selected' : ''}`}
                    onClick={() => setSelectedApplication(app)}
                  >
                    <span className="manage-applications-pending-name">{app.studentName}</span>
                    <span className="manage-applications-pending-details">
                      ${app.amount.toLocaleString()} - {app.program}
                    </span>
                  </div>
                ))
              ) : (
                <p>No approved applications.</p>
              )}
            </div>
            <div className="manage-applications-details">
              <h2 className="manage-applications-section-title">Application Details</h2>
              {selectedApplication ? (
                <div className="manage-applications-details-card">
                  <div className="manage-applications-details-meta">
                    ID: {selectedApplication.id} | Submitted: {selectedApplication.submittedDate}
                  </div>
                  <div className="manage-applications-details-section">
                    <h3>Student Information</h3>
                    <div className="manage-applications-details-row">
                      <div className="manage-applications-details-column">
                        <p><strong>Name:</strong> {selectedApplication.studentName}</p>
                        <p><strong>Program:</strong> {selectedApplication.program}</p>
                      </div>
                      <div className="manage-applications-details-column">
                        <p><strong>University:</strong> State University</p>
                      </div>
                    </div>
                  </div>
                  <div className="manage-applications-details-section">
                    <h3>Loan Details</h3>
                    <div className="manage-applications-details-row">
                      <div className="manage-applications-details-column">
                        <p><strong>Amount Requested:</strong> ${selectedApplication.amount.toLocaleString()}</p>
                      </div>
                      <div className="manage-applications-details-column">
                        <p><strong>Purpose:</strong> {selectedApplication.purpose}</p>
                      </div>
                    </div>
                  </div>
                  <div className="manage-applications-details-section">
                    <h3>Guarantor Details</h3>
                    <div className="manage-applications-details-row">
                      <div className="manage-applications-details-column">
                        <p><strong>Name:</strong> {selectedApplication.guarantor.name}</p>
                        <p><strong>Relationship:</strong> {selectedApplication.guarantor.relationShip}</p>
                      </div>
                      <div className="manage-applications-details-column">
                        <p><strong>Occupation:</strong> {selectedApplication.guarantor.occupation}</p>
                        <p><strong>Annual Income:</strong> ${selectedApplication.guarantor.annualIncome.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="manage-applications-actions-buttons">
                    <button
                      className="manage-applications-action-btn manage-applications-generate-btn"
                      onClick={() => handleGenerateOffer(selectedApplication.id)}
                    >
                      Generate Offer
                    </button>
                  </div>
                </div>
              ) : (
                <p>Select an application to view details.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageApplications;