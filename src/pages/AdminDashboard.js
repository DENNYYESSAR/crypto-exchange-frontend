import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalVolume: 0,
    pendingTransactions: 0,
    revenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 15847,
        activeUsers: 8923,
        totalTransactions: 45623,
        totalVolume: 8745623.89,
        pendingTransactions: 127,
        revenue: 87456.23,
      });

      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: new Date('2024-01-15'), status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: new Date('2024-01-14'), status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: new Date('2024-01-13'), status: 'pending' },
      ]);

      setRecentTransactions([
        { id: 1, user: 'John Doe', type: 'buy', crypto: 'BTC', amount: 5000, status: 'completed', date: new Date('2024-01-15') },
        { id: 2, user: 'Jane Smith', type: 'sell', crypto: 'ETH', amount: 3200, status: 'pending', date: new Date('2024-01-15') },
        { id: 3, user: 'Mike Johnson', type: 'buy', crypto: 'ADA', amount: 1500, status: 'completed', date: new Date('2024-01-14') },
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {currentUser?.name}. Here's your platform overview.</p>
        </div>
        <div className="admin-actions">
          <button className="btn btn-outline">
            <i className="fas fa-download"></i>
            Export Report
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-users">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers.toLocaleString()}</p>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon transactions">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <p className="stat-number">{stats.totalTransactions.toLocaleString()}</p>
            <span className="stat-change positive">+15% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon volume">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>Trading Volume</h3>
            <p className="stat-number">{formatCurrency(stats.totalVolume)}</p>
            <span className="stat-change positive">+22% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Pending Transactions</h3>
            <p className="stat-number">{stats.pendingTransactions}</p>
            <span className="stat-change negative">+3 from yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.revenue)}</p>
            <span className="stat-change positive">+18% from last month</span>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* Recent Users */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.joinDate)}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline">
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Crypto</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.user}</td>
                    <td>
                      <span className={`transaction-type ${transaction.type}`}>
                        <i className={`fas fa-arrow-${transaction.type === 'buy' ? 'down' : 'up'}`}></i>
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="crypto-symbol">{transaction.crypto}</span>
                    </td>
                    <td>{formatCurrency(transaction.amount)}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline">
                          <i className="fas fa-eye"></i>
                        </button>
                        {transaction.status === 'pending' && (
                          <button className="btn btn-sm btn-primary">
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health">
        <h2>System Health</h2>
        <div className="health-grid">
          <div className="health-item">
            <div className="health-status online"></div>
            <div>
              <h4>API Server</h4>
              <p>Online - Response time: 45ms</p>
            </div>
          </div>
          <div className="health-item">
            <div className="health-status online"></div>
            <div>
              <h4>Database</h4>
              <p>Online - Connection pool: 85%</p>
            </div>
          </div>
          <div className="health-item">
            <div className="health-status warning"></div>
            <div>
              <h4>Payment Gateway</h4>
              <p>Warning - High latency detected</p>
            </div>
          </div>
          <div className="health-item">
            <div className="health-status online"></div>
            <div>
              <h4>WebSocket</h4>
              <p>Online - 1,247 active connections</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1600px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .admin-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .admin-header p {
          color: var(--text-secondary);
        }

        .admin-actions {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
        }

        .stat-icon.users {
          background-color: var(--primary-color);
        }

        .stat-icon.active-users {
          background-color: var(--secondary-color);
        }

        .stat-icon.transactions {
          background-color: #8b5cf6;
        }

        .stat-icon.volume {
          background-color: #06b6d4;
        }

        .stat-icon.pending {
          background-color: var(--warning-color);
        }

        .stat-icon.revenue {
          background-color: #10b981;
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h3 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .stat-change {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--success-color);
        }

        .stat-change.negative {
          color: var(--error-color);
        }

        .admin-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 1200px) {
          .admin-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .admin-section {
          background-color: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-light);
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .table-container {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          background-color: var(--bg-light);
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .admin-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          font-size: 0.875rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.active {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .status-badge.pending {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }

        .status-badge.completed {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .transaction-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .transaction-type.buy {
          color: var(--success-color);
        }

        .transaction-type.sell {
          color: var(--error-color);
        }

        .crypto-symbol {
          font-weight: 600;
          color: var(--primary-color);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .system-health {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .system-health h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .health-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .health-status {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .health-status.online {
          background-color: var(--success-color);
        }

        .health-status.warning {
          background-color: var(--warning-color);
        }

        .health-status.offline {
          background-color: var(--error-color);
        }

        .health-item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .health-item p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .admin-loading .spinner {
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 1rem;
          }

          .admin-actions {
            width: 100%;
          }

          .admin-actions .btn {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .admin-table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
