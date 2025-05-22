import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWalletBalance, depositFunds, withdrawFunds } from '../services/transactionService';
import { formatCurrency, formatCryptoAmount } from '../utils/formatters';
import { toast } from 'react-toastify';

const WalletPage = () => {
  const { token } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchWalletBalance();
  }, [token]);

  const fetchWalletBalance = async () => {
    try {
      const data = await getWalletBalance(token);
      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to load wallet balance');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = (asset) => {
    setSelectedAsset(asset);
    setShowDepositModal(true);
  };

  const handleWithdraw = (asset) => {
    setSelectedAsset(asset);
    setShowWithdrawModal(true);
  };

  if (loading) {
    return (
      <div className="wallet-loading">
        <div className="spinner"></div>
        <p>Loading wallet...</p>
      </div>
    );
  }

  const totalBalance = wallet?.totalValue || 0;

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <div>
          <h1>My Wallet</h1>
          <p>Manage your cryptocurrency and fiat balances</p>
        </div>
        <div className="wallet-actions">
          <button 
            className="btn btn-outline"
            onClick={() => handleDeposit({ symbol: 'USD', name: 'US Dollar', type: 'fiat' })}
          >
            <i className="fas fa-plus"></i>
            Deposit
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleWithdraw({ symbol: 'USD', name: 'US Dollar', type: 'fiat' })}
          >
            <i className="fas fa-minus"></i>
            Withdraw
          </button>
        </div>
      </div>

      <div className="wallet-overview">
        <div className="balance-card">
          <div className="balance-header">
            <h2>Total Balance</h2>
            <div className="balance-actions">
              <button className="balance-action">
                <i className="fas fa-eye"></i>
              </button>
              <button className="balance-action">
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
          <div className="total-balance">
            {formatCurrency(totalBalance)}
          </div>
          <div className="balance-change">
            <span className="change-positive">+2.34%</span>
            <span className="change-period">24h</span>
          </div>
        </div>
      </div>

      <div className="wallet-assets">
        <div className="assets-header">
          <h2>Your Assets</h2>
          <div className="view-toggle">
            <button className="toggle-btn active">List</button>
            <button className="toggle-btn">Grid</button>
          </div>
        </div>

        <div className="assets-list">
          {/* Fiat Balance */}
          <div className="asset-item">
            <div className="asset-info">
              <div className="asset-icon fiat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="asset-details">
                <h3>US Dollar</h3>
                <p>USD</p>
              </div>
            </div>
            <div className="asset-balance">
              <div className="balance-amount">
                {formatCurrency(wallet?.usd || 0)}
              </div>
              <div className="balance-usd">
                Available
              </div>
            </div>
            <div className="asset-actions">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => handleDeposit({ symbol: 'USD', name: 'US Dollar', type: 'fiat' })}
              >
                Deposit
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => handleWithdraw({ symbol: 'USD', name: 'US Dollar', type: 'fiat' })}
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Crypto Balances */}
          {wallet?.cryptos?.map((crypto) => (
            <div key={crypto.symbol} className="asset-item">
              <div className="asset-info">
                <div className="asset-icon">
                  <img src={crypto.image} alt={crypto.name} />
                </div>
                <div className="asset-details">
                  <h3>{crypto.name}</h3>
                  <p>{crypto.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className="asset-balance">
                <div className="balance-amount">
                  {formatCryptoAmount(crypto.amount, crypto.symbol.toUpperCase(), 6)}
                </div>
                <div className="balance-usd">
                  {formatCurrency(crypto.value)}
                </div>
              </div>
              <div className="asset-actions">
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => handleDeposit(crypto)}
                >
                  Deposit
                </button>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => handleWithdraw(crypto)}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}

          {(!wallet?.cryptos || wallet.cryptos.length === 0) && (
            <div className="empty-state">
              <i className="fas fa-wallet"></i>
              <h3>No cryptocurrency holdings</h3>
              <p>Start trading to see your crypto balances here</p>
              <button className="btn btn-primary">
                Start Trading
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal
          asset={selectedAsset}
          onClose={() => setShowDepositModal(false)}
          onSuccess={() => {
            fetchWalletBalance();
            setShowDepositModal(false);
          }}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          asset={selectedAsset}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            fetchWalletBalance();
            setShowWithdrawModal(false);
          }}
        />
      )}

      <style jsx>{`
        .wallet-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .wallet-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .wallet-header p {
          color: var(--text-secondary);
        }

        .wallet-actions {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .wallet-overview {
          margin-bottom: 2rem;
        }

        .balance-card {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .balance-header h2 {
          font-size: 1.1rem;
          font-weight: 500;
          opacity: 0.9;
          margin: 0;
        }

        .balance-actions {
          display: flex;
          gap: 0.5rem;
        }

        .balance-action {
          width: 2rem;
          height: 2rem;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .balance-action:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .total-balance {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .balance-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .change-positive {
          color: var(--secondary-color);
          font-weight: 600;
        }

        .change-period {
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .wallet-assets {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .assets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .assets-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .view-toggle {
          display: flex;
          background-color: var(--bg-light);
          border-radius: 6px;
          padding: 0.25rem;
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background-color: var(--bg-card);
          color: var(--primary-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .assets-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .asset-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background-color: var(--bg-light);
          border-radius: 12px;
          transition: background-color 0.2s;
        }

        .asset-item:hover {
          background-color: var(--border-color);
        }

        .asset-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .asset-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .asset-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fiat-icon {
          background-color: var(--secondary-color);
          color: white;
          font-size: 1.2rem;
        }

        .asset-details h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .asset-details p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.9rem;
        }

        .asset-balance {
          text-align: right;
          margin-right: 2rem;
        }

        .balance-amount {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .balance-usd {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .asset-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
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

        .wallet-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .wallet-loading .spinner {
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .wallet-header {
            flex-direction: column;
            gap: 1rem;
          }

          .wallet-actions {
            width: 100%;
          }

          .wallet-actions .btn {
            flex: 1;
          }

          .total-balance {
            font-size: 2rem;
          }

          .asset-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            text-align: center;
          }

          .asset-balance {
            margin-right: 0;
            text-align: center;
          }

          .asset-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Deposit Modal Component
const DepositModal = ({ asset, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      await depositFunds(token, {
        amount: parseFloat(amount),
        currency: asset.symbol,
        type: asset.type || 'crypto'
      });
      toast.success('Deposit initiated successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Deposit {asset.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Amount ({asset.symbol.toUpperCase()})</label>
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
          
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Withdraw Modal Component
const WithdrawModal = ({ asset, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      await withdrawFunds(token, {
        amount: parseFloat(amount),
        currency: asset.symbol,
        address: address,
        type: asset.type || 'crypto'
      });
      toast.success('Withdrawal initiated successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Withdraw {asset.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Amount ({asset.symbol.toUpperCase()})</label>
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

          {asset.type !== 'fiat' && (
            <div className="form-group">
              <label>Withdrawal Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                placeholder="Enter wallet address"
                required
              />
            </div>
          )}
          
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background-color: var(--bg-card);
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .modal-close {
          width: 2rem;
          height: 2rem;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background-color: var(--bg-light);
        }

        .modal-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .modal-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default WalletPage;
