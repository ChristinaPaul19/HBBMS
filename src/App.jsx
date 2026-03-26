import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import { Droplets, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Droplets color="#DC143C" />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>HBBMS</span>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Role: <b style={{ color: 'var(--text-color)' }}>{user.role}</b></span>
        <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.4rem 0.8rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  switch (user.role) {
    case 'Admin': return <AdminDashboard />;
    case 'Donor': return <DonorDashboard />;
    case 'Patient': return <PatientDashboard />;
    default: return <Navigate to="/" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
