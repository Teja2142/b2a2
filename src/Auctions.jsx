import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


// --- API CONFIGURATION ---
const BASE_API_URL = 'https://api.b2a2cars.com';
const VEHICLES_ENDPOINT = '/api/vehicles/vehicles/';
const VEHICLE_IMAGES_ENDPOINT = '/api/vehicles/vehicle-images/';

// The defaultHeaders are now empty, allowing public access.
const defaultHeaders = {
    'accept': 'application/json',
};
// --- END API CONFIGURATION ---


// Utility for formatting currency and other data
const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
const formatMileage = (mileage) => mileage ? `${Number(mileage).toLocaleString()} mi` : 'N/A';

/**
 * Executes an API call with exponential backoff retry logic.
 */
const apiCallWithBackoff = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorBody.substring(0, 200)}...`);
            }
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

// Card component to display a vehicle
const VehicleCard = ({ vehicle, onViewDetails }) => {
  if (!vehicle) {
    // Skeleton Loader for initial list view
    return (
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <div style={styles.skeletonImage}></div>
          <div style={{...styles.skeletonText, width: '80%', height: '1.5rem'}}></div>
          <div style={{...styles.skeletonText, width: '50%', height: '1.25rem'}}></div>
          <div style={styles.skeletonText}></div>
          <div style={styles.skeletonText}></div>
          <div style={styles.skeletonText}></div>
          <div style={{...styles.skeletonText, height: '2.5rem', marginTop: '1.5rem'}}></div>
        </div>
      </div>
    );
  }

  // Ensure necessary fields are parsed
  const year = Number(vehicle.year) || 'N/A';
  const displayPrice = Number(vehicle.price || vehicle.starting_price || 0);

  return (
    <div
      style={styles.card}
      onClick={() => onViewDetails(vehicle)} // Handler for entire card click
      role="button"
      tabIndex="0"
      aria-label={`View details for ${year} ${vehicle.make} ${vehicle.model}`}
    >
      <div style={styles.imageContainer}>
        <img
          src={vehicle.imageUrl || `https://placehold.co/400x300/14b8a6/ffffff?text=${vehicle.make}+${vehicle.model}`}
          alt={`${year} ${vehicle.make} ${vehicle.model}`}
          style={styles.vehicleImage}
          onError={(e) => {
            e.target.onerror = null;
            // Fallback to a themed placeholder if the image fails to load
            e.target.src = `https://placehold.co/400x300/14b8a6/ffffff?text=${vehicle.make}+${vehicle.model}`;
          }}
        />
        <div style={styles.badge}>{year}</div>
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{`${year} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Model'}`}</h3>
        <p style={styles.cardSubtitle}>
          {displayPrice > 0 ? formatCurrency(displayPrice) : 'Price N/A'}
        </p>

        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Mileage:</span>
          <span style={styles.infoValue}>{formatMileage(vehicle.mileage)}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Color:</span>
          <span style={styles.infoValue}>{vehicle.color || 'TBA'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>ID:</span>
          <span style={styles.infoValue}>{vehicle.id ? vehicle.id.substring(0, 8) + '...' : 'N/A'}</span>
        </div>

        <button
          style={styles.detailsButton}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(vehicle);
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};


