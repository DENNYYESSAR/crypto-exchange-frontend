import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-coins"></i>
              <span>CryptoEx</span>
            </div>
            <p className="footer-description">
              Your trusted cryptocurrency exchange platform. Trade with confidence and security.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link" aria-label="Telegram">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/market">Market</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>

          {/* Trading */}
          <div className="footer-section">
            <h3 className="footer-title">Trading</h3>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/wallet">Wallet</Link></li>
              <li><Link to="/transactions">Transactions</Link></li>
              <li><a href="#">API Documentation</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
              <li><Link to="/security">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 CryptoEx. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/security">Security</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--text-primary);
          color: white;
          margin-top: auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 3rem 0 2rem;
        }

        @media (min-width: 640px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-light);
          margin-bottom: 0.5rem;
        }

        .footer-description {
          color: #94a3b8;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: background-color 0.2s, transform 0.2s;
        }

        .social-link:hover {
          background-color: var(--primary-color);
          transform: translateY(-2px);
        }

        .footer-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--primary-light);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 0;
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-bottom-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover {
          color: var(--primary-light);
        }

        .footer-bottom p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
