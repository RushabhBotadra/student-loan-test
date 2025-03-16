// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <Link to="/" className="logo">Student Loan Service</Link>
        {/* <nav className="nav-links">
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </nav> */}
      </header>
      <main className="main-section">
        <h1>Student Loan Service</h1>
        {/* <p>Simple, straightforward student loans for your education journey</p> */}
        <p>Apply for educational loans with competitive interest rates and flexible repayment options.</p>
        <div className="buttons">
          <Link to="/login">
            <button className="btn btn-primary">Log In</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-secondary">Sign Up</button>
          </Link>
        </div>
      </main>
      {/* <section className="cards-section">
        <div className="card">
          <h3>For Students</h3>
          <p>Apply for educational loans with competitive interest rates and flexible repayment options.</p>
        </div>
        <div className="card">
          <h3>For Bank Admins</h3>
          <p>Manage loan programs, set policies, and oversee the entire lending process.</p>
        </div>
        <div className="card">
          <h3>For Representatives</h3>
          <p>Process loan applications, assist students, and ensure compliance standards.</p>
        </div>
      </section> */}
    </div>
  );
};

export default Home;