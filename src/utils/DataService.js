/**
 * Data structures and Mock Data based on the ER Diagram
 */

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const ROLES = ['Admin', 'Donor', 'Patient', 'Hospital'];

export const MOCK_USERS = [
  { id: 'u1', email: 'admin@hbbms.com', password: 'password', role: 'Admin' },
  { id: 'u2', email: 'donor@gmail.com', password: 'password', role: 'Donor' },
  { id: 'u3', email: 'patient@gmail.com', password: 'password', role: 'Patient' },
];

export const MOCK_DONORS = [
  {
    id: 'd1',
    userId: 'u2',
    name: 'John Doe',
    age: 28,
    address: '123 Blood St, NY',
    phone: '555-0123',
    bloodGroup: 'O+',
    gender: 'Male',
    status: 'Eligible'
  }
];

export const MOCK_PATIENTS = [
  {
    id: 'p1',
    userId: 'u3',
    name: 'Jane Smith',
    address: '456 Care Ave, CA',
    age: 32,
    bloodType: 'A+',
    details: 'Chronic anemia'
  }
];

export const MOCK_INVENTORY = [
  { unitId: 'u-101', donationId: 'dn-001', volume: '500ml', bloodType: 'O+', expiryDate: '2026-05-20', eligibilityFlag: true },
  { unitId: 'u-102', donationId: 'dn-002', volume: '450ml', bloodType: 'A+', expiryDate: '2026-04-15', eligibilityFlag: true },
  { unitId: 'u-103', donationId: 'dn-003', volume: '500ml', bloodType: 'B-', expiryDate: '2026-06-10', eligibilityFlag: true },
];

export const MOCK_DONATIONS = [
  { unitId: 'u-101', donationId: 'dn-001', donorId: 'd1', date: '2026-03-20', volume: '500ml', expiryDate: '2026-05-20', eligibilityFlag: true }
];

export const MOCK_REQUESTS = [
  { id: 'r1', patientId: 'p1', bloodType: 'A+', volume: '1 Unit', reason: 'Surgery', department: 'Surgical', requester: 'Dr. House', status: 'Desired' }
];

// Service functions
export const DataService = {
  getInventory: () => JSON.parse(localStorage.getItem('hbbms_inventory')) || MOCK_INVENTORY,
  getDonations: () => JSON.parse(localStorage.getItem('hbbms_donations')) || MOCK_DONATIONS,
  getRequests: () => JSON.parse(localStorage.getItem('hbbms_requests')) || MOCK_REQUESTS,
  getDonors: () => JSON.parse(localStorage.getItem('hbbms_donors')) || MOCK_DONORS,
  getPatients: () => JSON.parse(localStorage.getItem('hbbms_patients')) || MOCK_PATIENTS,

  addDonation: (donation) => {
    const donations = DataService.getDonations();
    donations.push(donation);
    localStorage.setItem('hbbms_donations', JSON.stringify(donations));
    
    // Also add to inventory
    const inventory = DataService.getInventory();
    inventory.push({
      unitId: donation.unitId,
      donationId: donation.donationId,
      volume: donation.volume,
      bloodType: donation.bloodType,
      expiryDate: donation.expiryDate,
      eligibilityFlag: true
    });
    localStorage.setItem('hbbms_inventory', JSON.stringify(inventory));
  },

  addRequest: (request) => {
    const requests = DataService.getRequests();
    requests.push({ ...request, id: `r${Date.now()}`, status: 'Desired' });
    localStorage.setItem('hbbms_requests', JSON.stringify(requests));
  },

  isEligibleToDonate: (donorId) => {
    const donations = DataService.getDonations().filter(d => d.donorId === donorId);
    if (donations.length === 0) return { eligible: true };

    // Sort by date descending
    const lastDonation = donations.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const lastDate = new Date(lastDonation.date);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const remainingDays = 90 - diffDays;
    
    return {
      eligible: diffDays >= 90,
      remainingDays: remainingDays > 0 ? remainingDays : 0,
      lastDate: lastDonation.date
    };
  }
};
