import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCryptoById, getCryptoPriceHistory, buyCrypto, sellCrypto } from '../services/cryptoService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters';
import PriceChart from '../components/crypto/PriceChart';
import { toast } from 'react-toastify';

const CryptoDetail = () => {
  const { id } = useParams();
  const { currentUser, token } = useAuth();
  const [crypto, setCrypto] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState('7d');
  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    fetchCryptoData();
  }, [id]);

  useEffect(() => {
    if (crypto) {
      fetchPriceHistory();
    }
  }, [chartTimeframe, crypto]);

  const fetchCryptoData = async () => {
    try {
      const data = await getCryptoById(id);
      setCrypto(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast.error('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const data = await getCryptoPriceHistory(id, chartTimeframe);
      setPriceHistory(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to trade');
      return;
    }

    if (!tradeAmount) {
      toast.error('Please enter an amount');
      return;
    }

    setTradeLoading(true);
    try {
      const tradeData = {
        cryptoId: id,
        amount: parseFloat(tradeAmount),
        type: tradeType,
      };

      if (tradeType === 'buy') {
        await buyCrypto(token, tradeData);
        toast.success('Buy order placed successfully!');
      } else {
        await sellCrypto(token, tradeData);
        toast.success('Sell order placed successfully!');
      }

      setTradeAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="crypto-detail-loading">
        <div className="spinner"></div>
        <p>Loading cryptocurrency details...</p>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="crypto-not-found">
        <h1>Cryptocurrency not found</h1>
        <Link to="/market" className="btn btn-primary">
          Back to Market
        </Link>
      </div>
    );
  }

  const priceChange = crypto.price_change_percentage_24h || 0;
  const isPositiveChange = priceChange >= 0;

  return (
    <div className="crypto-detail-page">
      <div className="container">
        {/* Header */}
        <div className="crypto-header">
          <Link to="/market" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Back to Market
          </Link>
          
          <div className="crypto-title">
            <img src={crypto.image} alt={crypto.name} className="crypto-logo" />
            <div>
              <h1>{crypto.name}</h1>
              <p>{crypto.symbol.toUpperCase()}</p>
            </div>
          </div>

          <div className="crypto-rank">
            Rank #{crypto.market_cap_rank}
          </div>
        </div>

        <div className="crypto-layout">
          {/* Left Column - Chart and Stats */}
          <div className="crypto-main">
            {/* Price Info */}
            <div className="price-section">
              <div className="current-price">
                {formatCurrency(crypto.current_price)}
              </div>
              <div className={`price-change ${isPositiveChange ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${isPositiveChange ? 'up' : 'down'}`}></i>
                {formatPercentage(Math.abs(priceChange))} (24h)
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <div className="chart-header">
                <h2>Price Chart</h2>
                <div className="timeframe-buttons">
                  {['1d', '7d', '30d', '90d', '1y'].map((timeframe) => (
                    <button
                      key={timeframe}
                      className={`timeframe-btn ${chartTimeframe === timeframe ? 'active' : ''}`}
                      onClick={() => setChartTimeframe(timeframe)}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-container">
                <PriceChart data={priceHistory} />
              </div>
            </div>

            {/* Market Stats */}
            <div className="market-stats">
              <h2>Market Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Market Cap</span>
                  <span className="stat-value">{formatCurrency(crypto.market_cap)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">24h Volume</span>
                  <span className="stat-value">{formatCurrency(crypto.total_volume)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Circulating Supply</span>
                  <span className="stat-value">
                    {formatLargeNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Supply</span>
                  <span className="stat-value">
                    {crypto.total_supply ? 
                      formatLargeNumber(crypto.total_supply) + ' ' + crypto.symbol.toUpperCase() : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">All-time High</span>
                  <span className="stat-value">{formatCurrency(crypto.ath)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">All-time Low</span>
                  <span className="stat-value">{formatCurrency(crypto.atl)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Trading */}
          <div className="crypto-sidebar">
            {currentUser ? (
              <div className="trading-panel">
                <h2>Trade {crypto.symbol.toUpperCase()}</h2>
                
                <div className="trade-tabs">
                  <button
                    className={`trade-tab ${tradeType === 'buy' ? 'active' : ''}`}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy
                  </button>
                  <button
                    className={`trade-tab ${tradeType === 'sell' ? 'active' : ''}`}
                    onClick={() => setTradeType('sell')}
                  >
                    Sell
                  </button>
                </div>

                <form onSubmit={handleTrade} className="trade-form">
                  <div className="form-group">
                    <label>Amount ({crypto.symbol.toUpperCase()})</label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="form-control"
                      placeholder="0.00"
                      step="0.00000001"
                      min="0"
                      required
                    />
                  </div>

                  <div className="trade-summary">
                    <div className="summary-row">
                      <span>Price per {crypto.symbol.toUpperCase()}:</span>
                      <strong>{formatCurrency(crypto.current_price)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total:</span>
                      <strong>
                        {formatCurrency((parseFloat(tradeAmount) || 0) * crypto.current_price)}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-full ${tradeType === 'buy' ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={tradeLoading || !tradeAmount}
                  >
                    {tradeLoading ? (
                      <>
                        <div className="spinner-small"></div>
                        Processing...
                      </>
                    ) : (
                      `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${crypto.symbol.toUpperCase()}`
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="login-prompt">
                <h2>Start Trading</h2>
                <p>Sign in to buy and sell {crypto.name}</p>
                <Link to="/login" className="btn btn-primary btn-full">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline btn-full">
                  Create Account
                </Link>
              </div>
            )}

            {/* Quick Stats */}
            <div className="quick-stats">
              <h3>Quick Stats</h3>
              <div className="quick-stat">
                <span>24h High</span>
                <span>{formatCurrency(crypto.high_24h)}</span>
              </div>
              <div className="quick-stat">
                <span>24h Low</span>
                <span>{formatCurrency(crypto.low_24h)}</span>
              </div>
              <div className="quick-stat">
                <span>Market Cap Rank</span>
                <span>#{crypto.market_cap_rank}</span>
              </div>
              <div className="quick-stat">
                <span>Price Change (7d)</span>
                <span className={crypto.price_change_percentage_7d >= 0 ? 'positive' : 'negative'}>
                  {formatPercentage(crypto.price_change_percentage_7d || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {crypto.description && (
          <div className="crypto-description">
            <h2>About {crypto.name}</h2>
            <div className="description-content">
              <p>{crypto.description.en || 'No description available.'}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .crypto-detail-page {
          padding: 2rem 0;
        }

        .crypto-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--primary-color);
        }

        .crypto-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .crypto-logo {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }

        .crypto-title h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .crypto-title p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        .crypto-rank {
          background-color: var(--bg-light);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .crypto-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .crypto-layout {
            grid-template-columns: 2fr 1fr;
          }
        }

        .crypto-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .price-section {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .current-price {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .price-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .price-change.positive {
          color: var(--success-color);
        }

        .price-change.negative {
          color: var(--error-color);
        }

        .chart-section {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .chart-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .timeframe-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .timeframe-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .timeframe-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .timeframe-btn:hover:not(.active) {
          background-color: var(--bg-light);
        }

        .chart-container {
          height: 400px;
        }

        .market-stats {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .market-stats h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .stat-value {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .crypto-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .trading-panel {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .trading-panel h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .trade-tabs {
          display: flex;
          background-color: var(--bg-light);
          border-radius: 8px;
          padding: 0.25rem;
          margin-bottom: 1.5rem;
        }

        .trade-tab {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .trade-tab.active {
          background-color: var(--bg-card);
          color: var(--primary-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .trade-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-control {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .trade-summary {
          padding: 1rem;
          background-color: var(--bg-light);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .summary-row:last-child {
          margin-bottom: 0;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .btn-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-full:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: var(--primary-dark);
        }

        .btn-secondary {
          background-color: var(--secondary-color);
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #0ea271;
        }

        .btn-outline {
          background-color: transparent;
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
        }

        .btn-outline:hover {
          background-color: rgba(37, 99, 235, 0.1);
        }

        .spinner-small {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        .login-prompt {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .login-prompt h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .login-prompt p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .login-prompt .btn {
          margin-bottom: 0.75rem;
        }

        .login-prompt .btn:last-child {
          margin-bottom: 0;
        }

        .quick-stats {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .quick-stats h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .quick-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .quick-stat:last-child {
          border-bottom: none;
        }

        .quick-stat span:first-child {
          color: var(--text-secondary);
        }

        .quick-stat span:last-child {
          font-weight: 600;
        }

        .quick-stat .positive {
          color: var(--success-color);
        }

        .quick-stat .negative {
          color: var(--error-color);
        }

        .crypto-description {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          margin-top: 2rem;
        }

        .crypto-description h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .description-content p {
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .crypto-detail-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .crypto-detail-loading .spinner {
          margin-bottom: 1rem;
        }

        .crypto-not-found {
          text-align: center;
          padding: 4rem 2rem;
        }

        .crypto-not-found h1 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .crypto-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .crypto-title {
            order: -1;
          }

          .current-price {
            font-size: 2rem;
          }

          .chart-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .timeframe-buttons {
            flex-wrap: wrap;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoDetail;
