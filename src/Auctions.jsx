import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Helper Functions and Mock Data ---

// Mock data for filter options based on expected vehicle types
const mockFilterOptions = {
  makes: ['Audi', 'BMW', 'Ford', 'Tesla', 'Toyota', 'Mercedes-Benz', 'Porsche', 'Honda'],
  minYear: 2000,
  maxYear: new Date().getFullYear(),
  minPrice: 5000,
  maxPrice: 200000,
};

// Card component to display a vehicle in an auction (reused from original)
const VehicleAuctionCard = ({ auction, vehicle, onBidClick }) => {
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

  const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(dateString).toLocaleDateString() : 'TBA';

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Auction ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img 
          src={vehicle.image_url || 'https://placehold.co/600x400?text=No+Image'} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
          style={styles.image} 
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
        <div style={styles.timeBadge}>
          {getTimeRemaining(auction.end_time)}
        </div>
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.title}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p style={styles.subtitle}>{vehicle.trim || 'Premium Edition'}</p>
        
        <div style={styles.priceSection}>
          <div style={styles.priceItem}>
            <span style={styles.priceLabel}>Starting Price</span>
            <span style={styles.priceValue}>{formatCurrency(auction.starting_price)}</span>
          </div>
          <div style={styles.priceItem}>
            <span style={styles.priceLabel}>Current Bid</span>
            <span style={{...styles.priceValue, color: '#10b981'}}>
              {formatCurrency(auction.highest_bid)}
            </span>
          </div>
        </div>

        <div style={styles.auctionInfo}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>⏰</span>
            <span style={styles.infoText}>Ends: {formatDate(auction.end_time)}</span>
          </div>
        </div>

        <button 
          style={styles.bidButton} 
          onClick={() => onBidClick(auction.id)}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span style={styles.bidButtonText}>Place Bid</span>
          <span style={styles.bidButtonArrow}>→</span>
        </button>
      </div>
    </div>
  );
};

