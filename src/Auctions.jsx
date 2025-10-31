import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// --- Configuration and Utilities ---
const BASE_API_URL = 'https://api.b2a2cars.com';
const VEHICLES_ENDPOINT = '/api/vehicles/vehicles';

// Utility for formatting currency
const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * Executes an API call with exponential backoff retry logic.
 * @param {string} url - The full URL to fetch.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @param {number} retries - Number of times to retry the request.
 */
const apiCallWithBackoff = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // If response is not ok, throw an error to be caught below
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Details: ${errorBody}`);
            }
            return response.json();
        } catch (error) {
            if (i === retries - 1) {
                console.error('Final API call failed:', url, error);
                throw new Error(`Failed to connect to server after ${retries} attempts.`);
            }
            const delay = Math.pow(2, i) * 1000 + Math.floor(Math.random() * 1000);
            console.warn(`API call failed. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// --- Sub-Components ---

/** Helper to calculate remaining time for the timer component */
const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

  return {
    total,
    hours,
    minutes,
    seconds,
    expired: total <= 0,
  };
};

const Timer = ({ endTime }) => {
  const [remaining, setRemaining] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const { hours, minutes, seconds, expired } = remaining;

  const style = {
    ...styles.timer,
    // Highlight in red when close to expiration
    backgroundColor: hours === 0 && minutes < 10 ? '#f87171' : (expired ? '#9ca3af' : '#10b981'),
  };

  if (expired) {
    return <div style={style}>Auction Ended</div>;
  }

  return (
    <div style={style}>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} remaining
    </div>
  );
};

