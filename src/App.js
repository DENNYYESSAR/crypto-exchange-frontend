import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CryptoDetail from './pages/CryptoDetail';
import MarketPage from './pages/MarketPage';
import WalletPage from './pages/WalletPage';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Routing Components
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Context
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/wallet" element={
            <PrivateRoute>
              <MainLayout>
                <WalletPage />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/transactions" element={
            <PrivateRoute>
              <MainLayout>
                <TransactionHistory />
              </MainLayout>
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </AdminRoute>
          } />
          
          {/* 404 and Redirects */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
