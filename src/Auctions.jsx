import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Card component to display a vehicle in an auction
const VehicleAuctionCard = ({ auction, vehicle, onBidClick }) => {
  // Defensive check in case vehicle data is not yet available
  if (!vehicle) {
    return (
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  // Formatting for dates and currency
  const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'TBA';

  return (
    <div style={styles.card}>
      <img src={vehicle.image_url || 'https://placehold.co/600x400?text=No+Image'} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} style={styles.image} />
      <div style={styles.cardContent}>
        <h3 style={styles.title}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p style={styles.details}>
          <strong>Starting Price:</strong> {formatCurrency(auction.starting_price)}
        </p>
        <p style={styles.details}>
          <strong>Highest Bid:</strong> {formatCurrency(auction.highest_bid)}
        </p>
         <p style={{...styles.details, fontSize: '0.8rem', color: '#718096'}}>
          <strong>Auction Ends:</strong> {formatDate(auction.end_time)}
        </p>
        <button 
          style={styles.bidButton} 
          onClick={() => onBidClick(auction.id)} // Pass auction ID to the handler
        >
          Bid Now
        </button>
      </div>
    </div>
  );
};

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [vehicles, setVehicles] = useState({}); // Use an object for quick lookups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctionData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Step 1: Fetch all auctions ---
        const auctionsResponse = await fetch("https://api.b2a2cars.com/api/auction/auctions/");
        if (!auctionsResponse.ok) {
          throw new Error('Failed to fetch auctions');
        }
        const auctionsData = await auctionsResponse.json();
        
        // --- Step 2: Filter for currently live auctions ---
        const now = new Date();
        const liveAuctions = auctionsData.filter(auction => {
            const startTime = new Date(auction.start_time);
            const endTime = new Date(auction.end_time);
            return now >= startTime && now <= endTime;
        });
        setAuctions(liveAuctions);

        // --- Step 3: Fetch all vehicles ---
        const vehiclesResponse = await fetch("https://api.b2a2cars.com/api/vehicles/vehicles/");
        if (!vehiclesResponse.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const vehiclesData = await vehiclesResponse.json();
        
        // --- Step 4: Map vehicles by ID for easy lookup ---
        const vehiclesMap = vehiclesData.reduce((acc, vehicle) => {
          acc[vehicle.id] = vehicle;
          return acc;
        }, {});
        setVehicles(vehiclesMap);

      } catch (err) {
        console.error("Error fetching auction data:", err);
        setError("Failed to load auction data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, []);

  const handleBidClick = (auctionId) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (auction && auction.vehicle) {
        // Navigate to the bidding page with both IDs
        navigate(`/Bidding/${auctionId}/${auction.vehicle}`);
    } else {
        console.error("Could not find auction or vehicle to navigate.");
        // Optionally, show an error to the user
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p style={styles.message}>Loading Auctions...</p>;
    }
    if (error) {
      return <p style={{ ...styles.message, color: '#e53e3e' }}>{error}</p>;
    }
    if (auctions.length === 0) {
      return <p style={styles.message}>There are no live auctions available at this time.</p>;
    }
    return (
      <div style={styles.grid}>
        {auctions.map((auction) => (
          <VehicleAuctionCard 
            key={auction.id} 
            auction={auction}
            vehicle={vehicles[auction.vehicle]} // Find the vehicle details from the map
            onBidClick={handleBidClick} 
          />
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Live Auctions</h1>
      <p style={styles.subHeader}>Browse available vehicles and place your bid</p>
      {renderContent()}
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  header: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '0.5rem',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '3rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '1.5rem',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  details: {
    fontSize: '0.9rem',
    color: '#4a5568',
    marginBottom: '0.75rem',
  },
  bidButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    marginTop: 'auto',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4a5568',
    padding: '3rem',
  },
};

export default Auctions;
