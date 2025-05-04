import React, { useState, useEffect } from 'react';
import { FaCar, FaUser, FaGavel } from 'react-icons/fa';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 25000, status: 'Active' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2021, price: 22000, status: 'Pending' },
  ]);
  const [users, setUsers] = useState([
    { id: 1, name: 'Naveen Teja', email: 'naveen@gmail.com', role: 'Admin' },
    { id: 2, name: 'Banoth Naveen', email: 'teja@gmail.com', role: 'User' },
  ]);
  const [bids, setBids] = useState([
    { id: 1, car: 'Toyota Camry', amount: 24500, bidder: 'naveen@gmail.com', status: 'Active' },
    { id: 2, car: 'Honda Civic', amount: 21500, bidder: 'teja@gmail.com', status: 'Won' },
  ]);

  useEffect(() => {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
    if (username === "Teja" && password === "2142") {
      setIsAuthenticated(true);
    } else {
      alert("Authentication failed. Redirecting to Not Found page.");
      window.location.href = "/404";
    }
  }, []);

  const deleteItem = (collection, id) => {
    const updated = collection === 'cars' ? cars.filter(c => c.id !== id) :
                    collection === 'users' ? users.filter(u => u.id !== id) :
                    bids.filter(b => b.id !== id);
    if (collection === 'cars') setCars(updated);
    else if (collection === 'users') setUsers(updated);
    else setBids(updated);
  };

  const addItem = (collection) => {
    if (collection === 'cars') {
      const newCar = { id: Date.now(), make: 'New', model: 'Car', year: 2023, price: 20000, status: 'Pending' };
      setCars([...cars, newCar]);
    } else if (collection === 'users') {
      const newUser = { id: Date.now(), name: 'New User', email: 'new@example.com', role: 'User' };
      setUsers([...users, newUser]);
    } else if (collection === 'bids') {
      const newBid = { id: Date.now(), car: 'New Car', amount: 10000, bidder: 'new@example.com', status: 'Active' };
      setBids([...bids, newBid]);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', fontFamily: 'Inter, sans-serif', height: '100vh', backgroundColor: '#f8f9fb' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', backgroundColor: '#2c3e50', color: 'white', padding: '30px 20px' }}>
        <h2 style={{ color: '#ecf0f1', marginBottom: '40px', fontSize: '24px' }}>Admin</h2>
        {[
          { key: 'cars', icon: <FaCar />, label: 'Cars' },
          { key: 'users', icon: <FaUser />, label: 'Users' },
          { key: 'bids', icon: <FaGavel />, label: 'Bids' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              backgroundColor: activeTab === tab.key ? '#34495e' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              gap: '10px'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Admin Dashboard</h1>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {activeTab === 'cars' && (
            <>
              <PanelHeader title="Car Listings" onAdd={() => addItem('cars')} />
              <CarTable cars={cars} deleteItem={deleteItem} />
            </>
          )}
          {activeTab === 'users' && (
            <>
              <PanelHeader title="User Management" onAdd={() => addItem('users')} />
              <UserTable users={users} deleteItem={deleteItem} />
            </>
          )}
          {activeTab === 'bids' && (
            <>
              <PanelHeader title="Bid Management" onAdd={() => addItem('bids')} />
              <BidTable bids={bids} deleteItem={deleteItem} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const PanelHeader = ({ title, onAdd }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
    <h2 style={{ margin: 0, fontSize: '22px', color: '#2c3e50' }}>{title}</h2>
    <button
      onClick={onAdd}
      style={{
        padding: '10px 18px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '14px'
      }}
    >
      + Add
    </button>
  </div>
);

const CarTable = ({ cars, deleteItem }) => (
  <GenericTable
    headers={['ID', 'Image', 'Make/Model', 'Year', 'Price', 'Status', 'Actions']}
    data={cars}
    renderRow={(car) => (
      <tr key={car.id}>
        <td>{car.id}</td>
        <td><div style={{ width: '60px', height: '40px', backgroundColor: '#ccc', borderRadius: '6px' }} /></td>
        <td>{car.make} {car.model}</td>
        <td>{car.year}</td>
        <td>${car.price.toLocaleString()}</td>
        <td><StatusBadge value={car.status} /></td>
        <td><ActionButtons onDelete={() => deleteItem('cars', car.id)} /></td>
      </tr>
    )}
  />
);

const UserTable = ({ users, deleteItem }) => (
  <GenericTable
    headers={['ID', 'Name', 'Email', 'Role', 'Actions']}
    data={users}
    renderRow={(user) => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td><ActionButtons onDelete={() => deleteItem('users', user.id)} /></td>
      </tr>
    )}
  />
);

const BidTable = ({ bids, deleteItem }) => (
  <GenericTable
    headers={['ID', 'Car', 'Bid Amount', 'Bidder', 'Status', 'Actions']}
    data={bids}
    renderRow={(bid) => (
      <tr key={bid.id}>
        <td>{bid.id}</td>
        <td>{bid.car}</td>
        <td>${bid.amount.toLocaleString()}</td>
        <td>{bid.bidder}</td>
        <td><StatusBadge value={bid.status} /></td>
        <td><ActionButtons onDelete={() => deleteItem('bids', bid.id)} /></td>
      </tr>
    )}
  />
);

const GenericTable = ({ headers, data, renderRow }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ textAlign: 'left', fontSize: '13px', color: '#7f8c8d', textTransform: 'uppercase' }}>
        {headers.map((header, idx) => (
          <th key={idx} style={{ padding: '10px 12px' }}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map(renderRow)}
    </tbody>
  </table>
);

const ActionButtons = ({ onDelete }) => (
  <>
    <button style={{
      marginRight: '8px',
      padding: '6px 12px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px',
      cursor: 'pointer'
    }}>Edit</button>
    <button onClick={onDelete} style={{
      padding: '6px 12px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px',
      cursor: 'pointer'
    }}>Delete</button>
  </>
);

const StatusBadge = ({ value }) => {
  const color = value === 'Active' ? '#2ecc71' : '#f1c40f';
  return (
    <span style={{
      padding: '5px 12px',
      backgroundColor: color,
      borderRadius: '20px',
      fontSize: '12px',
      color: 'white',
      fontWeight: '500'
    }}>{value}</span>
  );
};

export default AdminPanel;
