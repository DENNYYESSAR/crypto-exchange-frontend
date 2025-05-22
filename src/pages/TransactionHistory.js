import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTransactions } from '../services/transactionService';
import { formatCurrency, formatDate, formatTransactionType, formatTransactionStatus } from '../utils/formatters';

const TransactionHistory = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getUserTransactions(token, currentPage, itemsPerPage);
      setTransactions(data.transactions || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy':
        return 'fa-arrow-down text-green-600';
      case 'sell':
        return 'fa-arrow-up text-red-600';
      case 'deposit':
        return 'fa-plus text-blue-600';
      case 'withdrawal':
        return 'fa-minus text-orange-600';
      default:
        return 'fa-exchange-alt';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>Transaction History</h1>
          <p>View all your trading and wallet transactions</p>
        </div>
        <button className="btn btn-outline" onClick={fetchTransactions}>
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      <div className="transactions-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'buy' ? 'active' : ''}`}
            onClick={() => setFilter('buy')}
          >
            Buy
          </button>
          <button
            className={`filter-tab ${filter === 'sell' ? 'active' : ''}`}
            onClick={() => setFilter('sell')}
          >
            Sell
          </button>
          <button
            className={`filter-tab ${filter === 'deposit' ? 'active' : ''}`}
            onClick={() => setFilter('deposit')}
          >
            Deposit
          </button>
          <button
            className={`filter-tab ${filter === 'withdrawal' ? 'active' : ''}`}
            onClick={() => setFilter('withdrawal')}
          >
            Withdrawal
          </button>
        </div>

        <div className="transactions-summary">
          <div className="summary-item">
            <span className="summary-label">Total Transactions</span>
            <span className="summary-value">{transactions.length}</span>
          </div>
        </div>
      </div>

      <div className="transactions-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="desktop-view">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="transaction-row">
                      <td className="type-col">
                        <div className="transaction-type">
                          <i className={`fas ${getTransactionIcon(transaction.type)}`}></i>
                          <span>{formatTransactionType(transaction.type)}</span>
                        </div>
                      </td>
                      <td className="asset-col">
                        <div className="asset-info">
                          {transaction.cryptoImage && (
                            <img 
                              src={transaction.cryptoImage} 
                              alt={transaction.crypto}
                              className="asset-logo"
                            />
                          )}
                          <div>
                            <span className="asset-name">{transaction.crypto}</span>
                            <span className="asset-symbol">{transaction.cryptoSymbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="amount-col">
                        {transaction.cryptoAmount?.toFixed(8)} {transaction.cryptoSymbol}
                      </td>
                      <td className="price-col">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="total-col">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="status-col">
                        <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                          {formatTransactionStatus(transaction.status)}
                        </span>
                      </td>
                      <td className="date-col">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="actions-col">
                        <button className="btn btn-sm btn-outline">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-card">
                  <div className="card-header">
                    <div className="transaction-type">
                      <i className={`fas ${getTransactionIcon(transaction.type)}`}></i>
                      <span>{formatTransactionType(transaction.type)}</span>
                    </div>
                    <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                      {formatTransactionStatus(transaction.status)}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <div className="transaction-info">
                      <div className="info-row">
                        <span className="label">Asset:</span>
                        <span className="value">{transaction.crypto}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Amount:</span>
                        <span className="value">
                          {transaction.cryptoAmount?.toFixed(8)} {transaction.cryptoSymbol}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Total:</span>
                        <span className="value">{formatCurrency(transaction.amount)}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Date:</span>
                        <span className="value">{formatDate(transaction.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <i className="fas fa-receipt"></i>
            <h3>No transactions found</h3>
            <p>Your transaction history will appear here once you start trading</p>
            <button className="btn btn-primary">
              Start Trading
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .transactions-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .transactions-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .transactions-header p {
          color: var(--text-secondary);
        }

        .transactions-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .transactions-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
        }

        .filter-tabs {
          display: flex;
          background-color: var(--bg-light);
          border-radius: 8px;
          padding: 0.25rem;
          gap: 0.25rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-tab.active {
          background-color: var(--bg-card);
          color: var(--primary-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .transactions-summary {
          display: flex;
          gap: 2rem;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .summary-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .summary-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .transactions-container {
          background-color: var(--bg-card);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
        }

        .desktop-view {
          display: block;
          overflow-x: auto;
        }

        .mobile-view {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-view {
            display: none;
          }
          
          .mobile-view {
            display: block;
            padding: 1rem;
          }
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .transactions-table th {
          background-color: var(--bg-light);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }

        .transactions-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .transaction-row {
          transition: background-color 0.2s;
        }

        .transaction-row:hover {
          background-color: var(--bg-light);
        }

        .transaction-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .transaction-type i {
          width: 1rem;
        }

        .asset-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .asset-logo {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
        }

        .asset-name {
          font-weight: 500;
        }

        .asset-symbol {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-left: 0.25rem;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .transaction-card {
          background-color: var(--bg-light);
          border-radius: 8px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
        }

        .card-body {
          padding: 1rem;
        }

        .transaction-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-row .label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .info-row .value {
          font-weight: 500;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .loading-state .spinner {
          margin-bottom: 1rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-state i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .empty-state p {
          margin-bottom: 1.5rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background-color: var(--bg-light);
          border-top: 1px solid var(--border-color);
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .pagination-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-sm {
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .transactions-header {
            flex-direction: column;
            gap: 1rem;
          }

          .transactions-header .btn {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
