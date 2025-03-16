// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Ensure this import is present
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import RepresentativeDashboard from './components/BankRepresentative/RepresentativeDashboard';
import ProcessApplications from './components/BankRepresentative/ProcessApplications';
import AssignApplications from './components/BankRepresentative/AssignApplications';
import BankAdminDashboard from './components/BankAdmin/BankAdminDashboard';
import ManageApplications from './components/BankAdmin/ManageApplications';
import ManageOffers from './components/BankAdmin/ManageOffers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bank-representative/dashboard" element={<RepresentativeDashboard />} />
        <Route path="/representative-applications" element={<div>Applications Page</div>} />
        <Route path="/representative-students" element={<div>Students Page</div>} />
        <Route path="/representative-reports" element={<div>Reports Page</div>} />
        <Route path="/bank-representative/process-applications" element={<ProcessApplications />} />
        <Route path="/bank-representative/assign-applications" element={<AssignApplications />} />
        <Route path="/bank-admin/dashboard" element={<BankAdminDashboard />} />
        <Route path="/bank-admin/manage-applications" element={<ManageApplications />} />
        <Route path="/bank-admin/manage-offers" element={<ManageOffers />} />
      </Routes>
    </Router>
  );
}

export default App;

