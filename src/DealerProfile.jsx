import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icons ---
const FaUser = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>;
const FaEnvelope = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path></svg>;
const FaPhone = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg>;
const FaGlobe = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM88 240a152 152 0 0 1 53.8-113.5 156.8 156.8 0 0 1 111.3-43.3C293.5 125.5 352 195.9 352 280c0 48.2-21.7 90.3-55.7 119.2-34.2 29-79.3 44.9-129.2 44.9-52.9 0-100-18-135.5-47.5A152.1 152.1 0 0 1 88 240z"></path></svg>;
const FaMapMarkerAlt = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>;
const FaCalendar = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"></path></svg>;
const FaSave = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>;
const FaEdit = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>;
const FaBuilding = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z"></path></svg>;
const FaIdCard = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M528 32H48C21.5 32 0 53.5 0 80v16h576V80c0-26.5-21.5-48-48-48zM0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V128H0v304zm352-232c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v-16zM176 192c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM67.1 396.2C75.5 370.1 99.6 352 128 352h96c28.4 0 52.5 18.1 60.9 44.2 3.4 10.5-4.3 21.8-15.5 21.8H82.7c-11.2 0-18.9-11.3-15.6-21.8z"></path></svg>;
const FaChartLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path></svg>;
const FaUpload = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24z"></path></svg>;
const FaCheck = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>;

// --- Data ---
const countryList = [
    { name: 'United States', code: 'US', dialCode: '+1' },
    { name: 'Canada', code: 'CA', dialCode: '+1' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44' },
    { name: 'Australia', code: 'AU', dialCode: '+61' },
    { name: 'Germany', code: 'DE', dialCode: '+49' },
    { name: 'India', code: 'IN', dialCode: '+91' },
    { name: 'Japan', code: 'JP', dialCode: '+81' },
];

const currencyList = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
];

