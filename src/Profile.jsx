import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// --- Icon Components (Lucide/Font Awesome style placeholders) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-5.6-5.6A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.18 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;


// --- JWT Decoding Utility ---
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

// Helper to safely access nested data
const getField = (data, fallback = 'N/A') => data || fallback;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' }); // type: success/error

  // Profile API Endpoint structure
  const profileApiBaseUrl = 'https://api.b2a2cars.com/api/users/accounts/';

  const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  const fetchProfile = async (userId, token) => {
      try {
        // Construct the specific API URL for the user's ID
        const profileApiUrl = `${profileApiBaseUrl}${userId}/`;
        
        console.log(`Attempting to fetch profile from URL: ${profileApiUrl}`);

        const response = await axios.get(profileApiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        const profileData = response.data;
        setProfile(profileData);
        
        // Initialize form data with fetched profile details
        setFormData({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            email: profileData.email || '',
            mobile: profileData.mobile || '',
            country: profileData.country || '',
            state: profileData.state || '',
            address: profileData.address || '',
            zip_code: profileData.zip_code || '',
            dob: profileData.dob || '',
            gender: profileData.gender || '',
            language: profileData.language || '',
            currency: profileData.currency || '',
        });

      } catch (err) {
        console.error("Profile fetch error:", err);
        const errorMessage = err.response?.data?.detail || 'Failed to fetch profile data. Please try logging in again.';
        setError(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
            handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError('You are not logged in. Please sign in to view your profile.');
      setLoading(false);
      setIsLoggedOut(true);
      return;
    }

    const payload = decodeJWT(token);
    const userId = payload?.user_id;
    
    if (!userId) {
        setError('Authorization token is invalid or missing user ID.');
        setLoading(false);
        return;
    }

    fetchProfile(userId, token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setIsLoggedOut(true);
  };

  const toggleEdit = () => {
    // Reset file selection and status message when switching modes
    setSelectedFile(null);
    setUpdateStatus({ message: '', type: '' });
    // If exiting edit mode, reset form data to current profile data
    if (isEditing) {
        setFormData({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            mobile: profile.mobile || '',
            country: profile.country || '',
            state: profile.state || '',
            address: profile.address || '',
            zip_code: profile.zip_code || '',
            dob: profile.dob || '',
            gender: profile.gender || '',
            language: profile.language || '',
            currency: profile.currency || '',
        });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateStatus({ message: '', type: '' });
    const token = getAuthToken();
    const payload = decodeJWT(token);
    const userId = payload?.user_id;

    if (!userId) {
        setUpdateStatus({ message: 'User ID not found for update.', type: 'error' });
        setIsSubmitting(false);
        return;
    }

    const profileApiUrl = `${profileApiBaseUrl}${userId}/`;
    
    // Create FormData for mixed content (text fields and file upload)
    const data = new FormData();
    let hasChanges = false;

    // Iterate over form data and append only changed fields to FormData
    // The API uses 'form-data', so we must use FormData object.
    Object.keys(formData).forEach(key => {
        // Ensure both values are coerced to empty string if null or undefined to safely call .toString()
        const formValue = formData[key] ?? '';
        const profileValue = profile[key] ?? '';

        // Check for difference (case-insensitive for strings)
        if (formValue.toString() !== profileValue.toString()) {
            data.append(key, formValue);
            hasChanges = true;
        }
    });

    // Handle profile picture upload
    if (selectedFile) {
        data.append('profile_pic', selectedFile);
        hasChanges = true;
    }

    if (!hasChanges) {
        setUpdateStatus({ message: 'No changes detected to update.', type: 'error' });
        setIsSubmitting(false);
        return;
    }

    try {
        // We use PATCH for partial updates, as it is more robust for a general profile form.
        const response = await axios.patch(profileApiUrl, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Note: axios/browser automatically sets the Content-Type to 'multipart/form-data'
                // when a FormData object is passed, including the boundary.
                'accept': 'application/json',
            },
        });

        // Update local state with the new profile data
        setProfile(response.data);
        // Also update form data to reflect latest successful save
        setFormData({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            email: response.data.email || '',
            mobile: response.data.mobile || '',
            country: response.data.country || '',
            state: response.data.state || '',
            address: response.data.address || '',
            zip_code: response.data.zip_code || '',
            dob: response.data.dob || '',
            gender: response.data.gender || '',
            language: response.data.language || '',
            currency: response.data.currency || '',
        });
        setSelectedFile(null); // Clear selected file after successful upload
        
        setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false); // Exit edit mode on success

    } catch (err) {
        console.error("Profile update error:", err);
        const errorDetail = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Failed to update profile. Please check your inputs.';
        setUpdateStatus({ message: errorDetail, type: 'error' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoggedOut) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-card">
            <div className="spinner"></div>
            <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Function to determine profile picture URL
  const getProfilePicUrl = (pic) => {
    if (pic && typeof pic === 'string' && (pic.startsWith('http') || pic.startsWith('/'))) {
      return pic;
    }
    // Fallback placeholder image URL
    return 'https://placehold.co/128x128/9CA3AF/FFFFFF?text=P';
  };

  // Profile data displayed in view mode
  const profileItems = profile ? [
    { label: 'First Name', value: getField(profile.first_name), icon: <UserIcon /> },
    { label: 'Last Name', value: getField(profile.last_name), icon: <UserIcon /> },
    { label: 'Email', value: getField(profile.email), icon: <MailIcon /> },
    { label: 'Mobile Number', value: getField(profile.mobile), icon: <PhoneIcon /> },
    { label: 'Country', value: getField(profile.country), icon: <GlobeIcon /> },
    { label: 'State/Province', value: getField(profile.state), icon: <MapPinIcon /> },
    { label: 'Address', value: getField(profile.address), icon: <MapPinIcon /> },
    { label: 'ZIP Code', value: getField(profile.zip_code), icon: <MapPinIcon /> },
    { label: 'Date of Birth', value: getField(profile.dob), icon: <CalendarIcon /> },
    { label: 'Gender', value: getField(profile.gender), icon: <UserIcon /> },
    { label: 'Language', value: getField(profile.language), icon: <GlobeIcon /> },
    { label: 'Currency', value: getField(profile.currency), icon: <GlobeIcon /> },
  ].filter(item => item.value !== 'N/A') : [];

  const fullName = `${getField(profile?.first_name, '')} ${getField(profile?.last_name, '')}`.trim() || 'Guest User';
  
  // RENDER FORM (Edit Mode)
  const ProfileForm = () => (
    <form onSubmit={handleUpdateProfile} className="profile-form">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile Details</h3>
        
        {/* Status Message */}
        {updateStatus.message && (
            <div className={`status-message ${updateStatus.type === 'success' ? 'success' : 'error'}`}>
                {updateStatus.message}
            </div>
        )}

        <div className="form-grid">
            {/* First Name */}
            <div className="input-group">
                <label htmlFor="first_name">First Name *</label>
                <input type="text" id="first_name" name="first_name" required maxLength="30"
                       value={formData.first_name} onChange={handleInputChange} />
            </div>
            {/* Last Name */}
            <div className="input-group">
                <label htmlFor="last_name">Last Name *</label>
                <input type="text" id="last_name" name="last_name" required maxLength="30"
                       value={formData.last_name} onChange={handleInputChange} />
            </div>
            {/* Email */}
            <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required
                       value={formData.email} onChange={handleInputChange} />
            </div>
            {/* Mobile */}
            <div className="input-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input type="tel" id="mobile" name="mobile" required maxLength="15"
                       value={formData.mobile} onChange={handleInputChange} />
            </div>
            {/* DOB */}
            <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob"
                       value={formData.dob} onChange={handleInputChange} />
            </div>
            {/* Gender */}
            <div className="input-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            {/* Country */}
            <div className="input-group">
                <label htmlFor="country">Country</label>
                <input type="text" id="country" name="country" maxLength="50"
                       value={formData.country} onChange={handleInputChange} />
            </div>
            {/* State */}
            <div className="input-group">
                <label htmlFor="state">State/Province</label>
                <input type="text" id="state" name="state" maxLength="50"
                       value={formData.state} onChange={handleInputChange} />
            </div>
            {/* Address */}
            <div className="input-group full-width">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" maxLength="200"
                       value={formData.address} onChange={handleInputChange} />
            </div>
            {/* Zip Code */}
            <div className="input-group">
                <label htmlFor="zip_code">Zip Code</label>
                <input type="text" id="zip_code" name="zip_code" maxLength="10"
                       value={formData.zip_code} onChange={handleInputChange} />
            </div>
            {/* Language */}
            <div className="input-group">
                <label htmlFor="language">Language</label>
                <input type="text" id="language" name="language" maxLength="50"
                       value={formData.language} onChange={handleInputChange} />
            </div>
            {/* Currency */}
            <div className="input-group">
                <label htmlFor="currency">Currency</label>
                <input type="text" id="currency" name="currency" maxLength="10"
                       value={formData.currency} onChange={handleInputChange} />
            </div>

            {/* Profile Picture Upload */}
            <div className="input-group full-width">
                <label htmlFor="profile_pic">Profile Picture (Max 2MB)</label>
                <input type="file" id="profile_pic" name="profile_pic" accept="image/*" onChange={handleFileChange} />
                {selectedFile && <p className="text-sm mt-1 text-gray-600">Selected: {selectedFile.name}</p>}
                {!selectedFile && profile?.profile_pic && <p className="text-sm mt-1 text-gray-600">Current picture saved.</p>}
            </div>
        </div>

        <div className="form-actions">
            <button
                type="submit"
                className="save-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : <><SaveIcon /> Save Changes</>}
            </button>
            <button
                type="button"
                className="cancel-btn"
                onClick={toggleEdit}
                disabled={isSubmitting}
            >
                <XIcon /> Cancel
            </button>
        </div>
    </form>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          :root {
            --primary-color: #3b82f6; /* Blue 500 */
            --primary-hover: #2563eb; /* Blue 600 */
            --text-color: #1f2937; /* Gray 800 */
            --light-gray: #f9fafb; /* Gray 50 */
            --border-color: #d1d5db; /* Gray 300 */
            --error-color: #ef4444; /* Red 500 */
            --success-color: #10b981; /* Emerald 500 */
            --card-bg: #ffffff;
            --secondary-text: #6b7280;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--light-gray);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .profile-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 2rem 1rem;
            min-height: 100vh;
          }

          .profile-card {
            background: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
            transition: all 0.3s ease;
          }

          /* --- Header Section --- */
          .profile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            position: relative;
          }

          .edit-btn {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            font-weight: 600;
          }
          .edit-btn:hover {
            background-color: #eff6ff; /* Blue 50 */
          }
          .edit-btn svg {
            margin-right: 0.5rem;
          }


          .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--primary-color);
            margin-bottom: 1rem;
            transition: transform 0.3s ease;
          }

          .profile-pic:hover {
            transform: scale(1.05);
          }

          .profile-header h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-color);
            margin: 0;
          }

          .profile-header p {
            color: var(--secondary-text);
            margin: 0.5rem 0 0;
            font-size: 0.875rem;
          }

          /* --- Details Grid (View Mode) --- */
          .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .detail-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--light-gray);
          }

          .detail-icon {
            color: var(--primary-color);
            margin-right: 1rem;
            width: 24px;
            height: 24px;
            min-width: 24px;
          }

          .detail-content {
            flex-grow: 1;
          }

          .detail-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--secondary-text);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.25rem;
          }

          .detail-value {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-color);
            word-break: break-word;
          }

          /* --- Form Styling (Edit Mode) --- */
          .profile-form {
            padding: 0.5rem 0;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
          }

          .full-width {
            grid-column: 1 / -1;
          }
          
          .input-group label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 0.5rem;
          }
          
          .input-group input:not([type="file"]), 
          .input-group select {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
            color: var(--text-color);
            background-color: var(--light-gray);
          }

          .input-group input:focus,
          .input-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            background-color: var(--card-bg);
          }

          .input-group input[type="file"] {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 0.5rem;
          }

          .form-actions {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
          }

          .save-btn, .cancel-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .save-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
          }

          .save-btn:hover:not(:disabled) {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
          }

          .save-btn:disabled {
            background-color: #93c5fd; /* Blue 300 */
            cursor: not-allowed;
          }

          .cancel-btn {
            background-color: #f3f4f6; /* Gray 100 */
            color: var(--text-color);
            border: 1px solid var(--border-color);
          }

          .cancel-btn:hover:not(:disabled) {
            background-color: #e5e7eb; /* Gray 200 */
            transform: translateY(-2px);
          }

          /* --- Footer and Logout --- */
          .profile-footer {
            margin-top: 2rem;
            text-align: center;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
          }

          .logout-btn {
            background-color: var(--error-color);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
          }

          .logout-btn:hover {
            background-color: #b91c1c; /* Red 700 */
            transform: translateY(-2px);
          }

          .logout-btn:active {
            transform: translateY(0);
          }

          /* --- Error, Success & Loading --- */
          .error-message, .loading-card {
            padding: 1.5rem;
            border-radius: 12px;
            background-color: #fff5f5;
            color: var(--error-color);
            border: 1px solid #fee2e2;
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          
          .status-message {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-weight: 500;
          }

          .status-message.success {
            background-color: #d1fae5; /* Emerald 100 */
            color: var(--success-color);
            border: 1px solid #a7f3d0;
          }

          .status-message.error {
            background-color: #fee2e2; /* Red 100 */
            color: var(--error-color);
            border: 1px solid #fecaca;
          }

          .loading-card {
            background-color: #eff6ff;
            color: var(--primary-color);
            border: 1px solid #dbeafe;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .spinner {
            border: 4px solid var(--primary-color);
            border-top: 4px solid var(--light-gray);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive Adjustments */
          @media (max-width: 640px) {
            .profile-card {
                padding: 1.5rem;
            }
            .details-grid {
                grid-template-columns: 1fr;
            }
            .form-grid {
                grid-template-columns: 1fr;
            }
            .form-actions {
                flex-direction: column-reverse;
            }
          }
        `}
      </style>

      <div className="profile-container">
        {error && <div className="error-message">{error}</div>}

        {profile && (
            <div className="profile-card">
              <div className="profile-header">
                <img
                    src={getProfilePicUrl(profile.profile_pic)}
                    alt="Profile Picture"
                    className="profile-pic"
                    onError={(e) => {
                        e.target.onerror = null; // prevents infinite loop
                        e.target.src = 'https://placehold.co/100x100/9CA3AF/FFFFFF?text=P';
                    }}
                />
                <h2>{fullName}</h2>
                <p>User ID: <span style={{fontSize: '0.8rem', fontWeight: '500'}}>{getField(profile.id, 'N/A')}</span></p>

                <button onClick={toggleEdit} className="edit-btn">
                    {isEditing ? <XIcon /> : <EditIcon />}
                    {isEditing ? 'Exit Edit Mode' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                  <ProfileForm />
              ) : (
                  <>
                    {updateStatus.message && (
                        <div className={`status-message ${updateStatus.type === 'success' ? 'success' : 'error'}`}>
                            {updateStatus.message}
                        </div>
                    )}
                    <div className="details-grid">
                        {profileItems.map((item, index) => (
                        <div key={index} className="detail-item">
                            <span className="detail-icon">{item.icon}</span>
                            <div className="detail-content">
                            <div className="detail-label">{item.label}</div>
                            <div className="detail-value">{item.value}</div>
                            </div>
                        </div>
                        ))}
                    </div>
                  </>
              )}

              <div className="profile-footer">
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logout
                </button>
              </div>
            </div>
        )}
      </div>
    </>
  );
}
