import React, { useState, useEffect } from 'react';
import { DataService, BLOOD_GROUPS } from '../utils/DataService';
import { useAuth } from '../context/AuthContext';
import { Activity, Send, Clock, FileText } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bloodType: 'A+',
    volume: '1 Unit',
    reason: '',
    department: 'General',
    requester: 'Dr. Smith'
  });

  useEffect(() => {
    setRequests(DataService.getRequests().filter(r => r.patientId === 'p1')); // Demo filter
  }, []);

  const handleRequest = (e) => {
    e.preventDefault();
    DataService.addRequest({ ...newRequest, patientId: 'p1' });
    setRequests(DataService.getRequests().filter(r => r.patientId === 'p1'));
    setShowRequestForm(false);
    alert('Blood request submitted successfully.');
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text">Patient Portal</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your blood requests and medical records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRequestForm(!showRequestForm)}>
          <Send size={20} /> {showRequestForm ? 'View Status' : 'Request Blood'}
        </button>
      </header>

      {showRequestForm ? (
        <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2>Submit Blood Request</h2>
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label>Required Blood Type</label>
              <select 
                value={newRequest.bloodType} 
                onChange={e => setNewRequest({...newRequest, bloodType: e.target.value})}
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Volume Required</label>
              <input 
                type="text" 
                placeholder="e.g. 2 Units"
                value={newRequest.volume} 
                onChange={e => setNewRequest({...newRequest, volume: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Reason / Diagnosis</label>
              <textarea 
                placeholder="Brief reason for request"
                value={newRequest.reason} 
                onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
                required
                style={{ resize: 'none', height: '100px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Submit Request
            </button>
          </form>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Clock color="#DC143C" />
              <h3>Request Status</h3>
            </div>
            {requests.map(req => (
              <div key={req.id} className="glass" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{req.bloodType}</span>
                  <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>{req.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{req.reason}</p>
              </div>
            ))}
            {requests.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No active requests.</p>}
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <FileText color="#DC143C" />
              <h3>Medical History</h3>
            </div>
            <div className="glass" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ fontWeight: 'bold' }}>Last Visit: 2026-03-10</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Diagnosis: Iron Deficiency Anemia</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Treatment: Iron supplements, monitoring.</p>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>View Full History</button>
          </div>

          <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Activity size={50} color="#4CAF50" style={{ marginBottom: '1rem' }} />
            <h3>Health Score</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>Good</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Steady vital signs recorded during last donation cycle.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
