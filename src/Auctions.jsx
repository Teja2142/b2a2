import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Configuration ---
// Base URL for API calls. Using a mock URL since the actual one is restricted.
const BASE_API_URL = 'https://api.b2a2cars.com';
const AUCTIONS_ENDPOINT = '/api/auction/auctions/';

// Mock data for filter options based on expected vehicle types
const mockFilterOptions = {
  makes: ['Audi', 'BMW', 'Ford', 'Tesla', 'Toyota', 'Mercedes-Benz', 'Porsche', 'Honda'],
  minYear: 2000,
  maxYear: new Date().getFullYear(),
  minPrice: 5000,
  maxPrice: 200000,
};

// Mock Data for a complete component
const mockAuctions = [
  { id: 'a101', title: 'Luxury Sedan Sale', vehicle: 'v001', starting_price: '45000', reserve_price: '50000', start_time: '2025-10-25T10:00:00Z', end_time: '2025-11-01T10:00:00Z', highest_bid: '48000' },
  { id: 'a102', title: 'Classic American Muscle', vehicle: 'v002', starting_price: '25000', reserve_price: null, start_time: '2025-10-28T12:00:00Z', end_time: '2025-11-04T12:00:00Z', highest_bid: '27500' },
  { id: 'a103', title: 'Electric Vehicle Auction', vehicle: 'v003', starting_price: '65000', reserve_price: '70000', start_time: '2025-10-30T09:00:00Z', end_time: '2025-11-06T09:00:00Z', highest_bid: null },
  { id: 'a104', title: 'Budget Friendly Hatchback', vehicle: 'v004', starting_price: '8000', reserve_price: '10000', start_time: '2025-11-01T15:00:00Z', end_time: '2025-11-08T15:00:00Z', highest_bid: '9500' },
];

