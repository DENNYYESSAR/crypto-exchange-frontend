import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCryptos, buyCrypto, sellCrypto } from '../../services/cryptoService';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';

const QuickTrade = () => {
  const { token } = useAuth();
  const [tradeType, setTradeType] = useState('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cryptoPrice, setCryptoPrice] = useState(0);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await getAllCryptos(1, 10);
        setCryptos(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedCrypto(data.data[0].id);
          setCryptoPrice(data.data[0].current_price);
        }
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    if (selectedCrypto && cryptos.length > 0) {
      const crypto = cryptos.find(c => c.id === selectedCrypto);
      if (crypto) {
        setCryptoPrice(crypto.current_price);
      }
    }
  }, [selectedCrypto, cryptos]);

  const calculateTotal = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount * cryptoPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrypto || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const tradeData = {
        cryptoId: selectedCrypto,
        amount: parseFloat(amount),
        type: tradeType,
      };

      if (tradeType === 'buy') {
        await buyCrypto(token, tradeData);
        toast.success('Buy order placed successfully!');
      } else {
        await sellCrypto(token, tradeData);
        toast.success('Sell order placed successfully!');
      }

      setAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedCryptoData = cryptos.find(c => c.id === selectedCrypto);

  return (
    <div className="quick-trade">
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

      <form onSubmit={handleSubmit} className="trade-form">
        <div className="form-group">
          <label>Cryptocurrency</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="form-control"
            required
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {selectedCryptoData && (
          <div className="crypto-info">
            <div className="crypto-price">
              <span>Current Price: </span>
              <strong>{formatCurrency(cryptoPrice)}</strong>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Amount ({selectedCryptoData?.symbol.toUpperCase()})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            placeholder="0.00"
            step="0.00000001"
            min="0"
            required
          />
        </div>

        <div className="trade-summary">
          <div className="summary-row">
            <span>Total:</span>
            <strong>{formatCurrency(calculateTotal())}</strong>
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn-full ${tradeType === 'buy' ? 'btn-primary' : 'btn-secondary'}`}
          disabled={loading || !selectedCrypto || !amount}
        >
          {loading ? (
            <>
              <div className="spinner-small"></div>
              Processing...
            </>
          ) : (
            `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCryptoData?.symbol.toUpperCase() || ''}`
          )}
        </button>
      </form>

      <style jsx>{`
        .quick-trade {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trade-tabs {
          display: flex;
          border-radius: 8px;
          background-color: var(--bg-light);
          padding: 0.25rem;
        }

        .trade-tab {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
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
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .form-control {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .crypto-info {
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: 6px;
          margin: -0.5rem 0;
        }

        .crypto-price {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .crypto-price strong {
          color: var(--text-primary);
        }

        .trade-summary {
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .summary-row strong {
          color: var(--text-primary);
          font-size: 1rem;
        }

        .btn-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
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

        .spinner-small {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default QuickTrade;
