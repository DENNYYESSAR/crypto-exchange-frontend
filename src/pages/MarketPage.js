import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCryptos, searchCryptos } from '../services/cryptoService';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters';

const MarketPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCryptos();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        fetchCryptos();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const data = await getAllCryptos(currentPage, itemsPerPage);
      setCryptos(data.data || []);
      setTotalPages(Math.ceil((data.total || 100) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching cryptos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchCryptos(searchTerm);
      setCryptos(data || []);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching cryptos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedCryptos = [...cryptos].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="market-page">
      <div className="container">
        <div className="market-header">
          <div>
            <h1>Cryptocurrency Market</h1>
            <p>Track prices, market cap, and trading volume of all cryptocurrencies</p>
          </div>
        </div>

        <div className="market-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="market-stats">
            <div className="stat-item">
              <span className="stat-label">Market Cap</span>
              <span className="stat-value">$2.1T</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">24h Volume</span>
              <span className="stat-value">$95.2B</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">BTC Dominance</span>
              <span className="stat-value">42.1%</span>
            </div>
          </div>
        </div>

        <div className="market-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading market data...</p>
            </div>
          ) : (
            <>
              <table className="market-table">
                <thead>
                  <tr>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('market_cap_rank')}
                    >
                      #
                      {sortBy === 'market_cap_rank' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortBy === 'name' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className="sortable price-col"
                      onClick={() => handleSort('current_price')}
                    >
                      Price
                      {sortBy === 'current_price' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('price_change_percentage_24h')}
                    >
                      24h %
                      {sortBy === 'price_change_percentage_24h' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('market_cap')}
                    >
                      Market Cap
                      {sortBy === 'market_cap' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('total_volume')}
                    >
                      Volume (24h)
                      {sortBy === 'total_volume' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCryptos.map((crypto) => (
                    <tr key={crypto.id} className="crypto-row">
                      <td className="rank-col">{crypto.market_cap_rank}</td>
                      <td className="name-col">
                        <Link to={`/crypto/${crypto.id}`} className="crypto-link">
                          <img 
                            src={crypto.image} 
                            alt={crypto.name}
                            className="crypto-logo"
                          />
                          <div className="crypto-info">
                            <span className="crypto-name">{crypto.name}</span>
                            <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="price-col">
                        {formatCurrency(crypto.current_price)}
                      </td>
                      <td className={`change-col ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </td>
                      <td className="market-cap-col">
                        {formatCurrency(crypto.market_cap)}
                      </td>
                      <td className="volume-col">
                        {formatCurrency(crypto.total_volume)}
                      </td>
                      <td className="action-col">
                        <Link 
                          to={`/crypto/${crypto.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .market-page {
          padding: 2rem 0;
        }

        .market-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .market-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .market-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .market-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .market-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          background-color: var(--bg-card);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .market-stats {
          display: flex;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .market-stats {
            justify-content: space-between;
            gap: 1rem;
          }
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .market-table-container {
          background-color: var(--bg-card);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
        }

        .market-table {
          width: 100%;
          border-collapse: collapse;
        }

        .market-table th {
          background-color: var(--bg-light);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .market-table th.sortable {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
        }

        .market-table th.sortable:hover {
          background-color: var(--border-color);
        }

        .market-table th i {
          margin-left: 0.5rem;
          color: var(--primary-color);
        }

        .market-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .crypto-row {
          transition: background-color 0.2s;
        }

        .crypto-row:hover {
          background-color: var(--bg-light);
        }

        .rank-col {
          width: 60px;
          text-align: center;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .name-col {
          min-width: 200px;
        }

        .crypto-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }

        .crypto-logo {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }

        .crypto-info {
          display: flex;
          flex-direction: column;
        }

        .crypto-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .crypto-symbol {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .price-col {
          font-weight: 600;
          font-size: 1rem;
          min-width: 100px;
        }

        .change-col {
          font-weight: 600;
          min-width: 80px;
        }

        .change-col.positive {
          color: var(--success-color);
        }

        .change-col.negative {
          color: var(--error-color);
        }

        .market-cap-col,
        .volume-col {
          font-weight: 500;
          min-width: 120px;
        }

        .action-col {
          width: 100px;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border-radius: 6px;
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

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .market-table-container {
            overflow-x: auto;
          }

          .market-table {
            min-width: 800px;
          }

          .market-header h1 {
            font-size: 2rem;
          }

          .crypto-name {
            font-size: 0.9rem;
          }

          .crypto-symbol {
            font-size: 0.75rem;
          }

          .market-table th,
          .market-table td {
            padding: 0.75rem 0.5rem;
          }

          .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .market-controls {
            gap: 1rem;
          }

          .market-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .pagination {
            padding: 1rem;
          }

          .pagination-btn {
            width: 2rem;
            height: 2rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MarketPage;
