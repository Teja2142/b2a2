import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// --- SVG Icons ---
const FaUser = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>;
const FaEnvelope = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path></svg>;
const FaPhone = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg>;
const FaGlobe = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM88 240a152 152 0 0 1 53.8-113.5 156.8 156.8 0 0 1 111.3-43.3C293.5 125.5 352 195.9 352 280c0 48.2-21.7 90.3-55.7 119.2-34.2 29-79.3 44.9-129.2 44.9-52.9 0-100-18-135.5-47.5A152.1 152.1 0 0 1 88 240z"></path></svg>;
const FaMapMarkerAlt = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>;
const FaCalendar = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"></path></svg>;
const FaSave = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>;
const FaEdit = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>;

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

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    address: '',
    zipCode: '',
    gender: '',
    language: 'en',
    currency: 'USD',
    dob: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');

  // Animation states
  const [animationClass, setAnimationClass] = useState('');

  // Simulate loading user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockUserData = {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 1234567890',
          country: 'United States',
          state: 'California',
          address: '123 Main St, Los Angeles',
          zipCode: '90001',
          gender: 'male',
          language: 'en',
          currency: 'USD',
          dob: '1990-01-01',
        };
        setUserData(mockUserData);
        setOriginalData(mockUserData);
        setIsLoading(false);
        setAnimationClass('fade-in');
      }, 1000);
    };

    loadUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const selectedCountry = countryList.find(c => c.name === userData.country);
    
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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target.result);
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

    if (!validateEmail(userData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setOriginalData(userData);
      setIsEditing(false);
      setIsSaving(false);
      setSuccessMessage('Profile updated successfully!');
      setAnimationClass('success-pulse');
      
      setTimeout(() => {
        setAnimationClass('');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
    setError('');
    setAnimationClass('slide-out');
    setTimeout(() => setAnimationClass(''), 300);
  };

  const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalData);

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className={`profile-card ${animationClass}`}>
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" />
                ) : (
                  <FaUser />
                )}
              </div>
              {isEditing && (
                <label className="avatar-upload">
                  <input 
                    type="file" 
                    onChange={handleProfilePicChange} 
                    accept=".jpg,.jpeg,.png" 
                  />
                  <FaEdit />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1>{userData.fullName}</h1>
              <p>{userData.email}</p>
              <div className="profile-badge">Premium Member</div>
            </div>
          </div>
          
          <div className="action-buttons">
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

        <div className="profile-content">
          <div className="form-grid">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <FaUser />
                    <input 
                      type="text" 
                      value={userData.fullName} 
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
                      value={userData.email} 
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
                      value={userData.phone} 
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
                      value={userData.dob}
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
                    value={userData.gender} 
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
              </div>
            </div>

            {/* Location Information Section */}
            <div className="form-section">
              <h2>Location Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <div className="select-wrapper">
                    <FaGlobe />
                    <select 
                      value={userData.country} 
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
                <div className="form-group">
                  <label>State/Province</label>
                  <input 
                    type="text" 
                    value={userData.state} 
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    placeholder="California"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt />
                  <input 
                    type="text" 
                    value={userData.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="123 Main St, City"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip/Postal Code</label>
                  <input 
                    type="text" 
                    value={userData.zipCode} 
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    disabled={!isEditing}
                    placeholder="90001"
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="form-section">
              <h2>Preferences</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Language</label>
                  <select 
                    value={userData.language} 
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select 
                    value={userData.currency} 
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

          {error && <div className="error-message animate-shake">{error}</div>}
          {successMessage && <div className="success-message animate-bounce-in">{successMessage}</div>}
        </div>
      </div>

      <style jsx>{`
        .profile-container { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          padding: 2rem; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 100%;
        }

        .profile-card { 
          width: 90%; 
          max-width: 900px; 
          background: white; 
          border-radius: 1.5rem; 
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); 
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .expand-in {
          animation: expandIn 0.5s ease-out;
        }

        .slide-out {
          animation: slideOut 0.3s ease-in;
        }

        .success-pulse {
          animation: successPulse 2s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes expandIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }

        @keyframes successPulse {
          0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(72, 187, 120, 0); }
          100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          border: 4px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #48bb78;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s ease;
        }

        .avatar-upload:hover {
          transform: scale(1.1);
          background: #38a169;
        }

        .avatar-upload input {
          display: none;
        }

        .profile-info h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-info p {
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .profile-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .action-buttons {
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
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .save-btn {
          background: #48bb78;
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background: #38a169;
          transform: translateY(-2px);
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
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
        }

        .profile-content {
          padding: 2.5rem;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: #f8fafc;
          padding: 2rem;
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
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
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
          .profile-container { 
            padding: 1rem; 
          }
          .profile-card { 
            width: 95%; 
          }
          .profile-header {
            padding: 2rem 1.5rem;
            flex-direction: column;
            text-align: center;
          }
          .profile-avatar-section {
            flex-direction: column;
          }
          .profile-content {
            padding: 1.5rem;
          }
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
          .form-section {
            padding: 1.5rem;
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