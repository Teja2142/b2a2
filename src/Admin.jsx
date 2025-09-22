import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [notAdmin, setNotAdmin] = useState(false);

  useEffect(() => {
    // Strong admin authentication check
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin' || user.email !== 'admin@gmail.com') {
      setNotAdmin(true);
      return;
    }
    // Fetch cars
    fetch('https://api.b2a2cars.com/api/auction/vehicles/')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(() => setCars([]));
    // Fetch users
    fetch('http://127.0.0.1:8000/api/users/')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
    // Fetch bids
    fetch('http://127.0.0.1:8000/api/auction/bids/')
      .then(res => res.json())
      .then(data => setBids(data))
      .catch(() => setBids([]));
  }, []);

  const deleteItem = (collection, id) => {
    if (collection === 'cars') setCars(cars.filter(c => c.id !== id));
    else if (collection === 'users') setUsers(users.filter(u => u.id !== id));
    else setBids(bids.filter(b => b.id !== id));
  };

  if (notAdmin) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', backgroundColor: '#2c3e50', borderRadius: '8px', color: 'white' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setActiveTab('cars')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'cars' ? '#3498db' : '#2c3e50', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease' }}>Cars</button>
          <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'users' ? '#3498db' : '#2c3e50', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease' }}>Users</button>
          <button onClick={() => setActiveTab('bids')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'bids' ? '#3498db' : '#2c3e50', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease' }}>Bids</button>
        </div>
      </div>
      {/* Content Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.1)' }}>
        {/* Cars Management */}
        {activeTab === 'cars' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Car Listings</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Make/Model</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{car.id}</td>
                    <td style={{ padding: '12px' }}>
                      {car.images && car.images.length > 0 ? (
                        <img src={car.images[0].image} alt={car.make} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '80px', height: '60px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>{car.make} {car.model}</td>
                    <td style={{ padding: '12px' }}>{car.year}</td>
                    <td style={{ padding: '12px' }}>${car.max_price || car.price || '-'}</td>
                    <td style={{ padding: '12px' }}>{car.available !== undefined ? (car.available ? 'Available' : 'Sold') : (car.status || '-')}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem('cars', car.id)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Users Management */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>User Management</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px' }}>{user.name || user.full_name || '-'}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{user.role || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem('users', user.id)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Bids Management */}
        {activeTab === 'bids' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Bid Management</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Car</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Bid Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Bidder</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => (
                  <tr key={bid.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{bid.id}</td>
                    <td style={{ padding: '12px' }}>{bid.car || (bid.auction && bid.auction.vehicle ? `${bid.auction.vehicle.make} ${bid.auction.vehicle.model}` : '-')}</td>
                    <td style={{ padding: '12px' }}>${bid.amount || bid.bid_amount || '-'}</td>
                    <td style={{ padding: '12px' }}>{bid.bidder || (bid.user && bid.user.email) || '-'}</td>
                    <td style={{ padding: '12px' }}>{bid.status || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem('bids', bid.id)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;