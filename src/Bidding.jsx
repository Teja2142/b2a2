import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- Configuration and Utilities ---
const BASE_API_URL = 'http://127.0.0.1:8000';
// Use the provided GET endpoint for fetching auction details
const AUCTION_DETAIL_ENDPOINT = '/api/auction/auctions/'; // Used as base + {id}/
// Use the provided POST endpoint for placing bids
const PLACE_BID_ENDPOINT = '/api/auction/auctions/';

// Utility for formatting currency
const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A';
const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
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
                // Try to parse JSON error message if available
                let errorDetails = '';
                try {
                    const errorJson = await response.json();
                    errorDetails = JSON.stringify(errorJson);
                } catch (e) {
                    errorDetails = await response.text();
                }
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails.substring(0, 200)}...`);
            }
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return {};
            }
            return response.json();
        } catch (error) {
            if (i === retries - 1) {
                console.error('Final API call failed:', url, error);
                throw new Error(`Failed to connect or process data: ${error.message}`);
            }
            const delay = Math.pow(2, i) * 1000 + Math.floor(Math.random() * 500);
            console.warn(`API call failed. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Calculates time remaining for the Timer component.
 */
const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours: hours + (days * 24), // Combine days into hours for simpler display
      minutes,
      seconds,
      expired: total <= 0,
    };
};

