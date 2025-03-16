// src/components/BankAdmin/ManageOffers.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageOffers.css';

const ManageOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/StudentLoanServices/bankadmin/getAllOffers');
        console.log('API Response:', response.data); // Log the raw response to inspect its structure

        // Map the response data to the expected format
        const mappedOffers = response.data.map((offer, index) => {
          // Fallback values in case some fields are missing
          const application = offer.application || {};
          const applicant = application.applicant || {};

          return {
            id: offer.offerId || `N/A_${index}`, // Fallback if offerId is missing
            applicationId: application.applicationId || 'N/A',
            studentName: applicant.firstName && applicant.lastName 
              ? `${applicant.firstName} ${applicant.lastName}` 
              : 'Unknown Applicant',
            amount: application.loanAmount || 0,
            interestRate: offer.interestRate || 0,
            term: offer.loanTerm || 0,
            status: offer.status === 'DISBURSED' ? 'Active' : 'Inactive', // Adjust based on backend status values
          };
        });

        setOffers(mappedOffers);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to fetch offers.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleDisburse = async (offerId) => {
    try {
      const response = await axios.put(`http://localhost:8080/bankadmin/disburseLoan/${offerId}`);
      if (response.status === 200) {
        setOffers(offers.map(offer =>
          offer.id === offerId ? { ...offer, status: 'Active' } : offer
        ));
        setMessage('Loan disbursed successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error disbursing loan:', err);
      setError('Failed to disburse loan.');
    }
  };

  const handleDeactivate = (offerId) => {
    // Placeholder for deactivation logic
    setOffers(offers.map(offer =>
      offer.id === offerId ? { ...offer, status: 'Inactive' } : offer
    ));
    setMessage('Offer deactivated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    navigate('/bank-admin/login');
  };

  return (
    <div className="manage-offers-container">
      <header className="manage-offers-header">
        <div className="manage-offers-branding">
          <Link to="/bank-admin/dashboard" className="manage-offers-logo">Student Loan Services</Link>
        </div>
        <div className="manage-offers-actions">
          <Link to="/bank-admin/dashboard" className="manage-offers-nav-link">Dashboard</Link>
          {/* <Link to="/bank-admin/approve-registrations" className="manage-offers-nav-link">Approve Registrations</Link> */}
          <Link to="/bank-admin/manage-applications" className="manage-offers-nav-link">Manage Applications</Link>
          <Link to="/bank-admin/admin-list" className="manage-offers-nav-link">Admin List</Link>
          <button className="manage-offers-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="manage-offers-main">
        <h1 className="manage-offers-title">Manage Offers</h1>
        <p className="manage-offers-subtitle">Review and manage the various loan offers.</p>
        {error && <p className="manage-offers-error">{error}</p>}
        {message && (
          <div className="manage-offers-success-message">
            <span>{message}</span>
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="manage-offers-table-container">
            {offers.length > 0 ? (
              <table className="manage-offers-table">
                <thead>
                  <tr>
                    <th>Offer ID</th>
                    <th>Student Name</th>
                    <th>Amount</th>
                    <th>Interest Rate</th>
                    <th>Term (Years)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer.id}>
                      <td>{offer.id}</td>
                      <td>{offer.studentName}</td>
                      <td>${offer.amount.toLocaleString()}</td>
                      <td>{offer.interestRate}%</td>
                      <td>{offer.term}</td>
                      <td>
                        <span
                          className={`manage-offers-status ${
                            offer.status === 'Active' ? 'active' : 'inactive'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </td>
                      <td>
                        {offer.status === 'Active' ? (
                          <button
                            className="manage-offers-action-btn manage-offers-deactivate-btn"
                            onClick={() => handleDeactivate(offer.id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="manage-offers-action-btn manage-offers-activate-btn"
                            onClick={() => handleDisburse(offer.id)}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No offers available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageOffers;