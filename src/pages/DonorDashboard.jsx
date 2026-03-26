import React, { useState, useEffect } from 'react';
import { DataService, BLOOD_GROUPS } from '../utils/DataService';
import { useAuth } from '../context/AuthContext';
import { Heart, PlusCircle, History } from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newDonation, setNewDonation] = useState({
    volume: '500ml',
    bloodType: 'O+',
    date: new Date().toISOString().split('T')[0]
  });

  const [eligibility, setEligibility] = useState({ eligible: true });

  useEffect(() => {
    const donorDonations = DataService.getDonations().filter(d => d.donorId === 'd1');
    setDonations(donorDonations);
    setEligibility(DataService.isEligibleToDonate('d1'));
  }, []);

  const handleDonate = (e) => {
    e.preventDefault();
    const donation = {
      ...newDonation,
      unitId: `U-${Math.floor(Math.random() * 1000)}`,
      donationId: `DN-${Math.floor(Math.random() * 1000)}`,
      donorId: 'd1',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibilityFlag: true
    };
    DataService.addDonation(donation);
    setDonations([...donations, donation]);
    setShowForm(false);
    alert('Thank you for your life-saving donation!');
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text">Welcome, Life Saver</h1>
          <p style={{ color: 'var(--text-dim)' }}>Ready to make a difference today?</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={!showForm && !eligibility.eligible}
          style={{ opacity: (!showForm && !eligibility.eligible) ? 0.5 : 1, cursor: (!showForm && !eligibility.eligible) ? 'not-allowed' : 'pointer' }}
        >
          <PlusCircle size={20} /> {showForm ? 'View History' : 'New Donation'}
        </button>
      </header>

      {!eligibility.eligible && !showForm && (
        <div className="glass animate-fade-in" style={{ padding: '1rem', marginBottom: '2rem', border: '1px solid var(--warning)', backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>
            Next Eligibility: In {eligibility.remainingDays} days 
            (Last donation: {eligibility.lastDate})
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>To ensure your health, a 3-month gap is required between blood donations.</p>
        </div>
      )}

      {showForm ? (
        <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2>Record Donation</h2>
          <form onSubmit={handleDonate}>
            <div className="form-group">
              <label>Blood Group</label>
              <select 
                value={newDonation.bloodType} 
                onChange={e => setNewDonation({...newDonation, bloodType: e.target.value})}
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Volume (Units/ml)</label>
              <input 
                type="text" 
                value={newDonation.volume} 
                onChange={e => setNewDonation({...newDonation, volume: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Donation Date</label>
              <input 
                type="date" 
                value={newDonation.date} 
                onChange={e => setNewDonation({...newDonation, date: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm Donation
            </button>
          </form>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="glass" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <History color="#DC143C" />
              <h3>Your Donation History</h3>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Volume</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.unitId}>
                      <td>{d.date}</td>
                      <td style={{ fontWeight: 'bold' }}>{d.bloodType}</td>
                      <td>{d.volume}</td>
                      <td><span style={{ color: 'var(--success)' }}>Completed</span></td>
                    </tr>
                  ))}
                  {donations.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No donations recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="glass" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={60} color="#DC143C" style={{ marginBottom: '1.5rem' }} />
            <h3>Level: Hero</h3>
            <p style={{ color: 'var(--text-dim)' }}>You've saved roughly {donations.length * 3} lives!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
