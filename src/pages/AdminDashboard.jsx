import React, { useState, useEffect } from 'react';
import { DataService } from '../utils/DataService';
import { Database, ClipboardList, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setInventory(DataService.getInventory());
    setRequests(DataService.getRequests());
  }, []);

  return (
    <div className="container animate-fade-in">
      <header style={{ padding: '2rem 0' }}>
        <h1 className="gradient-text">Admin Command Center</h1>
        <p style={{ color: 'var(--text-dim)' }}>System-wide blood bank overview</p>
      </header>

      <div className="dashboard-grid">
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Database color="#DC143C" />
            <h3>Blood Inventory</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Unit ID</th>
                  <th>Group</th>
                  <th>Volume</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.unitId}>
                    <td>{item.unitId}</td>
                    <td><span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{item.bloodType}</span></td>
                    <td>{item.volume}</td>
                    <td>{item.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <ClipboardList color="#DC143C" />
            <h3>Active Requests</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Group</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.patientId}</td>
                    <td>{req.bloodType}</td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: req.status === 'Desired' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                        color: req.status === 'Desired' ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <TrendingUp size={40} color="#4CAF50" style={{ marginBottom: '1rem' }} />
          <h2>85%</h2>
          <p style={{ color: 'var(--text-dim)' }}>Stock Sufficiency</p>
        </div>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <Users size={40} color="#1976D2" style={{ marginBottom: '1rem' }} />
          <h2>1,240</h2>
          <p style={{ color: 'var(--text-dim)' }}>Registered Donors</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
