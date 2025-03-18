import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css"; // Create this CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: kamranmohammed400@gmail.com</p>
          <p>Phone: +91 970355 88400</p>
          {/* <p>Address: 123, Main Street, City, Country</p> */}
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/search" className="footer-link">
            Search
          </Link>
          <Link to="/list" className="footer-link">
            List Vehicle
          </Link>
          <Link to="/settings" className="footer-link">
            Settings
          </Link>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Cool Motors. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