// New component for displaying single vehicle details
const VehicleDetails = ({ vehicleId, onBack }) => {
  const navigate = useNavigate(); // Use navigate for the Bid Now button
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use a more specific breakpoint, e.g., 900px, to trigger the stacking for tablets/mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  // Responsive logic hook
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch specific vehicle details (GET /api/vehicles/vehicles/{id}/)
        const vehicleUrl = `${BASE_API_URL}${VEHICLES_ENDPOINT}${vehicleId}/`;
        const vehicleData = await apiCallWithBackoff(vehicleUrl, { headers: defaultHeaders });

        // 2. Fetch images for this vehicle (GET /api/vehicles/vehicle-images/)
        const imagesResponse = await apiCallWithBackoff(
            `${BASE_API_URL}${VEHICLE_IMAGES_ENDPOINT}`,
            { headers: defaultHeaders }
        );
        // Assuming imageList is an array of objects, each having a 'vehicle' ID and 'image_url'
        const imageList = Array.isArray(imagesResponse) ? imagesResponse : imagesResponse?.results || [];
        const vehicleImages = imageList
            .filter(img => img.vehicle === vehicleId)
            .map(img => img.image_url)
            .filter(url => url);

        setVehicle(vehicleData);
        setImages(vehicleImages);

      } catch (err) {
        console.error("Detail API Fetch Error:", err);
        setError(`Failed to load details for vehicle ${vehicleId}. Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchDetails();
    }
  }, [vehicleId]);

  // Handler for bidding button
  const handleBidNow = () => {
    // Navigate to the bidding page, passing the vehicleId as a query param.
    if (vehicleId) {
      // In a real application, you'd check if `Maps` is available from 'react-router-dom'.
      // Since this environment doesn't always support routing, we'll log a message as a fallback.
      if (typeof navigate === 'function') {
        navigate(`/bidding?vehicleId=${vehicleId}`);
      } else {
         console.log(`Simulating navigation to /bidding?vehicleId=${vehicleId}`);
         // Use a custom message box instead of alert()
         const messageBox = document.getElementById('message-box');
         if (messageBox) {
             messageBox.textContent = `Bidding simulation: Attempting to navigate to vehicle ID: ${vehicleId}`;
             messageBox.style.display = 'block';
             setTimeout(() => messageBox.style.display = 'none', 3000);
         }
      }
    } else {
      console.error('Cannot bid: Vehicle ID missing.');
    }
  };


  if (isLoading) {
    return (
      <div style={styles.detailContainer}>
        <button style={styles.backButton} onClick={onBack}>&larr; Back to Listings</button>
        <div style={styles.detailCardBase}>
            <div style={{...styles.skeletonImage, height: '400px'}}></div>
            <div style={styles.detailContent}>
                <div style={{...styles.skeletonText, height: '2.5rem', width: '70%'}}></div>
                <div style={{...styles.skeletonText, height: '1.5rem', width: '50%'}}></div>
                <div style={{...styles.skeletonText, height: '1rem', width: '90%'}}></div>
                <div style={{...styles.skeletonText, height: '1rem', width: '80%'}}></div>
                <div style={{...styles.skeletonText, height: '1rem', width: '75%'}}></div>
                <div style={{...styles.skeletonText, height: '1rem', width: '60%'}}></div>
            </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div style={styles.detailContainer}>
        <button style={styles.backButton} onClick={onBack}>&larr; Back to Listings</button>
        <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorText}>{error || `No details found for vehicle ID: ${vehicleId}`}</p>
        </div>
      </div>
    );
  }

  const year = Number(vehicle.year) || 'N/A';
  const displayPrice = Number(vehicle.price || vehicle.starting_price || 0);

  return (
    <div style={styles.detailContainer}>
        {/* Custom message box for simulation feedback */}
        <div id="message-box" style={styles.messageBox}></div>

      <button style={styles.backButton} onClick={onBack}>&larr; Back to Listings</button>

      {/* Apply responsive styles based on screen width */}
      <div style={isMobile ? styles.detailCardMobile : styles.detailCardDesktop}>
        <div style={styles.imageGallery}>
          <img
            src={images[0] || `https://placehold.co/800x600/14b8a6/ffffff?text=${vehicle.make}+${vehicle.model}`}
            alt={`${year} ${vehicle.make} ${vehicle.model}`}
            style={styles.mainImage}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/800x600/14b8a6/ffffff?text=${vehicle.make}+${vehicle.model}`;
            }}
          />
          <div style={styles.thumbnailContainer}>
            {images.slice(1, 4).map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Thumbnail ${index + 2}`}
                style={styles.thumbnailImage}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/100x75/14b8a6/ffffff?text=Image+${index + 2}`;
                }}
              />
            ))}
            {images.length <= 1 && (
                <div style={styles.noImageText}>No additional images available.</div>
            )}
          </div>
        </div>

        <div style={styles.detailContent}>
          <h1 style={styles.detailTitle}>{`${year} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Model'}`}</h1>
          <p style={styles.detailPrice}>{displayPrice > 0 ? formatCurrency(displayPrice) : 'Current Price/Starting Bid: ' + formatCurrency(displayPrice)}</p>

          <button style={styles.bidNowButton} onClick={handleBidNow}>
             Bid Now 🚀
          </button>

          <h2 style={styles.detailSectionTitle}>Key Specifications</h2>
          <div style={styles.specsGrid}>
            <div style={styles.specItem}><span style={styles.specLabel}>VIN:</span><span style={styles.specValue}>{vehicle.vin || 'N/A'}</span></div>
            <div style={styles.specItem}><span style={styles.specLabel}>Mileage:</span><span style={styles.specValue}>{formatMileage(vehicle.mileage)}</span></div>
            <div style={styles.specItem}><span style={styles.specLabel}>Color:</span><span style={styles.specValue}>{vehicle.color || 'TBA'}</span></div>
            <div style={styles.specItem}><span style={styles.specLabel}>Engine:</span><span style={styles.specValue}>{vehicle.engine || 'N/A'}</span></div>
            <div style={styles.specItem}><span style={styles.specLabel}>Transmission:</span><span style={styles.specValue}>{vehicle.transmission || 'N/A'}</span></div>
            <div style={styles.specItem}><span style={styles.specLabel}>Fuel Type:</span><span style={styles.specValue}>{vehicle.fuel_type || 'N/A'}</span></div>
          </div>

          <h2 style={styles.detailSectionTitle}>Description</h2>
          <p style={styles.detailDescription}>{vehicle.description || 'No detailed description available for this vehicle.'}</p>
        </div>
      </div>
    </div>
  );
};


