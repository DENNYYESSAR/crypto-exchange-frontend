import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fas fa-coins"></i>
            <span>CryptoEx</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/market" className="nav-link">Market</Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/wallet" className="nav-link">Wallet</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
              </>
            ) : null}
          </nav>

          {/* User Menu */}
          <div className="user-menu">
            {currentUser ? (
              <div className="user-dropdown">
                <button 
                  className="user-button"
                  onClick={toggleMenu}
                >
                  <div className="user-avatar">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">
                    {currentUser.name || currentUser.email}
                  </span>
                  <i className={`fas fa-chevron-${isMenuOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/dashboard" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                      Dashboard
                    </Link>
                    <Link 
                      to="/wallet" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-wallet"></i>
                      Wallet
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="nav-mobile">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/market" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Market
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/wallet" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Wallet
                </Link>
                <Link to="/transactions" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Transactions
                </Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      <style jsx>{`
        .header {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          text-decoration: none;
        }

        .nav-desktop {
          display: none;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--primary-color);
        }

        .user-dropdown {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .user-button:hover {
          background-color: var(--bg-light);
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          display: none;
        }

        @media (min-width: 768px) {
          .user-name {
            display: block;
          }
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 12rem;
          z-index: 50;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          text-decoration: none;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: var(--bg-light);
        }

        .dropdown-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 0.5rem 0;
        }

        .logout-btn {
          color: var(--error-color) !important;
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .mobile-menu-btn {
          display: block;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .nav-mobile {
          display: block;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
        }

        @media (min-width: 768px) {
          .nav-mobile {
            display: none;
          }
        }

        .mobile-nav-link {
          display: block;
          padding: 0.75rem 0;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .mobile-nav-link:hover {
          color: var(--primary-color);
        }
      `}</style>
    </header>
  );
};

export default Header;