const mockVehicles = {
  'v001': { id: 'v001', make: 'BMW', model: 'M5', year: 2022, color: 'Black', mileage: 12000, imageUrl: 'https://placehold.co/400x300/1e40af/ffffff?text=BMW+M5' },
  'v002': { id: 'v002', make: 'Ford', model: 'Mustang', year: 1969, color: 'Red', mileage: 50000, imageUrl: 'https://placehold.co/400x300/ef4444/ffffff?text=Ford+Mustang' },
  'v003': { id: 'v003', make: 'Tesla', model: 'Model Y', year: 2023, color: 'White', mileage: 5000, imageUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=Tesla+Model+Y' },
  'v004': { id: 'v004', make: 'Toyota', model: 'Yaris', year: 2018, color: 'Blue', mileage: 45000, imageUrl: 'https://placehold.co/400x300/f59e0b/ffffff?text=Toyota+Yaris' },
};


// Utility for formatting currency
const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(dateString).toLocaleDateString() : 'TBA';

/**
 * Executes an API call with exponential backoff retry logic.
 */
const apiCallWithBackoff = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Details: ${errorBody}`);
            }
            // Check for 204 No Content
            if (response.status === 204) {
                return null;
            }
            return await response.json();
        } catch (error) {
            if (i < retries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
};

// Card component to display a vehicle in an auction
// Updated to include onViewDetails for entire card click
const VehicleAuctionCard = ({ auction, vehicle, onBidClick, onViewDetails }) => {
  if (!vehicle) {
    return (
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <div style={styles.skeletonImage}></div>
          <div style={styles.skeletonText}></div>
          <div style={styles.skeletonText}></div>
        </div>
      </div>
    );
  }

  const getTimeRemaining = (endTime) => {
    const total = new Date(endTime).getTime() - new Date().getTime();
    if (total <= 0) return 'Auction Ended';
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m ${seconds}s left`;
  };

  return (
    <div
      style={styles.card}
      onClick={onViewDetails} // Handler for entire card click
      role="button"
      tabIndex="0"
      aria-label={`View details for auction ${auction.title}`}
    >
      <div style={styles.imageContainer}>
        <img
          src={vehicle.imageUrl || `https://placehold.co/400x300/4f46e5/ffffff?text=${vehicle.make}+${vehicle.model}`}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          style={styles.vehicleImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x300/4f46e5/ffffff?text=${vehicle.make}+${vehicle.model}`;
          }}
        />
        <div style={styles.auctionBadge}>{getTimeRemaining(auction.end_time)}</div>
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{auction.title}</h3>
        <p style={styles.cardSubtitle}>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</p>

        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Starting Bid:</span>
          <span style={styles.infoValue}>{formatCurrency(auction.starting_price)}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Current Highest Bid:</span>
          <span style={styles.infoValue}>{formatCurrency(auction.highest_bid || auction.starting_price)}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Ends At:</span>
          <span style={styles.infoValue}>{formatDate(auction.end_time)}</span>
        </div>

        <button
          style={styles.bidButton}
          onClick={(e) => {
            e.stopPropagation(); // Prevents the card's onClick (onViewDetails) from firing
            onBidClick(); // The button's click handler
          }}
        >
          Bid Now $\rightarrow$
        </button>
      </div>
    </div>
  );
};


const Auctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [vehicles, setVehicles] = useState({}); // Map vehicleId to vehicle details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ make: '', minPrice: '', maxPrice: '', year: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Unified function for navigation to the bidding page
  const handleViewAuction = useCallback((auction) => {
    // Navigate to the Bidding page, passing auctionId and vehicleId as search params
    if (auction?.id && auction?.vehicle) {
      navigate(`/bidding?auctionId=${auction.id}&vehicleId=${auction.vehicle}`);
    } else {
      console.error('Invalid auction data for navigation:', auction);
      setError('Could not start bidding. Auction data is incomplete.');
    }
  }, [navigate]);

  // Mock Fetching Logic (Replace with actual API calls)
  useEffect(() => {
    const fetchAuctionsAndVehicles = async () => {
      // In a real application, you would make two API calls here:
      // 1. Fetch the list of auctions (GET /api/auction/auctions/)
      // 2. Fetch the vehicle details for all unique vehicle IDs from the auctions list (batch or multiple GET /api/vehicles/vehicles/{id})

      try {
        // Mock data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAuctions(mockAuctions);
        setVehicles(mockVehicles);
        setError(null);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load auction data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctionsAndVehicles();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAuctions = useMemo(() => {
    return auctions.filter(auction => {
      const vehicle = vehicles[auction.vehicle];
      if (!vehicle) return false;

      // Make Filter
      if (filters.make && vehicle.make !== filters.make) return false;

      // Year Filter
      if (filters.year && vehicle.year !== Number(filters.year)) return false;

      // Price Filters (use starting_price for simplicity in mock)
      const price = Number(auction.starting_price);
      const minPrice = Number(filters.minPrice);
      const maxPrice = Number(filters.maxPrice);

      if (filters.minPrice && price < minPrice) return false;
      if (filters.maxPrice && price > maxPrice) return false;

      return true;
    });
  }, [auctions, vehicles, filters]);

  // Loading and Error States
  if (isLoading) {
    return (
      <div style={styles.container}>
        {[...Array(6)].map((_, i) => (
          <VehicleAuctionCard key={i} auction={null} vehicle={null} onBidClick={() => {}} onViewDetails={() => {}} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <span style={styles.errorIcon}>⚠️</span>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryButton} onClick={() => window.location.reload()}>Retry Loading</button>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>Live Car Auctions</h1>
        <p style={styles.subTitle}>Bid on the best vehicles from around the globe.</p>
        <button style={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </header>

      {/* Filter Section */}
      {showFilters && (
        <div style={styles.filterBar}>
          {/* Make Filter */}
          <select name="make" value={filters.make} onChange={handleFilterChange} style={styles.filterSelect}>
            <option value="">All Makes</option>
            {mockFilterOptions.makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>

          {/* Price Range Filter */}
          <input
            type="number"
            name="minPrice"
            placeholder={`Min Price (${formatCurrency(mockFilterOptions.minPrice)})`}
            value={filters.minPrice}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder={`Max Price (${formatCurrency(mockFilterOptions.maxPrice)})`}
            value={filters.maxPrice}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />

          {/* Year Filter */}
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={filters.year}
            onChange={handleFilterChange}
            min={mockFilterOptions.minYear}
            max={mockFilterOptions.maxYear}
            style={styles.filterInput}
          />

          <button style={styles.clearFilters} onClick={() => setFilters({ make: '', minPrice: '', maxPrice: '', year: '' })}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Auction Grid */}
      <main style={styles.container}>
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <VehicleAuctionCard
              key={auction.id}
              auction={auction}
              vehicle={vehicles[auction.vehicle]}
              // Both card click and button click lead to the bidding page
              onBidClick={() => handleViewAuction(auction)}
              onViewDetails={() => handleViewAuction(auction)}
            />
          ))
        ) : (
          <div style={styles.emptyContainer}>
            <span style={styles.emptyIcon}>🔍</span>
            <p style={styles.emptyText}>No auctions found matching your filters.</p>
            <button style={styles.retryButton} onClick={() => setFilters({ make: '', minPrice: '', maxPrice: '', year: '' })}>
              Show All Auctions
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 B2A2 Cars Auctions. All rights reserved.</p>
      </footer>
    </div>
  );
};


// --- Inline Styles (Tailwind-inspired) ---

const styles = {
  // Global App Layout
  appContainer: {
    fontFamily: '"Inter", sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f9fafb', // Light Gray background
    padding: '0 1rem',
    '@media (min-width: 640px)': {
      padding: '0 2rem',
    },
  },
  header: {
    padding: '2rem 0 1rem 0',
    textAlign: 'center',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '1.5rem',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  subTitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingBottom: '4rem',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem 0',
    color: '#9ca3af',
    fontSize: '0.875rem',
  },

  // Filter Bar
  filterToggle: {
    padding: '0.5rem 1rem',
    backgroundColor: '#34d399',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#10b981',
    },
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSelect: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    flexGrow: '1',
    minWidth: '150px',
  },
  filterInput: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    flexGrow: '1',
    minWidth: '120px',
  },
  clearFilters: {
    padding: '0.75rem 1rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#d97706',
    },
  },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer', // Indicate clickability
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    borderBottom: '1px solid #e5e7eb',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  auctionBadge: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  cardContent: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.25rem',
  },
  cardSubtitle: {
    fontSize: '1rem',
    color: '#4b5563',
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px dotted #e5e7eb',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#1f2937',
    fontWeight: '600',
  },
  bidButton: {
    marginTop: '1.5rem',
    padding: '0.75rem 0',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)',
    ':hover': {
      backgroundColor: '#4338ca',
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },

  // Skeleton Styles
  skeletonImage: {
    width: '100%',
    height: '200px',
    backgroundColor: '#e5e7eb',
  },
  skeletonText: {
    height: '1.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    marginBottom: '0.75rem',
  },

  // Error/Empty States
  errorContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1.5rem',
    textAlign: 'center',
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
    ':hover': { backgroundColor: '#4338ca' },
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
    color: '#9ca3af',
  },
  emptyText: {
    fontSize: '1.5rem',
    color: '#6b7280',
    fontWeight: '600',
  },
};

export default Auctions;