// --- Filter Sidebar Component ---
const FilterSidebar = ({ filters, handleFilterChange, resetFilters }) => {
  const formatCurrency = (amount) => `$${Number(amount).toLocaleString()}`;
  
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarHeader}>Filters</h2>
      <button style={styles.resetButton} onClick={resetFilters}>
        Clear All
      </button>

      {/* Make Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Vehicle Make</h3>
        <select 
          style={styles.filterSelect}
          value={filters.make}
          onChange={(e) => handleFilterChange('make', e.target.value)}
        >
          <option value="">All Makes</option>
          {mockFilterOptions.makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {/* Year Range Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Year Range</h3>
        <div style={styles.rangeDisplay}>
          <span>Min: {filters.minYear}</span>
          <span>Max: {filters.maxYear}</span>
        </div>
        <div style={styles.rangeInputGroup}>
          <input 
            type="number"
            style={styles.rangeInput}
            value={filters.minYear}
            min={mockFilterOptions.minYear}
            max={filters.maxYear}
            onChange={(e) => handleFilterChange('minYear', Number(e.target.value))}
          />
          <input 
            type="number"
            style={styles.rangeInput}
            value={filters.maxYear}
            min={filters.minYear}
            max={mockFilterOptions.maxYear}
            onChange={(e) => handleFilterChange('maxYear', Number(e.target.value))}
          />
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Price Range</h3>
        <div style={styles.rangeDisplay}>
          <span>Min: {formatCurrency(filters.minPrice)}</span>
          <span>Max: {formatCurrency(filters.maxPrice)}</span>
        </div>
        <div style={styles.rangeInputGroup}>
          <input 
            type="number"
            style={styles.rangeInput}
            value={filters.minPrice}
            min={mockFilterOptions.minPrice}
            max={filters.maxPrice}
            step="1000"
            onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
          />
          <input 
            type="number"
            style={styles.rangeInput}
            value={filters.maxPrice}
            min={filters.minPrice}
            max={mockFilterOptions.maxPrice}
            step="1000"
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Auctions Component ---
const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initialFilters = {
    make: '',
    minYear: mockFilterOptions.minYear,
    maxYear: mockFilterOptions.maxYear,
    minPrice: mockFilterOptions.minPrice,
    maxPrice: mockFilterOptions.maxPrice,
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchAuctionData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all auctions
        const auctionsResponse = await fetch("https://api.b2a2cars.com/api/auction/auctions/");
        if (!auctionsResponse.ok) {
          throw new Error('Failed to fetch auctions');
        }
        const auctionsData = await auctionsResponse.json();
        
        // Filter for currently live auctions
        const now = new Date();
        const liveAuctions = auctionsData.filter(auction => {
          const startTime = new Date(auction.start_time);
          const endTime = new Date(auction.end_time);
          return now >= startTime && now <= endTime;
        });

        // Sort by end time (soonest first)
        liveAuctions.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
        setAuctions(liveAuctions);

        // Fetch all vehicles
        const vehiclesResponse = await fetch("https://api.b2a2cars.com/api/vehicles/vehicles/");
        if (!vehiclesResponse.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const vehiclesData = await vehiclesResponse.json();
        
        // Map vehicles by ID for easy lookup
        const vehiclesMap = vehiclesData.reduce((acc, vehicle) => {
          acc[vehicle.id] = vehicle;
          return acc;
        }, {});
        setVehicles(vehiclesMap);

      } catch (err) {
        console.error("Error fetching auction data:", err);
        // Using a mock fallback for live preview if the real API fails
        setError("Failed to load auction data. Displaying mock data for demonstration.");
        
        // --- Mock Data Fallback ---
        const mockAuctions = [
          { id: 1, vehicle: 101, starting_price: 35000, highest_bid: 41000, end_time: new Date(Date.now() + 86400000).toISOString(), start_time: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, vehicle: 102, starting_price: 60000, highest_bid: 60000, end_time: new Date(Date.now() + 172800000).toISOString(), start_time: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, vehicle: 103, starting_price: 15000, highest_bid: 18500, end_time: new Date(Date.now() + 36000000).toISOString(), start_time: new Date(Date.now() - 3600000).toISOString() },
        ];
        const mockVehicles = {
          101: { id: 101, make: 'Audi', model: 'R8', year: 2022, trim: 'V10 Performance', image_url: 'https://placehold.co/600x400/3b82f6/ffffff?text=Audi+R8' },
          102: { id: 102, make: 'Tesla', model: 'Model S', year: 2023, trim: 'Plaid', image_url: 'https://placehold.co/600x400/10b981/ffffff?text=Tesla+Plaid' },
          103: { id: 103, make: 'Ford', model: 'Mustang', year: 2018, trim: 'GT', image_url: 'https://placehold.co/600x400/f59e0b/ffffff?text=Ford+Mustang' },
        };
        setAuctions(mockAuctions);
        setVehicles(mockVehicles);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, []);

  const handleBidClick = (auctionId) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (auction && auction.vehicle) {
      // Dummy navigation URL since we don't have the real vehicle URL path
      navigate(`/bidding-details/${auctionId}/${auction.vehicle}`); 
      // alert(`Navigating to bidding for Auction ID: ${auctionId}`);
    } else {
      console.error("Could not find auction or vehicle to navigate.");
      // alert("Unable to proceed with bidding. Please try again.");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // --- Filtering Logic ---
  const filteredAuctions = useMemo(() => {
    let filtered = auctions;

    // 1. Filter by Make
    if (filters.make) {
      filtered = filtered.filter(auction => {
        const vehicle = vehicles[auction.vehicle];
        return vehicle && vehicle.make === filters.make;
      });
    }

    // 2. Filter by Year Range
    filtered = filtered.filter(auction => {
      const vehicle = vehicles[auction.vehicle];
      if (!vehicle) return false;
      return vehicle.year >= filters.minYear && vehicle.year <= filters.maxYear;
    });

    // 3. Filter by Price Range (using highest bid as the proxy for value)
    filtered = filtered.filter(auction => {
      const bidPrice = auction.highest_bid || auction.starting_price;
      return bidPrice >= filters.minPrice && bidPrice <= filters.maxPrice;
    });
    
    return filtered;

  }, [auctions, vehicles, filters]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Live Auctions...</p>
        </div>
      );
    }
    
    if (error && auctions.length === 0) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (filteredAuctions.length === 0 && auctions.length > 0) {
      return (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📭</div>
          <p style={styles.emptyText}>No auctions match your current filters.</p>
          <p style={styles.emptySubtext}>Try adjusting the make, year, or price range.</p>
          <button 
            style={styles.retryButton}
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      );
    }
    
    if (auctions.length === 0) {
      return (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🔍</div>
          <p style={styles.emptyText}>No live auctions available at this time</p>
          <p style={styles.emptySubtext}>Check back later for new auction opportunities</p>
        </div>
      );
    }

    return (
      <div style={styles.grid}>
        {filteredAuctions.map((auction) => (
          <VehicleAuctionCard 
            key={auction.id} 
            auction={auction}
            vehicle={vehicles[auction.vehicle]}
            onBidClick={handleBidClick} 
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* Global mobile layout adjustment for the main content */
          @media (max-width: 768px) {
            .main-content-wrapper {
              flex-direction: column;
            }
            .sidebar-filter {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e2e8f0;
              margin-bottom: 1.5rem;
              padding-bottom: 1.5rem;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.header}>Live Auctions</h1>
          <p style={styles.subHeader}>
            Bid on exclusive vehicles with real-time updates and competitive pricing
          </p>
          {!loading && !error && auctions.length > 0 && (
            <div style={styles.stats}>
              <span style={styles.statItem}>{filteredAuctions.length} Matching Auctions</span>
            </div>
          )}
        </div>
        
        <div style={styles.mainContentWrapper} className="main-content-wrapper">
          <div style={styles.sidebarWrapper} className="sidebar-filter">
            <FilterSidebar 
              filters={filters} 
              handleFilterChange={handleFilterChange} 
              resetFilters={resetFilters}
            />
          </div>
          <div style={styles.auctionListWrapper}>
            {renderContent()}
          </div>
        </div>

      </div>
    </>
  );
};

