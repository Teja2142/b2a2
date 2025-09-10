import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// SVG Icon Components to replace react-icons
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.2v2.7h5.1c-.2 1.6-1.2 2.8-2.8 3.8v2.4h3.1c1.8-1.7 2.9-4.2 2.9-7.2c0-.7-.1-1.3-.2-1.7z"/><path fill="currentColor" d="M12.15 22c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.5-1.9.9-3 .9c-2.3 0-4.2-1.6-4.9-3.7H3.9v2.5C5.4 20 8.5 22 12.15 22z"/><path fill="currentColor" d="M7.25 14.3c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V8.4H3.9C2.7 10.8 2.7 13.8 3.9 16l3.35-2.7z"/><path fill="currentColor" d="M12.15 5.6c1.3 0 2.5.5 3.4 1.4l2.7-2.7C16.6 2.2 14.5 1 12.15 1C8.5 1 5.4 3 3.9 6.6l3.35 2.7c.7-2.1 2.6-3.7 4.9-3.7z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3v9h4v-9z"/></svg>;
const YahooIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-.62 4.16h.89l1.45 3.84l1.45-3.84h.89l-1.9 5v3.68h-.88v-3.68l-1.9-5zM15 15.84h-1.5v-3.68h-.88v3.68H11v-4.5c0-.46.33-.84.75-.84h1.75c.41 0 .75.38.75.84v4.5z"/></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 8a7.97 7.97 0 0 0 .468 3.068c.552 1.035 1.218 1.65 1.887 1.855A6.97 6.97 0 0 0 8 15a6.97 6.97 0 0 0 .5-.002c.67-.204 1.335-.82 1.887-1.855A7.97 7.97 0 0 0 10.855 8a7.97 7.97 0 0 0-.468-3.068c-.552-1.035-1.218-1.65-1.887-1.855A6.97 6.97 0 0 0 8 1c-.18 0-.358.003-.5.002z"/></svg>;
const MapMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>;

// Data for countries and currencies
const countriesList = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
];

const currencyList = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'JPY', name: 'Japanese Yen' },
];


