import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home"></i>
              Go Home
            </Link>
            <Link to="/market" className="btn btn-outline">
              <i className="fas fa-chart-line"></i>
              View Market
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }

        .not-found-content {
          text-align: center;
          max-width: 500px;
        }

        .error-icon {
          font-size: 4rem;
          color: var(--warning-color);
          margin-bottom: 2rem;
        }

        .not-found-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .not-found-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .not-found-actions .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
        }

        @media (max-width: 480px) {
          .not-found-content h1 {
            font-size: 2rem;
          }

          .not-found-actions {
            flex-direction: column;
          }

          .not-found-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