// --- Updated and New Styles ---
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: '80vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '0 1rem',
  },
  header: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    letterSpacing: '-0.025em',
  },
  subHeader: {
    fontSize: '1.25rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  stats: {
    display: 'inline-flex',
    backgroundColor: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.1)',
    border: '1px solid #e2e8f0',
  },
  statItem: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  // --- New Layout Styles ---
  mainContentWrapper: {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'flex-start',
  },
  sidebarWrapper: {
    flex: '0 0 280px', // Fixed width for sidebar on desktop
    paddingRight: '1.5rem',
    borderRight: '1px solid #e2e8f0',
  },
  auctionListWrapper: {
    flex: '1',
    minWidth: 0, // Ensure content can shrink
  },
  sidebar: {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    position: 'sticky',
    top: '2rem', /* Stay visible as user scrolls */
  },
  sidebarHeader: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f1f5f9',
  },
  resetButton: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  filterGroup: {
    marginBottom: '1.5rem',
    padding: '1rem 0',
    borderBottom: '1px dashed #e2e8f0',
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
  },
  filterSelect: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    backgroundColor: 'white',
    appearance: 'none',
    WebkitAppearance: 'none',
    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%234b5563' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 0.75rem center / 1.5rem`,
    cursor: 'pointer',
  },
  rangeDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#475569',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  rangeInputGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  rangeInput: {
    width: '50%',
    padding: '0.75rem 0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    textAlign: 'center',
    MozAppearance: 'textfield', /* Hide arrow in Firefox */
  },
  
  // --- Grid and Card Styles (Reused/Minor Updates) ---
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', /* Adjusted minmax for space */
    gap: '2rem',
    padding: '0',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.02)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #f1f5f9',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    },
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  timeBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
  cardContent: {
    padding: '1.75rem',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '-0.5rem 0 0 0',
    fontWeight: '500',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '0.75rem',
    margin: '0.5rem 0',
  },
  priceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.25rem',
  },
  priceLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  priceValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  auctionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: '#64748b',
  },
  infoIcon: {
    fontSize: '1rem',
  },
  infoText: {
    flex: '1',
  },
  bidButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1rem 1.5rem',
    marginTop: 'auto',
    backgroundColor: '#4f46e5',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)',
  },
  bidButtonText: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  bidButtonArrow: {
    fontSize: '1.2rem',
    transition: 'transform 0.2s ease',
  },
  // --- Message/Loader Styles ---
  loadingContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1.5rem',
    width: '100%',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderLeft: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#64748b',
    fontWeight: '500',
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
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
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
  },
  emptyText: {
    fontSize: '1.25rem',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: '1rem',
    color: '#94a3b8',
  },
  skeletonImage: {
    width: '100%',
    height: '200px',
    backgroundColor: '#e2e8f0',
    borderRadius: '0.5rem',
    animation: 'pulse 2s infinite',
  },
  skeletonText: {
    height: '1rem',
    backgroundColor: '#e2e8f0',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    animation: 'pulse 2s infinite',
  },
};

export default Auctions;