export default function Register() {
  const [userType, setUserType] = useState('customer'); // 'customer' or 'dealer'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [dob, setDob] = useState(''); // Use string for input[type=date]
  const [idFile, setIdFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }

    const formData = new FormData();
    formData.append('user_type', userType);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('country', country);
    if (dob) formData.append('dob', dob);
    
    if (userType === 'customer') {
      formData.append('state', state);
      formData.append('address', address);
      formData.append('zip_code', zipCode);
      formData.append('gender', gender);
    } else { // dealer
      formData.append('language', language);
      formData.append('currency', currency);
      if (idFile) formData.append('id_file', idFile);
      if (profilePic) formData.append('profile_pic', profilePic);
    }
    
    formData.append('password', password);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/users/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message || 'Registration successful!');
      setTimeout(() => setRedirectToLogin(true), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your input.');
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-header">
          <h2>Create an Account</h2>
          <div className="form-type-toggle">
            <button
              className={`toggle-btn ${userType === 'customer' ? 'active' : ''}`}
              onClick={() => setUserType('customer')}
            >
              Customer
            </button>
            <button
              className={`toggle-btn ${userType === 'dealer' ? 'active' : ''}`}
              onClick={() => setUserType('dealer')}
            >
              Dealer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="yourusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-address">Email Address</label>
            <input
              id="email-address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Phone Number</label>
            <input
              id="mobile"
              type="tel"
              placeholder="+11234567890"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <div className="select-wrapper">
              <span className="select-icon"><GlobeIcon /></span>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select your country</option>
                {countriesList.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="date-picker"
              max={new Date().toISOString().split("T")[0]} // Set max date to today
            />
          </div>


          {userType === 'customer' ? (
            <>
              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  id="state"
                  type="text"
                  placeholder="California"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <div className="input-with-icon">
                  <span className="input-icon"><MapMarkerIcon /></span>
                  <input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">Zip/Postal Code</label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder="90001"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {currencyList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>ID Document (pdf, jpg, png)</label>
                <div className="file-upload">
                  <label>
                    <span className="upload-icon"><UploadIcon /></span>
                    <span>{idFile ? idFile.name : 'Choose file...'}</span>
                    <input
                      type="file"
                      onChange={handleFileChange(setIdFile)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Profile Picture (jpg, png)</label>
                <div className="file-upload">
                  <label>
                    <span className="upload-icon"><UploadIcon /></span>
                    <span>{profilePic ? profilePic.name : 'Choose file...'}</span>
                    <input
                      type="file"
                      onChange={handleFileChange(setProfilePic)}
                      accept=".jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="xxxxxx"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="xxxxxx"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input
              id="terms-accepted"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms-accepted">
              I accept the <a href="#">terms and conditions</a>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn google">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="social-btn facebook">
            <FacebookIcon /> Facebook
          </button>
          <button type="button" className="social-btn yahoo">
            <YahooIcon /> Yahoo
          </button>
        </div>

        <div className="login-link">
          Already have an account?{' '}
          <button type="button" onClick={() => setRedirectToLogin(true)}>
            Log in
          </button>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          animation: gradientBG 15s ease infinite;
          background-size: 400% 400%;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .register-card {
          width: 100%;
          max-width: 600px;
          padding: 2.5rem;
          background: white;
          border-radius: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .register-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .form-type-toggle {
          display: flex;
          background: #edf2f7;
          border-radius: 0.5rem;
          padding: 0.25rem;
          margin: 0 auto;
          max-width: 300px;
        }

        .toggle-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          border-radius: 0.375rem;
          transition: all 0.3s ease;
        }

        .toggle-btn.active {
          background: #4299e1;
          color: white;
          box-shadow: 0 2px 5px rgba(66, 153, 225, 0.3);
        }

        .toggle-btn:not(.active):hover {
          background: rgba(66, 153, 225, 0.1);
          color: #2b6cb0;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }

        input, select, .date-picker {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #2d3748;
          background-color: #f8fafc;
          transition: all 0.3s ease;
        }

        input:focus, select:focus, .date-picker:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          background-color: white;
        }

        .select-wrapper {
          position: relative;
        }

        .select-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 10;
          display: flex;
          align-items: center;
        }

        .select-wrapper select {
          padding-left: 2.5rem;
          appearance: none;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 10;
          display: flex;
          align-items: center;
        }

        .input-with-icon input {
          padding-left: 2.5rem;
        }

        .file-upload {
          position: relative;
        }

        .file-upload label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border: 1px dashed #cbd5e0;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload label:hover {
          background-color: #edf2f7;
          border-color: #a0aec0;
        }

        .file-upload input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .upload-icon {
          color: #718096;
          display: flex;
          align-items: center;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
        }

        .checkbox-group input {
          width: auto;
          margin: 0;
        }

        .checkbox-group label {
          margin: 0;
          font-weight: 400;
        }

        .checkbox-group a {
          color: #4299e1;
          text-decoration: none;
          transition: color 0.2s;
        }

        .checkbox-group a:hover {
          color: #3182ce;
          text-decoration: underline;
        }

        .error-message {
          padding: 0.75rem;
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 0.5rem;
          color: #e53e3e;
          font-size: 0.875rem;
          animation: shake 0.5s ease;
        }

        .success-message {
          padding: 0.75rem;
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 0.5rem;
          color: #38a169;
          font-size: 0.875rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .submit-btn {
          padding: 0.875rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(66, 153, 225, 0.3);
        }

        .submit-btn:hover {
          background-color: #3182ce;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 5px rgba(66, 153, 225, 0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: #a0aec0;
          font-size: 0.875rem;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }

        .divider span {
          padding: 0 1rem;
        }

        .social-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background-color: white;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .social-btn.google {
          color: #DB4437;
          border-color: #fbd2d0;
        }

        .social-btn.google:hover {
          background-color: #fbd2d0;
        }

        .social-btn.facebook {
          color: #4267B2;
          border-color: #d6e0f7;
        }

        .social-btn.facebook:hover {
          background-color: #d6e0f7;
        }

        .social-btn.yahoo {
          color: #720e9e;
          border-color: #e8d0f1;
        }

        .social-btn.yahoo:hover {
          background-color: #e8d0f1;
        }

        .login-link {
          text-align: center;
          font-size: 0.875rem;
          color: #718096;
        }

        .login-link button {
          background: none;
          border: none;
          color: #4299e1;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }

        .login-link button:hover {
          color: #3182ce;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .register-container {
            padding: 1rem;
          }

          .register-card {
            padding: 1.5rem;
          }

          .form-row {
            flex-direction: column;
            gap: 1.25rem;
          }

          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

