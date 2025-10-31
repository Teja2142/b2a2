import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- Configuration and Utilities ---
const BASE_API_URL = 'https://api.b2a2cars.com';
const VEHICLE_DETAIL_ENDPOINT = '/api/vehicles/vehicles/'; // Assumed endpoint for single vehicle
const PLACE_BID_ENDPOINT = '/api/auctions/place-bid'; // Assumed endpoint for bidding

// Utility for formatting currency
const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(dateString).toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
};

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
            // Check for empty body (e.g., successful POST/PUT might return 204 No Content)
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return {};
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


// --- Main Component ---

const Bidding = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const auctionId = searchParams.get('auctionId');
    const vehicleId = searchParams.get('vehicleId');

    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newBidAmount, setNewBidAmount] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' }); // success, error, info
    const [currentHighestBid, setCurrentHighestBid] = useState(0);

    // 1. Fetch Vehicle and Auction Details
    const fetchAuctionDetails = useCallback(async () => {
        if (!vehicleId) {
            setMessage({ type: 'error', text: 'Error: Vehicle ID is missing from the URL.' });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setMessage({ type: 'info', text: 'Loading vehicle and auction details...' });
        try {
            // Fetch single vehicle details (assumed endpoint)
            const url = `${BASE_API_URL}${VEHICLE_DETAIL_ENDPOINT}${vehicleId}`;
            const data = await apiCallWithBackoff(url);
            
            if (data && data.highestBid !== undefined) {
                setVehicleDetails(data);
                setCurrentHighestBid(data.highestBid);
                setNewBidAmount(data.highestBid + 100); // Suggest a minimum next bid
                setMessage({ type: '', text: '' });
            } else {
                setMessage({ type: 'error', text: 'Vehicle details loaded, but auction data is incomplete.' });
            }

        } catch (err) {
            console.error('Error fetching auction details:', err);
            setMessage({ type: 'error', text: `Failed to load vehicle details: ${err.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [vehicleId]);

    useEffect(() => {
        fetchAuctionDetails();
        // Set up a quick refresh for live bidding updates
        const refreshInterval = setInterval(fetchAuctionDetails, 10000); // Refresh every 10 seconds
        return () => clearInterval(refreshInterval);
    }, [fetchAuctionDetails]);

    // 2. Handle Bid Submission
    const handlePlaceBid = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: 'Placing your bid...' });

        const bidValue = Number(newBidAmount);
        if (isNaN(bidValue) || bidValue <= currentHighestBid) {
            setMessage({ type: 'error', text: `Bid must be a valid number and greater than the current highest bid (${formatCurrency(currentHighestBid)}).` });
            return;
        }

        if (!auctionId) {
            setMessage({ type: 'error', text: 'Cannot place bid: Auction ID is missing.' });
            return;
        }

        try {
            const payload = {
                auctionId: auctionId,
                bidAmount: bidValue,
                // IMPORTANT: You will need to replace this with a real user authentication token/ID
                // For now, using a placeholder. The backend MUST check for a valid user token.
                userId: 'current-authenticated-user-id',
            };

            const url = `${BASE_API_URL}${PLACE_BID_ENDPOINT}`;
            const result = await apiCallWithBackoff(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header here once your auth is implemented
                    // 'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(payload),
            });

            // Assuming the API returns the new, updated auction details on success
            if (result && result.newHighestBid) {
                setCurrentHighestBid(result.newHighestBid);
                setNewBidAmount(result.newHighestBid + 100);
                setMessage({ type: 'success', text: `Bid successful! Your new bid is ${formatCurrency(result.newHighestBid)}.` });
            } else {
                // If API returns success but no data, assume success and refresh
                setMessage({ type: 'success', text: 'Bid placed successfully. Refreshing details...' });
                fetchAuctionDetails();
            }

        } catch (err) {
            console.error('Bidding failed:', err);
            setMessage({ type: 'error', text: `Bidding failed: ${err.message}` });
        }
    };

    if (!vehicleId) {
        return (
            <div style={styles.errorContainer}>
                <span style={styles.errorIcon}>🛑</span>
                <h2 style={styles.errorText}>Missing Vehicle/Auction Information</h2>
                <p>Please navigate from the Auctions page to bid on a specific vehicle.</p>
                <button style={styles.retryButton} onClick={() => navigate('/auctions')}>Go to Auctions</button>
            </div>
        );
    }

    if (isLoading || !vehicleDetails) {
        return (
            <div style={styles.container}>
                <h1 style={styles.header}>Loading Auction Details...</h1>
                {message.text && <p style={{...styles.message, backgroundColor: styles.message.info.backgroundColor}}>{message.text}</p>}
                {/* Minimal Skeleton */}
                <div style={styles.detailCard}>
                    <div style={styles.skeletonImage}></div>
                    <div style={styles.contentSection}>
                        <div style={{...styles.skeletonText, width: '80%'}}></div>
                        <div style={{...styles.skeletonText, width: '50%', height: '1.5rem', margin: '1rem 0'}}></div>
                        <div style={{...styles.skeletonText, width: '90%'}}></div>
                        <div style={{...styles.skeletonText, width: '70%'}}></div>
                        <div style={styles.skeletonButton}></div>
                    </div>
                </div>
            </div>
        );
    }

    const { make, model, year, color, mileage, image_url, endTime } = vehicleDetails;
    const isExpired = getTimeRemaining(endTime).expired;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Bidding on {year} {make} {model}</h1>
            <p style={styles.subHeader}>Auction ID: {auctionId} | Vehicle ID: {vehicleId}</p>

            {message.text && (
                <div style={{
                    ...styles.message,
                    backgroundColor: styles.message[message.type]?.backgroundColor || styles.message.info.backgroundColor,
                    color: styles.message[message.type]?.color || styles.message.info.color
                }}>
                    {message.text}
                </div>
            )}

            <div style={styles.detailCard}>
                {/* Vehicle Image */}
                <img
                    src={image_url || 'https://placehold.co/800x600/94a3b8/FFFFFF?text=Vehicle+Image'}
                    alt={`${year} ${make} ${model}`}
                    style={styles.image}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/94a3b8/FFFFFF?text=Image+Error'; }}
                />

                <div style={styles.contentSection}>
                    <div style={styles.detailsGroup}>
                        <p style={styles.detailItem}><strong>Make:</strong> {make}</p>
                        <p style={styles.detailItem}><strong>Model:</strong> {model}</p>
                        <p style={styles.detailItem}><strong>Year:</strong> {year}</p>
                        <p style={styles.detailItem}><strong>Color:</strong> {color}</p>
                        <p style={styles.detailItem}><strong>Mileage:</strong> {mileage?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <div style={styles.auctionInfo}>
                        <h2 style={styles.currentBid}>Current Highest Bid: <span style={styles.bidAmountText}>{formatCurrency(currentHighestBid)}</span></h2>
                        <div style={styles.timerBox}>
                            <p style={styles.timerLabel}>Auction Ends:</p>
                            <p style={styles.timerTime}>{formatDate(endTime)}</p>
                            <Timer endTime={endTime} />
                        </div>
                    </div>

                    {/* Bidding Form */}
                    <form onSubmit={handlePlaceBid} style={styles.bidForm}>
                        <label style={styles.label}>Your Bid Amount (Must be higher than {formatCurrency(currentHighestBid)}):</label>
                        <input
                            type="number"
                            value={newBidAmount}
                            onChange={(e) => setNewBidAmount(e.target.value)}
                            min={currentHighestBid + 1}
                            step="100"
                            required
                            disabled={isExpired}
                            style={styles.input}
                        />
                        <button
                            type="submit"
                            style={{ ...styles.bidButton, ...(isExpired ? styles.bidButtonDisabled : {}) }}
                            disabled={isExpired}
                        >
                            {isExpired ? 'Auction Closed' : `Place Bid of ${formatCurrency(newBidAmount)}`}
                        </button>
                    </form>

                    <button style={styles.backButton} onClick={() => navigate('/auctions')}>
                        ← Back to Auctions
                    </button>
                </div>
            </div>
        </div>
    );
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
      backgroundColor: hours === 0 && minutes < 10 ? '#f87171' : (expired ? '#9ca3af' : '#10b981'),
      fontSize: '1rem',
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


// --- Styles ---
const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
    },
    header: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#1a202c',
        textAlign: 'center',
        marginBottom: '0.5rem',
    },
    subHeader: {
        fontSize: '1rem',
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: '2rem',
    },
    detailCard: {
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Responsive for desktop
        '@media (min-width: 768px)': {
            flexDirection: 'row',
        },
    },
    image: {
        width: '100%',
        height: '350px',
        objectFit: 'cover',
        borderBottom: '1px solid #e2e8f0',
        // Responsive for desktop
        '@media (min-width: 768px)': {
            width: '50%',
            height: 'auto',
            borderBottom: 'none',
            borderRight: '1px solid #e2e8f0',
        },
    },
    contentSection: {
        padding: '2rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        // Responsive for desktop
        '@media (min-width: 768px)': {
            width: '50%',
        },
    },
    detailsGroup: {
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem',
    },
    detailItem: {
        fontSize: '1rem',
        color: '#374151',
        marginBottom: '0.5rem',
    },
    auctionInfo: {
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    currentBid: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1f2937',
    },
    bidAmountText: {
        color: '#ef4444',
        fontWeight: '700',
    },
    timerBox: {
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
    },
    timerLabel: {
        fontSize: '0.9rem',
        color: '#4b5563',
        marginBottom: '0.25rem',
    },
    timerTime: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '0.5rem',
    },
    timer: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        transition: 'background-color 0.3s',
    },
    bidForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    label: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
    },
    input: {
        padding: '0.75rem',
        border: '2px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '1.2rem',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    bidButton: {
        padding: '1rem 2rem',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1.2rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '0.5rem',
    },
    bidButtonDisabled: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
    },
    backButton: {
        marginTop: '1.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: '#4f46e5',
        border: '1px solid #4f46e5',
        borderRadius: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    // Messages
    message: {
        padding: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        marginBottom: '1rem',
        fontWeight: '600',
        info: {
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
        },
        success: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
        },
        error: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
        }
    },
    // Skeletons
    skeletonImage: {
        width: '100%',
        height: '350px',
        backgroundColor: '#e5e7eb',
        borderRadius: '1rem 1rem 0 0',
        '@media (min-width: 768px)': {
            width: '50%',
            height: 'auto',
            borderRadius: '1rem 0 0 1rem',
        },
    },
    skeletonText: {
        height: '1.25rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '0.75rem',
    },
    skeletonButton: {
        height: '3rem',
        backgroundColor: '#9ca3af',
        borderRadius: '0.5rem',
        marginTop: '1rem',
        width: '100%',
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        gap: '1.5rem',
        textAlign: 'center',
        backgroundColor: '#fee2e2',
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
        fontSize: '1.5rem',
        color: '#dc2626',
        fontWeight: '700',
    },
};

export default Bidding;
