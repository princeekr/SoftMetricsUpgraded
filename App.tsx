import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnnuityFactorPage from './pages/AnnuityFactorPage';
import NpvPage from './pages/NpvPage';
import CocomoPage from './pages/CocomoPage';
import BrainBitesPage from './pages/BrainBitesPage';
import ProtectedRoute from './components/ProtectedRoute';
import ServicesPage from './pages/ServicesPage';
import Footer from './components/Footer';
import ConceptifyPage from './pages/ConceptifyPage';
import InflationCalculatorPage from './pages/InflationCalculatorPage';
import IncomeTaxPage from './pages/IncomeTaxPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500">
      {!isAuthPage && <Header />}
      <main className={`flex-grow py-8 px-4 sm:px-6 lg:px-8 ${!isAuthPage ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="/annuity" element={<ProtectedRoute><AnnuityFactorPage /></ProtectedRoute>} />
          <Route path="/npv" element={<ProtectedRoute><NpvPage /></ProtectedRoute>} />
          <Route path="/cocomo" element={<ProtectedRoute><CocomoPage /></ProtectedRoute>} />
          <Route path="/inflation" element={<ProtectedRoute><InflationCalculatorPage /></ProtectedRoute>} />
          <Route path="/income-tax" element={<ProtectedRoute><IncomeTaxPage /></ProtectedRoute>} />
          <Route path="/brain-bites" element={<ProtectedRoute><BrainBitesPage /></ProtectedRoute>} />
          <Route path="/conceptify" element={<ProtectedRoute><ConceptifyPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;