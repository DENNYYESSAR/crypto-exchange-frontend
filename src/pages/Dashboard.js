import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPortfolio, getTrendingCryptos } from '../services/cryptoService';
import { getWalletBalance, getUserTransactions } from '../services/transactionService';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import PortfolioChart from '../components/crypto/PortfolioChart';
import QuickTrade from '../components/crypto/QuickTrade';

const Dashboard = () => {
  const { currentUser, token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trendingCryptos, setTrendingCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [portfolioData, balanceData, transactionsData, trendingData] = await Promise.all([
          getUserPortfolio(token),
          getWalletBalance(token),
          getUserTransactions(token, 1, 5),
          getTrendingCryptos()
        ]);

        setPortfolio(portfolioData);
        setWalletBalance(balanceData);
        setRecentTransactions(transactionsData.transactions || []);
        setTrendingCryptos(trendingData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const totalPortfolioValue = portfolio?.totalValue || 0;
  const portfolioChange = portfolio?.change24h || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {currentUser?.name || 'Trader'}!</h1>
          <p>Here's what's happening with your portfolio today.</p>
        </div>
        <div className="header-actions">
          <Link to="/wallet" className="btn btn-outline">
            <i className="fas fa-wallet"></i>
            Wallet
          </Link>
          <Link to="/market" className="btn btn-primary">
            <i className="fas fa-chart-line"></i>
            Trade Now
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Portfolio Overview */}
        <div className="widget portfolio-overview">
          <div className="widget-header">
            <h2 className="widget-title">Portfolio Overview</h2>
            <Link to="/wallet" className="view-all">View All</Link>
          </div>
          <div className="portfolio-stats">
            <div className="portfolio-value">
              <span className="value-label">Total Balance</span>
              <span className="value-amount">{formatCurrency(totalPortfolioValue)}</span>
              <span className={`value-change ${portfolioChange >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(portfolioChange)} (24h)
              </span>
            </div>
          </div>
          {portfolio && <PortfolioChart data={portfolio.chartData} />}
        </div>

        {/* Wallet Balance */}
        <div className="widget wallet-summary">
          <div className="widget-header">
            <h2 className="widget-title">Wallet Balance</h2>
            <Link to="/wallet" className="view-all">Manage</Link>
          </div>
          <div className="balance-list">
            <div className="balance-item">
              <div className="balance-info">
                <span className="balance-currency">USD</span>
                <span className="balance-name">US Dollar</span>
              </div>
              <span className="balance-amount">
                {formatCurrency(walletBalance?.usd || 0)}
              </span>
            </div>
            {walletBalance?.cryptos?.slice(0, 3).map((crypto) => (
              <div key={crypto.symbol} className="balance-item">
                <div className="balance-info">
                  <span className="balance-currency">{crypto.symbol.toUpperCase()}</span>
                  <span className="balance-name">{crypto.name}</span>
                </div>
                <div className="balance-amounts">
                  <span className="balance-amount">{crypto.amount.toFixed(6)}</span>
                  <span className="balance-value">
                    {formatCurrency(crypto.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Trade */}
        <div className="widget quick-trade-widget">
          <div className="widget-header">
            <h2 className="widget-title">Quick Trade</h2>
          </div>
          <QuickTrade />
        </div>

        {/* Recent Transactions */}
        <div className="widget recent-transactions">
          <div className="widget-header">
            <h2 className="widget-title">Recent Transactions</h2>
            <Link to="/transactions" className="view-all">View All</Link>
          </div>
          <div className="transactions-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    <i className={`fas fa-${transaction.type === 'buy' ? 'arrow-down' : 'arrow-up'}`}></i>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-main">
                      <span className="transaction-type">
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.crypto}
                      </span>
                      <span className="transaction-amount">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-date">
                        {formatDate(transaction.createdAt)}
                      </span>
                      <span className={`transaction-status ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-exchange-alt"></i>
                <p>No transactions yet</p>
                <Link to="/market" className="btn btn-primary btn-sm">
                  Start Trading
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trending Cryptocurrencies */}
        <div className="widget trending-cryptos">
          <div className="widget-header">
            <h2 className="widget-title">Trending</h2>
            <Link to="/market" className="view-all">View Market</Link>
          </div>
          <div className="crypto-list">
            {trendingCryptos.slice(0, 5).map((crypto) => (
              <Link 
                key={crypto.id} 
                to={`/crypto/${crypto.id}`}
                className="crypto-item"
              >
                <div className="crypto-info">
                  <img src={crypto.image} alt={crypto.name} className="crypto-logo" />
                  <div>
                    <span className="crypto-name">{crypto.name}</span>
                    <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <div className="crypto-price-info">
                  <span className="crypto-price">
                    {formatCurrency(crypto.current_price)}
                  </span>
                  <span className={`crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div className="widget market-news">
          <div className="widget-header">
            <h2 className="widget-title">Market News</h2>
          </div>
          <div className="news-list">
            <div className="news-item">
              <h4>Bitcoin Reaches New All-Time High</h4>
              <p>Bitcoin continues its bullish momentum as institutional adoption increases...</p>
              <span className="news-time">2 hours ago</span>
            </div>
            <div className="news-item">
              <h4>Ethereum 2.0 Staking Rewards</h4>
              <p>New staking opportunities available with attractive APY rates...</p>
              <span className="news-time">4 hours ago</span>
            </div>
            <div className="news-item">
              <h4>DeFi Market Update</h4>
              <p>Total value locked in DeFi protocols reaches new milestone...</p>
              <span className="news-time">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .widget {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .widget-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .view-all {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .portfolio-overview {
          grid-column: span 1;
        }

        @media (min-width: 1200px) {
          .portfolio-overview {
            grid-column: span 2;
          }
        }

        .portfolio-stats {
          margin-bottom: 1.5rem;
        }

        .portfolio-value {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .value-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .value-amount {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .value-change {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .value-change.positive {
          color: var(--success-color);
        }

        .value-change.negative {
          color: var(--error-color);
        }

        .balance-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .balance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .balance-info {
          display: flex;
          flex-direction: column;
        }

        .balance-currency {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .balance-name {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .balance-amounts {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .balance-amount {
          font-weight: 600;
        }

        .balance-value {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transaction-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .transaction-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .transaction-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .transaction-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .transaction-type {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .transaction-amount {
          font-weight: 600;
        }

        .transaction-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .transaction-date {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .transaction-status {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .transaction-status.completed {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .transaction-status.pending {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }

        .crypto-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .crypto-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s;
        }

        .crypto-item:hover {
          background-color: var(--border-color);
        }

        .crypto-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .crypto-logo {
          width: 1.5rem;
          height: 1.5rem;
        }

        .crypto-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .crypto-symbol {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-left: 0.5rem;
        }

        .crypto-price-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .crypto-price {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .crypto-change {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .crypto-change.positive {
          color: var(--success-color);
        }

        .crypto-change.negative {
          color: var(--error-color);
        }

        .news-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .news-item {
          padding: 1rem;
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .news-item h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .news-item p {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .news-time {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-secondary);
        }

        .empty-state i {
          font-size: 2rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state p {
          margin-bottom: 1rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .dashboard-loading .spinner {
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions .btn {
            flex: 1;
          }

          .value-amount {
            font-size: 1.5rem;
          }

          .balance-amounts {
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
