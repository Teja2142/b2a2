import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        switch(activeTab) {
          case 'cars':
            const carsRes = await axios.get('/api/cars/');
            setCars(carsRes.data);
            break;
          case 'users':
            const usersRes = await axios.get('/api/users/');
            setUsers(usersRes.data);
            break;
          case 'bids':
            const bidsRes = await axios.get('/api/bids/');
            setBids(bidsRes.data);
            break;
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const deleteItem = async (collection, id) => {
    try {
      await axios.delete(`/api/${collection}/${id}/`);
      // Refresh data after deletion
      switch(collection) {
        case 'cars':
          const carsRes = await axios.get('/api/cars/');
          setCars(carsRes.data);
          break;
        case 'users':
          const usersRes = await axios.get('/api/users/');
          setUsers(usersRes.data);
          break;
        case 'bids':
          const bidsRes = await axios.get('/api/bids/');
          setBids(bidsRes.data);
          break;
      }
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f6fa'
      }}>
        <div style={{ fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f6fa',
      minHeight: '100vh'
    }}>
      {/* Error message */}
      {error && (
        <div style={{ 
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#ffe3e6',
          color: '#ff0000',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {/* Rest of the component remains the same until the table rendering */}
      
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
                <tr key={car.id} style={{ borderBottom: '1px solid #eee' }}>
                  {/* Keep existing car table structure */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Management - Keep existing structure */}
      {/* Bids Management - Keep existing structure */}

    </div>
  );
};

export default AdminPanel;