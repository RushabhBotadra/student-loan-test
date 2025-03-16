import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/StudentLoanServices',
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' }); // State for both success and error messages
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
      const response = await axiosInstance.post(
        // `/api/user/login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`,
        `/api/user/login?email=${(formData.email)}&password=${(formData.password)}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data)
      if (response.data.success) {
        setMessage({ text: response.data.message, type: 'success' });
        setTimeout(() => {
          navigate('/bank-representative/dashboard');
        }, 1000); 
      } else {
        setMessage({ text: response.data.message || 'Login failed.', type: 'error' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login.';
      setMessage({ text: errorMessage, type: 'error' });
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <header className="header">
        <Link to="/" className="logo">Student Loan Service</Link>
      </header>
      <div className="form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Log In to Your Account</h2>
          {message.text && (
            <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
              {message.text}
            </p>
          )}
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
          <button type="submit" className="btn btn-primary full-width">
            Log In
          </button>
          <p className="login-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;