export default function DealerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Dealer data state
  const [dealerData, setDealerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    businessAddress: '',
    businessName: '',
    businessType: '',
    taxId: '',
    yearsInBusiness: '',
    website: '',
    language: 'en',
    currency: 'USD',
    dob: '',
    gender: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [idFilePreview, setIdFilePreview] = useState('');

  // Business stats
  const [businessStats, setBusinessStats] = useState({
    totalCars: 0,
    activeListings: 0,
    soldCars: 0,
    rating: 0,
    revenue: 0
  });

  // Animation states
  const [animationClass, setAnimationClass] = useState('');

  // Simulate loading dealer data
  useEffect(() => {
    const loadDealerData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockDealerData = {
          fullName: 'Michael Rodriguez',
          email: 'michael@prestigecars.com',
          phone: '+1 5550123456',
          country: 'United States',
          businessAddress: '123 Auto Plaza, Los Angeles, CA',
          businessName: 'Prestige Luxury Cars',
          businessType: 'luxury',
          taxId: '12-3456789',
          yearsInBusiness: '8',
          website: 'www.prestigecars.com',
          language: 'en',
          currency: 'USD',
          dob: '1980-05-15',
          gender: 'male',
        };
        setDealerData(mockDealerData);
        setOriginalData(mockDealerData);
        
        // Mock business stats
        setBusinessStats({
          totalCars: 47,
          activeListings: 23,
          soldCars: 124,
          rating: 4.8,
          revenue: 1250000
        });
        
        setIsLoading(false);
        setAnimationClass('fade-in-up');
      }, 1200);
    };

    loadDealerData();
  }, []);

  const handleInputChange = (field, value) => {
    setDealerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const selectedCountry = countryList.find(c => c.name === dealerData.country);
    
    if (selectedCountry && value.length < selectedCountry.dialCode.length + 1) {
      return;
    }
    
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    if (selectedCountry) {
      const phoneDigits = numbersOnly.slice(selectedCountry.dialCode.replace('+', '').length);
      if (phoneDigits.length <= 10) {
        handleInputChange('phone', selectedCountry.dialCode + ' ' + phoneDigits);
      }
    } else {
      if (numbersOnly.length <= 15) {
        handleInputChange('phone', numbersOnly);
      }
    }
  };

  const handleFileChange = (setter, setPreview) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    if (!validateEmail(dealerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!dealerData.businessName) {
      setError('Business name is required');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setOriginalData(dealerData);
      setIsEditing(false);
      setIsSaving(false);
      setSuccessMessage('Dealer profile updated successfully!');
      setAnimationClass('success-glow');
      
      setTimeout(() => {
        setAnimationClass('');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    setDealerData(originalData);
    setIsEditing(false);
    setError('');
    setAnimationClass('slide-out-right');
    setTimeout(() => setAnimationClass(''), 300);
  };

  const hasChanges = JSON.stringify(dealerData) !== JSON.stringify(originalData);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: dealerData.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="dealer-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dealer profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dealer-container">
      <div className={`dealer-card ${animationClass}`}>
        {/* Header Section */}
        <div className="dealer-header">
          <div className="dealer-identity">
            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Dealer" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                {isEditing && (
                  <label className="avatar-upload">
                    <input 
                      type="file" 
                      onChange={handleFileChange(setProfilePic, setProfilePicPreview)} 
                      accept=".jpg,.jpeg,.png" 
                    />
                    <FaEdit />
                  </label>
                )}
              </div>
              <div className="verification-badge">
                <FaCheck />
                <span>Verified Dealer</span>
              </div>
            </div>
            
            <div className="dealer-info">
              <h1>{dealerData.fullName}</h1>
              <p className="business-name">{dealerData.businessName}</p>
              <p className="dealer-email">{dealerData.email}</p>
              <div className="dealer-stats">
                <span className="stat">
                  <FaChartLine />
                  {businessStats.rating}/5 Rating
                </span>
                <span className="stat">
                  <FaBuilding />
                  {businessStats.yearsInBusiness} Years
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {!isEditing ? (
              <button 
                className="edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setAnimationClass('expand-in');
                }}
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-btn"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                >
                  {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Business Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon total-cars">
              <FaBuilding />
            </div>
            <div className="stat-info">
              <h3>{businessStats.totalCars}</h3>
              <p>Total Cars</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active-listings">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>{businessStats.activeListings}</h3>
              <p>Active Listings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon sold-cars">
              <FaCheck />
            </div>
            <div className="stat-info">
              <h3>{businessStats.soldCars}</h3>
              <p>Cars Sold</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(businessStats.revenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            Business Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="form-section personal-info">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <FaUser />
                      <input 
                        type="text" 
                        value={dealerData.fullName} 
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!isEditing}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <FaEnvelope />
                      <input 
                        type="email" 
                        value={dealerData.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <FaPhone />
                      <input 
                        type="tel" 
                        value={dealerData.phone} 
                        onChange={handlePhoneChange}
                        disabled={!isEditing}
                        placeholder="+1 1234567890"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <div className="input-with-icon">
                      <FaCalendar />
                      <input 
                        type="date"
                        value={dealerData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        disabled={!isEditing}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select 
                      value={dealerData.gender} 
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <div className="select-wrapper">
                      <FaGlobe />
                      <select 
                        value={dealerData.country} 
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="">Select your country</option>
                        {countryList.map((c) => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="form-section business-info">
              <h2>Business Information</h2>
              <div className="form-grid">
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Name</label>
                    <div className="input-with-icon">
                      <FaBuilding />
                      <input 
                        type="text" 
                        value={dealerData.businessName} 
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Business Type</label>
                    <select 
                      value={dealerData.businessType} 
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Select business type</option>
                      <option value="luxury">Luxury Vehicles</option>
                      <option value="family">Family Cars</option>
                      <option value="sports">Sports Cars</option>
                      <option value="commercial">Commercial Vehicles</option>
                      <option value="multi">Multi-Brand Dealer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Business Address</label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt />
                    <input 
                      type="text" 
                      value={dealerData.businessAddress} 
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      disabled={!isEditing}
                      placeholder="123 Business St, City, State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tax ID / EIN</label>
                    <input 
                      type="text" 
                      value={dealerData.taxId} 
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      disabled={!isEditing}
                      placeholder="12-3456789"
                    />
                  </div>
                  <div className="form-group">
                    <label>Years in Business</label>
                    <input 
                      type="number" 
                      value={dealerData.yearsInBusiness} 
                      onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                      disabled={!isEditing}
                      placeholder="5"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input 
                      type="url" 
                      value={dealerData.website} 
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="www.yourbusiness.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Currency</label>
                    <select 
                      value={dealerData.currency} 
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      disabled={!isEditing}
                    >
                      {currencyList.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="form-section documents">
              <h2>Business Documents</h2>
              <div className="documents-grid">
                <div className="document-upload">
                  <label>Dealer License</label>
                  <div className="file-upload-area">
                    <FaUpload />
                    <p>Upload your dealer license document</p>
                    <span>PDF, JPG, PNG (Max 5MB)</span>
                    <input 
                      type="file" 
                      onChange={handleFileChange(setIdFile, setIdFilePreview)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="document-upload">
                  <label>Business Registration</label>
                  <div className="file-upload-area">
                    <FaUpload />
                    <p>Upload business registration certificate</p>
                    <span>PDF, JPG, PNG (Max 5MB)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="document-upload">
                  <label>Tax Identification</label>
                  <div className="file-upload-area">
                    <FaUpload />
                    <p>Upload tax identification document</p>
                    <span>PDF, JPG, PNG (Max 5MB)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="document-upload">
                  <label>Insurance Certificate</label>
                  <div className="file-upload-area">
                    <FaUpload />
                    <p>Upload business insurance certificate</p>
                    <span>PDF, JPG, PNG (Max 5MB)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message animate-shake">{error}</div>}
        {successMessage && <div className="success-message animate-bounce-in">{successMessage}</div>}
      </div>

      <style jsx>{`
        .dealer-container { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          padding: 2rem; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 100%;
        }

        .dealer-card { 
          width: 95%; 
          max-width: 1200px; 
          background: white; 
          border-radius: 1.5rem; 
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15); 
          overflow: hidden;
          transition: all 0.4s ease;
        }

        /* Enhanced Animations */
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .expand-in {
          animation: expandIn 0.6s ease-out;
        }

        .slide-out-right {
          animation: slideOutRight 0.3s ease-in;
        }

        .success-glow {
          animation: successGlow 2s ease-in-out;
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(50px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes expandIn {
          from { 
            transform: scale(0.92); 
            opacity: 0; 
          }
          to { 
            transform: scale(1); 
            opacity: 1; 
          }
        }

        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }

        @keyframes successGlow {
          0% { 
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7),
                       0 25px 80px rgba(0, 0, 0, 0.15);
          }
          50% { 
            box-shadow: 0 0 0 20px rgba(72, 187, 120, 0.3),
                       0 30px 100px rgba(0, 0, 0, 0.2);
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0),
                       0 25px 80px rgba(0, 0, 0, 0.15);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Header Styles */
        .dealer-header {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          color: white;
          padding: 3rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }

        .dealer-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-20px, -20px) rotate(360deg); }
        }

        .dealer-identity {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          flex: 1;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-upload {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: #48bb78;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s ease;
        }

        .avatar-upload:hover {
          transform: scale(1.1) rotate(15deg);
          background: #38a169;
        }

        .avatar-upload input {
          display: none;
        }

        .verification-badge {
          background: rgba(72, 187, 120, 0.9);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .dealer-info h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .business-name {
          font-size: 1.4rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .dealer-email {
          opacity: 0.8;
          margin-bottom: 1rem;
        }

        .dealer-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .edit-btn, .save-btn, .cancel-btn {
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .save-btn {
          background: #48bb78;
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background: #38a169;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(72, 187, 120, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .cancel-btn {
          background: #e53e3e;
          color: white;
        }

        .cancel-btn:hover {
          background: #c53030;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(229, 62, 62, 0.3);
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
        }

        /* Stats Overview */
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          padding: 2rem 2.5rem;
          background: #f8fafc;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border-left: 4px solid #667eea;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .stat-icon.total-cars { background: #667eea; }
        .stat-icon.active-listings { background: #ed8936; }
        .stat-icon.sold-cars { background: #48bb78; }
        .stat-icon.revenue { background: #9f7aea; }

        .stat-info h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          color: #718096;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          background: #f1f5f9;
          padding: 0 2.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-btn {
          padding: 1.25rem 2rem;
          border: none;
          background: transparent;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          border-bottom: 3px solid transparent;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab-btn:hover:not(.active) {
          color: #475569;
          background: rgba(102, 126, 234, 0.1);
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          width: 0;
          height: 3px;
          background: #667eea;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .tab-btn.active::after {
          width: 100%;
        }

        /* Tab Content */
        .tab-content {
          padding: 2.5rem;
        }

        .form-section {
          background: #f8fafc;
          padding: 2.5rem;
          border-radius: 1rem;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }

        .form-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .form-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        input, select {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input:disabled, select:disabled {
          background: #f7fafc;
          color: #a0aec0;
          cursor: not-allowed;
        }

        .input-with-icon, .select-wrapper {
          position: relative;
        }

        .input-with-icon svg, .select-wrapper svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 1;
        }

        .input-with-icon input {
          padding-left: 2.75rem;
        }

        .select-wrapper select {
          padding-left: 2.75rem;
          width: 100%;
          appearance: none;
        }

        /* Documents Section */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .document-upload label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .file-upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #fafafa;
          position: relative;
          cursor: pointer;
        }

        .file-upload-area:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .file-upload-area svg {
          font-size: 2rem;
          color: #a0aec0;
          margin-bottom: 1rem;
        }

        .file-upload-area p {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .file-upload-area span {
          color: #718096;
          font-size: 0.875rem;
        }

        .file-upload-area input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 1rem;
          border-radius: 0.75rem;
          margin: 1rem 0;
          text-align: center;
          border-left: 4px solid #e53e3e;
        }

        .success-message {
          background: #c6f6d5;
          color: #276749;
          padding: 1rem;
          border-radius: 0.75rem;
          margin: 1rem 0;
          text-align: center;
          border-left: 4px solid #48bb78;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-left: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dealer-container { 
            padding: 1rem; 
          }
          .dealer-card { 
            width: 100%; 
          }
          .dealer-header {
            padding: 2rem 1.5rem;
            flex-direction: column;
            text-align: center;
          }
          .dealer-identity {
            flex-direction: column;
            align-items: center;
          }
          .dealer-stats {
            justify-content: center;
          }
          .stats-overview {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
          .tab-navigation {
            flex-direction: column;
            padding: 0;
          }
          .tab-content {
            padding: 1.5rem;
          }
          .form-section {
            padding: 1.5rem;
          }
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
          .documents-grid {
            grid-template-columns: 1fr;
          }
          .header-actions {
            width: 100%;
            justify-content: center;
          }
          .edit-actions {
            flex-direction: column;
            width: 100%;
          }
          .edit-btn, .save-btn, .cancel-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}