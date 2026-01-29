import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Dashboard from './pages/Dashboard';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Styles
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
