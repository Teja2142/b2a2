import React, { useState } from 'react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 25000, status: 'Active' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2021, price: 22000, status: 'Pending' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]);

  const [bids, setBids] = useState([
    { id: 1, car: 'Toyota Camry', amount: 24500, bidder: 'john@example.com', status: 'Active' },
    { id: 2, car: 'Honda Civic', amount: 21500, bidder: 'jane@example.com', status: 'Won' },
  ]);

  const deleteItem = (collection, id) => {
    const updated = collection === 'cars' ? cars.filter(c => c.id !== id) :
                   collection === 'users' ? users.filter(u => u.id !== id) :
                   bids.filter(b => b.id !== id);
    
    if(collection === 'cars') setCars(updated);
    else if(collection === 'users') setUsers(updated);
    else setBids(updated);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f6fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#2c3e50',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab('cars')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'cars' ? '#3498db' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
            Cars
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'users' ? '#3498db' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
            Users
          </button>
          <button 
            onClick={() => setActiveTab('bids')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'bids' ? '#3498db' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
            Bids
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '20px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        {/* Cars Management */}
        {activeTab === 'cars' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Car Listings</h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Add New Car
              </button>
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
                  <tr key={car.id} style={{ borderBottom: '1px solid #eee', '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <td style={{ padding: '12px' }}>{car.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{
                        width: '80px',
                        height: '60px',
                        backgroundColor: '#ddd',
                        borderRadius: '4px'
                      }}></div>
                    </td>
                    <td style={{ padding: '12px' }}>{car.make} {car.model}</td>
                    <td style={{ padding: '12px' }}>{car.year}</td>
                    <td style={{ padding: '12px' }}>${car.price.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: car.status === 'Active' ? '#2ecc71' : '#f1c40f',
                        color: 'white',
                        fontSize: '0.8em'
                      }}>
                        {car.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem('cars', car.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                        Delete
                      </button>
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
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Add New User
              </button>
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
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{user.role}</td>
                    <td style={{ padding: '12px' }}>
                      <button style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem('users', user.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                        Delete
                      </button>
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
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Add New Bid
              </button>
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
                    <td style={{ padding: '12px' }}>{bid.car}</td>
                    <td style={{ padding: '12px' }}>${bid.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{bid.bidder}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: bid.status === 'Active' ? '#2ecc71' : '#3498db',
                        color: 'white',
                        fontSize: '0.8em'
                      }}>
                        {bid.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem('bids', bid.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                        Delete
                      </button>
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