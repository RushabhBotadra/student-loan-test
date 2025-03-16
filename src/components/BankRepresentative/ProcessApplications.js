import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProcessApplications.css';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/StudentLoanServices',
});

const ProcessApplications = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [representativeId, setRepresentativeId] = useState(null);
  const [bankAdmins, setBankAdmins] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); 
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate('/login');
  };

  const fetchBankAdmins = async () => {
    try {
      const response = await axiosInstance.get('/api/bankAdmin/getBankAdmins');
      const admins = response.data || [];
      console.log(admins);
      const mappedAdmins = admins.map(admin => ({
        id: admin.adminId,
        name: admin.userName,
      }));
      setBankAdmins(mappedAdmins);
    } catch (err) {
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get('/api/application/getAssignedApplications');
      if (response.data.success) {
        const apps = response.data.data || [];
        const mappedApps = apps.map(app => ({
          id: app.applicationId,
          studentName: app.studentName,
          amount: app.amountRequested,
          program: app.program,
          status: app.status === 'DRAFT' ? 'Draft' : app.status === 'UNDER_REVIEW' ? 'Under Review' : app.status,
          submittedDate: app.submittedDate,
          purpose: app.purpose,
          guarantorName: app.guarantorName,
          guarantorRelationship: app.relationship,
          guarantorOccupation: app.occupation,
          guarantorIncome: app.annualIncome,
          assigneeId: app.assigneeId,
        }));
        const actionableApps = mappedApps.filter(app => app.status === 'Under Review');
        setApplications(actionableApps);
        if (actionableApps.length > 0) setSelectedApplication(actionableApps[0]);
      } else {
        setMessage({ text: response.data.message || 'Failed to fetch applications.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to fetch applications.', type: 'error' });
    }
  };

  const handleAction = async (action) => {
    if (!selectedApplication) return;
    try {
      let response;
      if (action === 'approve') {
        response = await axiosInstance.post(
          `/api/application/approve/${selectedApplication.id}?assigneeId=${parseInt(selectedAssigneeId)}`,
          {},
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        response = await axiosInstance.post(
          `/api/application/reject/${selectedApplication.id}`,
          {},
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.data.success) {
        setMessage({ text: response.data.message, type: 'success' });
        fetchApplications(); // Refresh the list
        if (action === 'approve') setSelectedAssigneeId('');
      } else {
        setMessage({ text: response.data.message || `Failed to ${action} application.`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || `Failed to ${action} application.`, type: 'error' });
    }
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000); 
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchBankAdmins(), fetchApplications()]);
      } catch (err) {
        setMessage({ text: 'An error occurred while fetching data.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="process-applications-container">
      <header className="process-applications-header">
        <div className="process-applications-branding">
          <Link to="/" className="process-applications-logo">Student Loan Service</Link>
        </div>
        <div className="process-applications-actions">
          <Link to="/bank-representative/dashboard" className="process-applications-nav-link">Dashboard</Link>
          <Link to="/bank-representative/assign-applications" className="process-applications-nav-link">Assign Applications</Link>
          <button className="process-applications-btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <main className="process-applications-main">
        {loading ? (
          <div className="process-applications-loading">
            Loading...
          </div>
        ) : (
          <>
            <h1 className="process-applications-title">Process Loan Applications</h1>
            <p className="process-applications-subtitle">Review and take action on pending loan applications.</p>

            {message.text && (
              <div className={message.type === 'success' ? 'process-applications-success-message' : 'process-applications-alert'}>
                <span>{message.text}</span>
                {message.type === 'error' && (
                  <button className="process-applications-close-btn" onClick={() => setMessage({ text: '', type: '' })}>×</button>
                )}
              </div>
            )}

            <div className="process-applications-content">
              <div className="process-applications-pending-list">
                <h2 className="process-applications-section-title">Pending Applications</h2>
                {applications.length === 0 ? (
                  <p className="process-applications-no-applications">No applications to process at this time.</p>
                ) : (
                  <div className="process-applications-pending-cards">
                    {applications.map(app => (
                      <div
                        key={app.id}
                        className={`process-applications-pending-card ${selectedApplication?.id === app.id ? 'selected' : ''}`}
                        onClick={() => setSelectedApplication(app)}
                      >
                        <span className="process-applications-pending-name">{app.studentName}</span>
                        <span className="process-applications-pending-details">
                          ${app.amount} - {app.program}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="process-applications-details">
                <h2 className="process-applications-section-title">Application Details</h2>
                {selectedApplication ? (
                  <div className="process-applications-details-card">
                    <div className="process-applications-details-meta">
                      ID: {selectedApplication.id} | Submitted: {selectedApplication.submittedDate}
                    </div>
                    <div className="process-applications-details-section">
                      <h3>Student Information</h3>
                      <div className="process-applications-details-row">
                        <div className="process-applications-details-column">
                          <p><strong>Name:</strong> {selectedApplication.studentName}</p>
                          <p><strong>Program:</strong> {selectedApplication.program}</p>
                        </div>
                        <div className="process-applications-details-column">
                          <p><strong>University:</strong> State University</p>
                        </div>
                      </div>
                    </div>
                    <div className="process-applications-details-section">
                      <h3>Loan Details</h3>
                      <div className="process-applications-details-row">
                        <div className="process-applications-details-column">
                          <p><strong>Amount Requested:</strong> ${selectedApplication.amount}</p>
                        </div>
                        <div className="process-applications-details-column">
                          <p><strong>Purpose:</strong> {selectedApplication.purpose}</p>
                        </div>
                      </div>
                    </div>
                    <div className="process-applications-details-section">
                      <h3>Guarantor Details</h3>
                      <div className="process-applications-details-row">
                        <div className="process-applications-details-column">
                          <p><strong>Name:</strong> {selectedApplication.guarantorName}</p>
                          <p><strong>Relationship:</strong> {selectedApplication.guarantorRelationship}</p>
                        </div>
                        <div className="process-applications-details-column">
                          <p><strong>Occupation:</strong> {selectedApplication.guarantorOccupation}</p>
                          <p><strong>Annual Income:</strong> ${selectedApplication.guarantorIncome}</p>
                        </div>
                      </div>
                    </div>
                    <div className="process-applications-details-section">
                      <h3>Assign To</h3>
                      <div className="process-applications-details-row">
                        <div className="process-applications-details-column">
                          <select
                            value={selectedAssigneeId}
                            onChange={(e) => setSelectedAssigneeId(e.target.value)}
                            className="process-applications-assignee-select"
                          >
                            <option value="" disabled>Select Bank Admin</option>
                            {bankAdmins.map(admin => (
                              <option key={admin.id} value={admin.id}>
                                {admin.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="process-applications-details-column"></div>
                      </div>
                    </div>
                    <div className="process-applications-actions-buttons">
                      <button
                        className="process-applications-action-btn process-applications-approve-btn"
                        onClick={() => handleAction('approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="process-applications-action-btn process-applications-reject-btn"
                        onClick={() => handleAction('reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="process-applications-no-selection">Select an application to view details.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProcessApplications;