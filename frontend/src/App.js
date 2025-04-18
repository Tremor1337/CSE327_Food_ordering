import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Ensure this line exists

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className="navbar-left">🍽️ Food Ordering System</div>
        <div className="navbar-right">
          <Link to="/">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery-dashboard"
            element={
              <ProtectedRoute allowedRole="delivery">
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