const Auctions = () => {
  // Removed unused 'navigate' declaration here
  const [vehicles, setVehicles] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ makes: [], minYear: 2000, maxYear: new Date().getFullYear(), minPrice: 0, maxPrice: 200000 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ make: '', minPrice: '', maxPrice: '', year: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null); // State for detail view

  // Unified function for handling navigation (now state update)
  const handleViewVehicle = useCallback((vehicle) => {
    if (vehicle?.id) {
      // Switch view to display details
      setSelectedVehicleId(vehicle.id);
    } else {
      console.error('Invalid vehicle data for navigation:', vehicle);
      setError('Could not view details. Vehicle data is incomplete.');
    }
  }, []);

  // Function to go back to the list view
  const handleBackToList = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);


  // Data Fetching Logic
  useEffect(() => {
    const fetchVehiclesAndImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch all vehicles (GET /api/vehicles/vehicles/)
        const vehiclesResponse = await apiCallWithBackoff(
            `${BASE_API_URL}${VEHICLES_ENDPOINT}`,
            { headers: defaultHeaders }
        );
        const vehicleList = Array.isArray(vehiclesResponse) ? vehiclesResponse : vehiclesResponse?.results || [];

        // 2. Fetch all vehicle images (GET /api/vehicles/vehicle-images/)
        const imagesResponse = await apiCallWithBackoff(
            `${BASE_API_URL}${VEHICLE_IMAGES_ENDPOINT}`,
            { headers: defaultHeaders }
        );
        const imageList = Array.isArray(imagesResponse) ? imagesResponse : imagesResponse?.results || [];

        // 3. Map images to vehicles (key: vehicle_id, value: first image URL)
        const vehicleImageMap = imageList.reduce((acc, image) => {
            if (!acc[image.vehicle] && image.image_url) {
                acc[image.vehicle] = image.image_url;
            }
            return acc;
        }, {});

        // 4. Combine vehicle data with image URL and ensure correct types
        const combinedVehicles = vehicleList.map(vehicle => ({
            ...vehicle,
            imageUrl: vehicleImageMap[vehicle.id] || null, // Primary image for card view
            // Ensure necessary fields for display/filtering are present and typed correctly
            make: vehicle.make || 'Unknown Make',
            model: vehicle.model || 'N/A',
            year: Number(vehicle.year) || null,
            mileage: Number(vehicle.mileage) || null,
            displayPrice: Number(vehicle.price || vehicle.starting_price || 0),
        })).filter(v => v.id);

        // 5. Generate filter options dynamically
        const uniqueMakes = [...new Set(combinedVehicles.map(v => v.make).filter(m => m && m !== 'Unknown Make'))].sort();
        const years = combinedVehicles.map(v => v.year).filter(y => y);
        const prices = combinedVehicles.map(v => v.displayPrice).filter(p => p);

        setVehicles(combinedVehicles);
        setFilterOptions({
            makes: uniqueMakes,
            minYear: years.length ? Math.min(...years) : 2000,
            maxYear: years.length ? Math.max(...years) : new Date().getFullYear(),
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 200000,
        });

      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(`Failed to load vehicle data: ${err.message}. Please check API availability.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehiclesAndImages();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Make Filter
      if (filters.make && vehicle.make !== filters.make) return false;

      // Year Filter
      if (filters.year && vehicle.year !== Number(filters.year)) return false;

      // Price Filters
      const price = vehicle.displayPrice;
      const minPrice = Number(filters.minPrice);
      const maxPrice = Number(filters.maxPrice);

      if (filters.minPrice && price < minPrice) return false;
      if (filters.maxPrice && price > maxPrice) return false;

      return true;
    });
  }, [vehicles, filters]);

  // --- RENDERING LOGIC ---

  if (selectedVehicleId) {
    return <VehicleDetails vehicleId={selectedVehicleId} onBack={handleBackToList} />;
  }

  // Loading and Error States
  if (isLoading) {
    return (
      <div style={styles.appContainer}>
        <main style={styles.container}>
            {[...Array(6)].map((_, i) => (
            <VehicleCard key={i} vehicle={null} onViewDetails={() => {}} />
            ))}
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorText}>{error}</p>
            <button style={styles.retryButton} onClick={() => window.location.reload()}>Retry Loading</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>Premium Vehicle Auctions</h1>
        <p style={styles.subTitle}>Explore all currently available cars and place your bid.</p>
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
            {filterOptions.makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>

          {/* Price Range Filter */}
          <input
            type="number"
            name="minPrice"
            placeholder={`Min Price (${formatCurrency(filterOptions.minPrice)})`}
            value={filters.minPrice}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder={`Max Price (${formatCurrency(filterOptions.maxPrice)})`}
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
            min={filterOptions.minYear}
            max={filterOptions.maxYear}
            style={styles.filterInput}
          />

          <button style={styles.clearFilters} onClick={() => setFilters({ make: '', minPrice: '', maxPrice: '', year: '' })}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Vehicle Grid */}
      <main style={styles.container}>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={handleViewVehicle}
            />
          ))
        ) : (
          <div style={styles.emptyContainer}>
            <span style={styles.emptyIcon}>🔍</span>
            <p style={styles.emptyText}>No vehicles found matching your filters.</p>
            <button style={styles.retryButton} onClick={() => setFilters({ make: '', minPrice: '', maxPrice: '', year: '' })}>
              Show All Vehicles
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 B2A2 Cars. All rights reserved.</p>
      </footer>
    </div>
  );
};



// Define a helper function to merge styles, handling the recursive definition issue
const createStyles = () => {
  const primaryColor = '#14b8a6'; // Tailwind Teal 500
  const primaryHover = '#0d9488'; // Tailwind Teal 600
  const accentColor = '#f97316'; // Tailwind Orange 600

  const detailCardBase = {
    backgroundColor: 'white',
    borderRadius: '1.25rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    display: 'flex',
    gap: '2rem',
  };

  return {
    // Global App Layout
    appContainer: {
      fontFamily: '"Inter", sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8fafc', // Light Slate background
      padding: '0 0.5rem', // Smaller padding for mobile
      // Media Query adjustment for larger screens (if we could use real CSS)
      '@media (min-width: 640px)': {
          padding: '0 1rem',
      }
    },
    messageBox: {
      display: 'none',
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      backgroundColor: primaryColor,
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      fontSize: '0.9rem',
    },
    header: {
      padding: '2rem 1rem 1rem 1rem', // Added horizontal padding back for header content
      textAlign: 'center',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '1.5rem',
    },
    mainTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    subTitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
      marginBottom: '1.5rem',
    },
    // Responsive Grid Container
    container: {
      display: 'grid',
      // Excellent responsive grid setup
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem 4rem 1rem',
    },
    footer: {
      textAlign: 'center',
      padding: '2rem 0',
      color: '#9ca3af',
      fontSize: '0.875rem',
    },

    // Filter Bar
    filterToggle: {
      padding: '0.5rem 1.5rem',
      backgroundColor: primaryColor,
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': { backgroundColor: primaryHover },
    },
    filterBar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      padding: '1.25rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
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
      // Force full width on very small screens
      '@media (max-width: 480px)': {
          minWidth: '100%',
      }
    },
    filterInput: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      flexGrow: '1',
      minWidth: '120px',
      // Force full width on very small screens
      '@media (max-width: 480px)': {
          minWidth: '100%',
      }
    },
    clearFilters: {
      padding: '0.75rem 1.5rem',
      backgroundColor: accentColor,
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': { backgroundColor: '#ea580c' },
    },

    // Card Styles
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      border: '1px solid #e5e7eb',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.15)',
      },
    },
    imageContainer: {
      position: 'relative',
      height: '200px',
      overflow: 'hidden',
      borderBottom: '1px solid #f3f4f6',
      background: '#e5e7eb',
    },
    vehicleImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s',
      ':hover': { transform: 'scale(1.05)' }
    },
    badge: {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
      backgroundColor: primaryHover,
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
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '0.25rem',
      lineHeight: '1.2',
    },
    cardSubtitle: {
      fontSize: '1.1rem',
      color: accentColor, // Orange for Price
      fontWeight: '700',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid #f3f4f6',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    infoLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
    },
    infoValue: {
      fontSize: '0.95rem',
      color: '#1f2937',
      fontWeight: '600',
    },
    detailsButton: {
      marginTop: '1.5rem',
      padding: '0.75rem 0',
      backgroundColor: primaryColor,
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.4)', // Teal shadow
      ':hover': { backgroundColor: primaryHover },
      ':active': { transform: 'scale(0.98)' },
    },

    // Detail View Styles (fixed reference issue)
    detailContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem 4rem 1rem',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    },
    detailCardBase: detailCardBase, // Base style is defined first
    // Mobile (default) style for detailCard (stacked)
    detailCardMobile: {
      ...detailCardBase,
      flexDirection: 'column',
      padding: '1rem', // Smaller padding on mobile
    },
    // Desktop style for detailCard (side-by-side)
    detailCardDesktop: {
      ...detailCardBase,
      flexDirection: 'row',
    },
    imageGallery: {
      flex: 2, // Image section takes more space
      minWidth: '50%',
    },
    mainImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '450px',
      objectFit: 'cover',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
    },
    thumbnailContainer: {
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      justifyContent: 'flex-start',
    },
    thumbnailImage: {
      width: '100px',
      minWidth: '100px',
      height: '75px',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      border: '2px solid #f3f4f6',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      ':hover': { borderColor: primaryColor },
    },
    noImageText: {
      padding: '0.5rem',
      color: '#9ca3af',
      fontSize: '0.875rem',
    },
    detailContent: {
      flex: 1, // Detail section takes less space
    },
    detailTitle: {
      fontSize: '2.25rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '0.5rem',
      lineHeight: '1.2',
    },
    detailPrice: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#4b5563', // Subdued price before bid button
      marginBottom: '0.5rem',
    },
    bidNowButton: {
      // Significantly improved style for visibility and impact
      width: '100%',
      padding: '1.25rem 0',
      backgroundColor: accentColor,
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '1.2rem',
      fontWeight: '800',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      background: `linear-gradient(135deg, ${accentColor} 0%, #ff5e3a 100%)`, // Orange Gradient
      boxShadow: '0 8px 15px -5px rgba(249, 115, 22, 0.6)', // Stronger shadow
      marginBottom: '2rem',
      transition: 'all 0.2s',
      ':hover': {
        boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.8)',
        transform: 'translateY(-2px)',
      },
      ':active': { transform: 'scale(0.99)' },
    },
    detailSectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: primaryColor, // Teal for section titles
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '0.5rem',
    },
    specsGrid: {
      display: 'grid',
      // Ensure two columns on mobile and potentially three on desktop
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '1rem',
      border: '1px solid #f3f4f6',
      borderRadius: '0.5rem',
      padding: '1rem',
      backgroundColor: '#fcfcfc',
    },
    specItem: {
      display: 'flex',
      flexDirection: 'column',
    },
    specLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
    },
    specValue: {
      fontSize: '1rem',
      color: '#1f2937',
      fontWeight: '600',
      marginTop: '0.25rem',
    },
    detailDescription: {
      fontSize: '1rem',
      color: '#4b5563',
      lineHeight: '1.6',
    },
    backButton: {
      marginBottom: '1.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#9ca3af',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': { backgroundColor: '#6b7280' },
    },


    // Skeleton Styles (unchanged but robust)
    skeletonImage: {
      width: '100%',
      height: '200px',
      backgroundColor: '#e5e7eb',
      animation: 'pulse 1.5s infinite ease-in-out',
    },
    skeletonText: {
      height: '1rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      marginBottom: '0.75rem',
      animation: 'pulse 1.5s infinite ease-in-out',
    },

    // Error/Empty States (unchanged but robust)
    errorContainer: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1.5rem',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '4rem auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.1)',
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
      backgroundColor: primaryColor,
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': { backgroundColor: primaryHover },
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
    // Keyframes for pulse animation (needed for skeleton loader)
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  };
};

const styles = createStyles();

export default Auctions;
