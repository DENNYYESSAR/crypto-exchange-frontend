import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="container">
        <div className="main-content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .main-layout {
          min-height: calc(100vh - 200px);
          padding: 2rem 0;
        }

        .main-content {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .main-layout {
            padding: 1rem 0;
          }
          
          .main-content {
            padding: 1.5rem;
            border-radius: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