const VehicleAuctionCard = ({ vehicle, onBidClick, onCardClick }) => {
  // Assuming vehicle object has ID, Make, Model, Year, and Auction-related fields (auctionId, highestBid, endTime)
  const {
      id: vehicleId,
      make, model, year, color, mileage, image_url,
      auctionId, highestBid, endTime
  } = vehicle;

  const isExpired = getTimeRemaining(endTime).expired;

  return (
    // Click the card to filter to this specific vehicle
    <div style={styles.card} onClick={() => onCardClick(vehicleId)}>
      <img
        src={image_url || 'https://placehold.co/600x400/94a3b8/FFFFFF?text=No+Image'}
        alt={`${year} ${make} ${model}`}
        style={styles.image}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/94a3b8/FFFFFF?text=Image+Error'; }}
      />
      <div style={styles.cardContent}>
        <h3 style={styles.title}>{year} {make} {model}</h3>
        <p style={styles.details}>
          <strong>Color:</strong> {color} | <strong>Mileage:</strong> {mileage?.toLocaleString() || 'N/A'}
        </p>
        <p style={styles.details}>
          <strong>Current Bid:</strong> <span style={styles.bidAmount}>{formatCurrency(highestBid)}</span>
        </p>
        <p style={styles.details}>
          <strong>Auction Ends:</strong> {formatDate(endTime)}
        </p>
        <Timer endTime={endTime} />
        {/* Click the button to navigate to bidding.jsx */}
        <button
          style={{ ...styles.bidButton, ...(isExpired ? styles.bidButtonDisabled : {}) }}
          onClick={(e) => {
            e.stopPropagation(); // Stop card click handler from firing when clicking button
            onBidClick(auctionId, vehicleId);
          }}
          disabled={isExpired}
        >
          {isExpired ? 'Auction Closed' : 'Bid Now'}
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

const Auctions = () => {
  const navigate = useNavigate();
  // useSearchParams allows reading/writing URL query parameters, e.g., ?vehicleId=123
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedVehicleId = searchParams.get('vehicleId');

  const [allAuctions, setAllAuctions] = useState([]); // Stores all fetched data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all vehicles from the live API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${BASE_API_URL}${VEHICLES_ENDPOINT}`;
      const data = await apiCallWithBackoff(url);
      // Ensure the data is an array before setting state
      setAllAuctions(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) {
         console.error('API response was not an array:', data);
      }
    } catch (err) {
      console.error('Failed to fetch auction data from live API:', err);
      setError('Could not load auction data from server. Please check your network or API status.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh interval for live data (e.g., bid updates)
    const refreshInterval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  // Logic to filter the list: if a vehicleId is in the URL, show only that one.
  const filteredAuctions = useMemo(() => {
    if (!selectedVehicleId) {
      return allAuctions; // Show all
    }
    // Filter to show only the vehicle matching the ID from the URL
    return allAuctions.filter(v => v.id === selectedVehicleId);
  }, [allAuctions, selectedVehicleId]);

  // Handler for Bid Now button: redirects to Bidding.jsx
  const handleBidClick = (auctionId, vehicleId) => {
    // Crucial step: Use navigate to send IDs to Bidding.jsx via query parameters
    if (auctionId && vehicleId) {
      navigate(`/bidding?auctionId=${auctionId}&vehicleId=${vehicleId}`);
    } else {
      console.error('Cannot bid: Missing auctionId or vehicleId', { auctionId, vehicleId });
      setError('Cannot proceed to bidding: Missing auction or vehicle information.');
    }
  };

  // Handler for card click: sets the vehicleId in the URL to filter the list
  const handleCardClick = (vehicleId) => {
    // This updates the URL to ?vehicleId=XXX, triggering the useMemo filter
    setSearchParams({ vehicleId });
  };

  // Handler to clear the filter and show all vehicles
  const handleShowAll = () => {
    setSearchParams({}); // Clear all search parameters
  };

  const getPageTitle = useMemo(() => {
    if (selectedVehicleId && filteredAuctions.length === 1) {
      const v = filteredAuctions[0];
      return `Auction for: ${v.year} ${v.make} ${v.model}`;
    }
    return 'Current Vehicle Auctions';
  }, [selectedVehicleId, filteredAuctions]);

  // --- Rendering Logic (Loading, Error, Empty states) ---

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Loading Live Auctions...</h1>
        <div style={styles.grid}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={styles.card}>
                <div style={styles.skeletonImage}></div>
                <div style={styles.cardContent}>
                  <div style={styles.skeletonText}></div>
                  <div style={{...styles.skeletonText, width: '60%'}}></div>
                  <div style={{...styles.skeletonText, width: '40%'}}></div>
                  <div style={styles.skeletonButton}></div>
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <span role="img" aria-label="error" style={styles.errorIcon}>⚠️</span>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryButton} onClick={fetchData}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>{getPageTitle}</h1>
        {/* Only show 'Show All' button when a filter is active */}
        {selectedVehicleId && (
          <button style={styles.showAllButton} onClick={handleShowAll}>
            ← Show All Vehicles
          </button>
        )}
      </div>

      <div style={styles.grid}>
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((vehicle) => (
            <VehicleAuctionCard
              key={vehicle.id}
              vehicle={vehicle}
              onBidClick={handleBidClick}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <div style={styles.emptyContainer}>
            <span role="img" aria-label="search" style={styles.emptyIcon}>🔍</span>
            <p style={styles.emptyText}>No active auctions found at this time.</p>
            {selectedVehicleId && (
              <button style={styles.retryButton} onClick={handleShowAll}>
                View All Auctions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  header: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'left',
  },
  showAllButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    border: '1px solid #e2e8f0',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)',
    }
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '1.5rem',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  details: {
    fontSize: '0.9rem',
    color: '#4b5563',
    marginBottom: '0.5rem',
  },
  bidAmount: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ef4444',
  },
  timer: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    transition: 'background-color 0.3s',
  },
  bidButton: {
    marginTop: 'auto',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  bidButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  // Loading/Error Styles
  skeletonImage: {
    width: '100%',
    height: '220px',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.75rem 0.75rem 0 0',
  },
  skeletonText: {
    height: '1rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    width: '80%',
  },
  skeletonButton: {
    height: '2.5rem',
    backgroundColor: '#9ca3af',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    width: '100%',
  },
  errorContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1.5rem',
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    margin: '2rem',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#dc2626',
  },
  errorText: {
    fontSize: '1.1rem',
    color: '#dc2626',
    fontWeight: '500',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  emptyContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1rem',
    textAlign: 'center',
    width: '100%',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: '0.5',
    color: '#94a3b8',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#4b5563',
    fontWeight: '500',
  },
};

export default Auctions;
