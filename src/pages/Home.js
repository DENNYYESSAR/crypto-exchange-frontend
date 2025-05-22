import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCryptos, getMarketStats } from '../services/cryptoService';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters';

const Home = () => {
  const [cryptos, setCryptos] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cryptoData, statsData] = await Promise.all([
          getAllCryptos(1, 6),
          getMarketStats()
        ]);
        setCryptos(cryptoData.data || []);
        setMarketStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Trade Crypto with <span className="highlight">Confidence</span>
              </h1>
              <p className="hero-description">
                Join millions of users trading cryptocurrency on the world's most secure 
                and trusted platform. Start your crypto journey today.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/market" className="btn btn-outline btn-large">
                  View Market
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="crypto-animation">
                <i className="fab fa-bitcoin crypto-icon bitcoin"></i>
                <i className="fab fa-ethereum crypto-icon ethereum"></i>
                <i className="fas fa-coins crypto-icon altcoin"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      {marketStats && (
        <section className="market-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Market Cap</h3>
                <p className="stat-value">
                  {formatCurrency(marketStats.totalMarketCap)}
                </p>
              </div>
              <div className="stat-card">
                <h3>24h Volume</h3>
                <p className="stat-value">
                  {formatCurrency(marketStats.total24hVolume)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Active Cryptocurrencies</h3>
                <p className="stat-value">
                  {formatLargeNumber(marketStats.activeCryptocurrencies)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Market Dominance</h3>
                <p className="stat-value">
                  BTC {formatPercentage(marketStats.btcDominance)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Cryptocurrencies */}
      <section className="top-cryptos">
        <div className="container">
          <div className="section-header">
            <h2>Top Cryptocurrencies</h2>
            <Link to="/market" className="view-all-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="crypto-card skeleton">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="crypto-grid">
              {cryptos.map((crypto) => (
                <Link 
                  key={crypto.id} 
                  to={`/crypto/${crypto.id}`}
                  className="crypto-card"
                >
                  <div className="crypto-header">
                    <div className="crypto-info">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        className="crypto-logo"
                      />
                      <div>
                        <h3 className="crypto-name">{crypto.name}</h3>
                        <p className="crypto-symbol">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="crypto-rank">#{crypto.market_cap_rank}</div>
                  </div>
                  
                  <div className="crypto-price">
                    {formatCurrency(crypto.current_price)}
                  </div>
                  
                  <div className={`crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </div>
                  
                  <div className="crypto-market-cap">
                    Market Cap: {formatCurrency(crypto.market_cap)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose CryptoEx?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Trading</h3>
              <p>Bank-level security with cold storage and 2FA protection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Advanced Tools</h3>
              <p>Professional trading tools and real-time market data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for all your needs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Ready</h3>
              <p>Trade on the go with our responsive web platform</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 4rem 0;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }
        }

        .highlight {
          color: var(--secondary-color);
        }

        .hero-description {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .crypto-animation {
          position: relative;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crypto-icon {
          position: absolute;
          font-size: 4rem;
          animation: float 3s ease-in-out infinite;
        }

        .bitcoin {
          color: #f7931a;
          animation-delay: 0s;
        }

        .ethereum {
          color: #627eea;
          animation-delay: 1s;
          top: 20%;
          right: 20%;
        }

        .altcoin {
          color: var(--secondary-color);
          animation-delay: 2s;
          bottom: 20%;
          left: 20%;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .market-stats {
          padding: 3rem 0;
          background-color: var(--bg-light);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background-color: var(--bg-card);
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .top-cryptos {
          padding: 4rem 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 700;
        }

        .view-all-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .crypto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .crypto-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .crypto-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .crypto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .crypto-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .crypto-logo {
          width: 2.5rem;
          height: 2.5rem;
        }

        .crypto-name {
          font-weight: 600;
          margin: 0;
        }

        .crypto-symbol {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.9rem;
        }

        .crypto-rank {
          background-color: var(--bg-light);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .crypto-price {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .crypto-change {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .crypto-change.positive {
          color: var(--success-color);
        }

        .crypto-change.negative {
          color: var(--error-color);
        }

        .crypto-market-cap {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .features {
          padding: 4rem 0;
          background-color: var(--bg-light);
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: var(--bg-card);
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 4rem;
          height: 4rem;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
          font-size: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .skeleton {
          background-color: var(--bg-card);
          border-radius: 8px;
          padding: 1.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-line {
          height: 1rem;
          background-color: var(--border-color);
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .skeleton-line.short {
          width: 60%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Home;