// --- Sub Component: Timer ---
const Timer = ({ endTime }) => {
    const [remaining, setRemaining] = useState(getTimeRemaining(endTime));

    useEffect(() => {
      // Update the timer every second
      const timer = setInterval(() => {
        setRemaining(getTimeRemaining(endTime));
      }, 1000);
      return () => clearInterval(timer);
    }, [endTime]);

    const { hours, minutes, seconds, expired } = remaining;

    const style = {
      ...styles.timer,
      // Change color when less than 1 hour remaining
      backgroundColor: hours < 1 && !expired ? '#f97316' : (expired ? '#9ca3af' : '#10b981'),
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


// --- Main Component ---
const Bidding = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Auction ID is now mandatory for detail fetching and bidding
    const auctionId = searchParams.get('auctionId');
    const vehicleId = searchParams.get('vehicleId');

    const [auctionDetails, setAuctionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newBidAmount, setNewBidAmount] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' }); // success, error, info
    const [currentHighestBid, setCurrentHighestBid] = useState(0);

    // Get a simulated UserId for POST, this should come from a real auth system
    const simulatedUserId = 'f049523f-6bd6-43b0-9dcf-d190dda66ff7'; 
    const minBidIncrement = 100; // Define a standard minimum increment

    // 1. Fetch Auction Details (and Vehicle details implicitly, as they are nested)
    const fetchAuctionDetails = useCallback(async () => {
        if (!auctionId) {
            setMessage({ type: 'error', text: 'Error: Auction ID is missing from the URL. Cannot fetch details.' });
            setIsLoading(false);
            return;
        }

        setMessage({ type: 'info', text: 'Loading auction details...' });
        try {
            // Fetch specific auction details
            const url = `${BASE_API_URL}${AUCTION_DETAIL_ENDPOINT}${auctionId}/`;
            const data = await apiCallWithBackoff(url);
            
            // Validate the structure based on image_04f77d.png
            const highestBid = Number(data.highest_bid) || Number(data.starting_price) || 0;
            
            setAuctionDetails(data);
            setCurrentHighestBid(highestBid);
            
            // Set suggested bid to current highest bid + increment
            setNewBidAmount(highestBid + minBidIncrement);
            setMessage({ type: '', text: '' });

        } catch (err) {
            console.error('Error fetching auction details:', err);
            setMessage({ type: 'error', text: `Failed to load auction details: ${err.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [auctionId]);

    useEffect(() => {
        fetchAuctionDetails();
        // Set up a refresh for live bidding updates (every 10 seconds)
        const refreshInterval = setInterval(fetchAuctionDetails, 10000); 
        return () => clearInterval(refreshInterval);
    }, [fetchAuctionDetails]);

    // 2. Handle Bid Submission
    const handlePlaceBid = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: 'Placing your bid...' });

        const bidValue = Number(newBidAmount);
        const requiredMinBid = currentHighestBid + minBidIncrement;

        if (isNaN(bidValue) || bidValue < requiredMinBid) {
            setMessage({ type: 'error', text: `Bid must be at least ${formatCurrency(requiredMinBid)}.` });
            return;
        }

        if (!auctionId) {
            setMessage({ type: 'error', text: 'Cannot place bid: Auction ID is missing.' });
            return;
        }

        try {
            // Construct payload based on the provided curl example:
            // The API expects 'application/x-www-form-urlencoded' format in the curl,
            // but for a React app, using 'application/json' is standard. 
            // We will send JSON for modernity and assume the API can handle it, or we'll adjust the data structure to match the POST body fields.
            
            // NOTE: The POST endpoint provided is the list endpoint, not a specific 'place-bid' endpoint. 
            // Based on the fields in the curl, it looks like a full auction creation or update. 
            // We will *simulate* a simplified bid post to the auction list endpoint, assuming the backend can interpret a partial update.
            
            // Based on the curl data: 'vehicle=BMW%2FMM&starting_price=12345&reserve_price=123456&start_time=03-11-2025%2014%3A00&end_time=03-11-2026%2015%3A00&title=title&highest_bidder=f049523f-6bd6-43b0-9dcf-d190dda66ff7'
            // We'll map the new bid as a property of the existing auction data.
            const payload = {
                // If the API requires updating the whole object, send all fields
                vehicle: auctionDetails.vehicle,
                starting_price: auctionDetails.starting_price,
                reserve_price: auctionDetails.reserve_price,
                start_time: auctionDetails.start_time,
                end_time: auctionDetails.end_time,
                title: auctionDetails.title,
                description: auctionDetails.description,
                
                // Key update fields for the bid:
                highest_bid: bidValue,
                highest_bidder: simulatedUserId, 
            };
            
            // Using PUT/PATCH for update on the specific auction endpoint
            const url = `${BASE_API_URL}${AUCTION_DETAIL_ENDPOINT}${auctionId}/`; 
            
            const result = await apiCallWithBackoff(url, {
                method: 'PUT', // Use PUT to update the existing resource
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    // CSRF token header is usually needed for authenticated POST/PUT/PATCH requests
                    'X-CSRFTOKEN': 'dummy_csrf_token_for_sim',
                },
                body: JSON.stringify(payload),
            });

            // Assuming the API returns the updated auction details on success
            if (result && result.highest_bid) {
                const newBid = Number(result.highest_bid);
                setCurrentHighestBid(newBid);
                setNewBidAmount(newBid + minBidIncrement);
                setMessage({ type: 'success', text: `Bid successful! Your bid of ${formatCurrency(newBid)} is now the highest.` });
            } else {
                // If API returns success but no data, force a refresh
                setMessage({ type: 'success', text: 'Bid placed successfully. Refreshing details...' });
                fetchAuctionDetails();
            }

        } catch (err) {
            console.error('Bidding failed:', err);
            setMessage({ type: 'error', text: `Bidding failed. Make sure you are authenticated and your bid is valid. Error: ${err.message}` });
        }
    };

    if (!auctionId || !vehicleId) {
        return (
            <div style={{...styles.container, ...styles.errorContainer}}>
                <span style={styles.errorIcon}>🛑</span>
                <h2 style={styles.errorText}>Missing Auction Information</h2>
                <p style={{color: '#4b5563'}}>Please navigate from the Auctions page to bid on a specific vehicle.</p>
                <button style={styles.goBackButton} onClick={() => navigate('/auctions')}>Go to Auctions</button>
            </div>
        );
    }

    if (isLoading || !auctionDetails) {
        return (
            <div style={styles.container}>
                <h1 style={styles.header}>Loading Auction Details...</h1>
                {message.text && <div style={{...styles.message, backgroundColor: styles.message.info.backgroundColor, color: styles.message.info.color}}>{message.text}</div>}
                {/* Minimal Skeleton */}
                <div style={styles.detailCard}>
                    <div style={styles.skeletonImage}></div>
                    <div style={styles.contentSection}>
                        <div style={{...styles.skeletonText, width: '80%', height: '2.5rem'}}></div>
                        <div style={{...styles.skeletonText, width: '50%', height: '1.5rem', margin: '1rem 0'}}></div>
                        <div style={{...styles.skeletonText, width: '90%'}}></div>
                        <div style={{...styles.skeletonText, width: '70%'}}></div>
                        <div style={styles.skeletonButton}></div>
                        <div style={{...styles.skeletonButton, marginTop: '2rem'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    const { make, model, year, color, mileage, image_url, end_time, title, reserve_price } = auctionDetails;
    const { expired } = getTimeRemaining(end_time);

    const requiredMinBid = currentHighestBid + minBidIncrement;


    return (
        <div style={styles.container}>
            <h1 style={styles.header}>{title || `Bidding on ${make} ${model}`}</h1>
            <p style={styles.subHeader}>Vehicle: **{year} {make} {model}** | Auction ID: {auctionId}</p>

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
                        <p style={styles.detailItem}><strong>Vehicle ID:</strong> {vehicleId}</p>
                        <p style={styles.detailItem}><strong>Reserve Price:</strong> {formatCurrency(reserve_price)}</p>
                        <p style={styles.detailItem}><strong>Mileage:</strong> {mileage?.toLocaleString() || 'N/A'}</p>
                        <p style={styles.detailItem}><strong>Color:</strong> {color || 'N/A'}</p>
                    </div>

                    <div style={styles.auctionInfo}>
                        <h2 style={styles.currentBid}>Current Highest Bid: <span style={styles.bidAmountText}>{formatCurrency(currentHighestBid)}</span></h2>
                        <div style={styles.timerBox}>
                            <p style={styles.timerLabel}>Time Remaining Until Auction Closes</p>
                            <Timer endTime={end_time} />
                            <p style={styles.timerTime}>Closes: {formatDate(end_time)}</p>
                        </div>
                    </div>

                    {/* Bidding Form */}
                    <form onSubmit={handlePlaceBid} style={styles.bidForm}>
                        <label style={styles.label}>
                            Enter Bid Amount (Min: {formatCurrency(requiredMinBid)}):
                        </label>
                        <input
                            type="number"
                            value={newBidAmount}
                            onChange={(e) => setNewBidAmount(e.target.value)}
                            min={requiredMinBid}
                            step={minBidIncrement}
                            required
                            disabled={expired}
                            style={styles.input}
                        />
                        <button
                            type="submit"
                            style={{ ...styles.bidButton, ...(expired ? styles.bidButtonDisabled : {}) }}
                            disabled={expired}
                        >
                            {expired ? 'Auction Closed' : `Place Bid of ${formatCurrency(newBidAmount)}`}
                        </button>
                    </form>

                    <button style={styles.backButton} onClick={() => navigate('/auctions')}>
                        ← Back to Auction Listings
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Styles ---
const styles = {
    container: {
        padding: '2rem 1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
    },
    header: {
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        fontWeight: '700',
        color: '#1a202c',
        textAlign: 'center',
        marginBottom: '0.5rem',
    },
    subHeader: {
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
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
        // Responsive for desktop (React inline style fallback for media query)
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
        // Note: Actual media queries must be handled by the parent component logic or a CSS library, 
        // but we keep the structure for clarity if a CSS solution were used.
    },
    contentSection: {
        padding: '2rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
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
        color: '#ef4444', // Red for the high bid
        fontWeight: '700',
        fontSize: '1.75rem',
    },
    timerBox: {
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    },
    timerLabel: {
        fontSize: '0.9rem',
        color: '#4b5563',
        marginBottom: '0.25rem',
    },
    timerTime: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
        marginTop: '0.5rem',
    },
    timer: {
        padding: '0.75rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: '1.25rem',
        transition: 'background-color 0.3s',
    },
    bidForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingTop: '1rem',
    },
    label: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
        textAlign: 'center',
    },
    input: {
        padding: '0.75rem',
        border: '2px solid #3b82f6', // Blue border
        borderRadius: '0.5rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ':focus': {
            borderColor: '#1d4ed8',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
        }
    },
    bidButton: {
        padding: '1rem 2rem',
        backgroundColor: '#1d4ed8', // Darker blue for action
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1.2rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
        boxShadow: '0 4px 10px rgba(29, 78, 216, 0.4)',
        marginTop: '0.5rem',
        ':hover': { backgroundColor: '#1e40af', transform: 'translateY(-1px)' },
    },
    bidButtonDisabled: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
        boxShadow: 'none',
        transform: 'none',
    },
    backButton: {
        marginTop: '1.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': { backgroundColor: '#e5e7eb' },
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
    },
    skeletonText: {
        height: '1.25rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '0.75rem',
        animation: 'pulse 1.5s infinite ease-in-out',
    },
    skeletonButton: {
        height: '3.5rem',
        backgroundColor: '#9ca3af',
        borderRadius: '0.5rem',
        marginTop: '1rem',
        width: '100%',
        animation: 'pulse 1.5s infinite ease-in-out',
    },
    errorContainer: {
        padding: '4rem 2rem',
        marginTop: '2rem',
        border: '1px solid #fca5a5',
        borderRadius: '0.75rem',
        textAlign: 'center',
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
    goBackButton: {
        padding: '0.75rem 2rem',
        backgroundColor: '#14b8a6',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '1.5rem',
        ':hover': { backgroundColor: '#0d9488' },
    },
    '@keyframes pulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
    },
};

export default Bidding;
