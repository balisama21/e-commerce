import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import SellerDashboard from './pages/SellerDashboard';
import CartPage from './pages/CartPage';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <div className="min-h-screen bg-gray-50">
              <Header onAuthOpen={openAuthModal} />
              
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/dashboard" element={<SellerDashboard />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
              </main>

              <Footer />

              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                mode={authMode}
                onModeChange={setAuthMode}
              />
            </div>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;