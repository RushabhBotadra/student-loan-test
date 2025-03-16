import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/StudentLoanServices', // Backend base URL
});

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'bankRepresentative', 
  });

  const [message, setMessage] = useState({ text: '', type: '' }); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await axiosInstance.post('/api/user/register', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Display success message and navigate
        setMessage({ text: response.data.message, type: 'success' });
        setTimeout(() => {
          navigate('/bank-representative/dashboard');
        }, 1000);
      } else {
        setMessage({ text: response.data.message || 'Registration failed.', type: 'error' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during registration.';
      setMessage({ text: errorMessage, type: 'error' });
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="auth-container">
      <header className="header">
        <Link to="/" className="logo">Student Loan Service</Link>
      </header>
      <div className="form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create a New Account</h2>
          {message.text && (
            <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
              {message.text}
            </p>
          )}
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              className="dropdown"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="bankAdmin">Bank Admin</option>
              <option value="bankRepresentative">Bank Representative</option>
            </select>
          </div> */}
          <button type="submit" className="btn btn-primary full-width">
            Sign Up
          </button>
          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;