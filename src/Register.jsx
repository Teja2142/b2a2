import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaYahoo, FaUpload, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import currencies from 'currency-codes';
import { countries } from 'countries-list';

export default function Register() {
  const [formType, setFormType] = useState('customer'); // 'customer' or 'dealer'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [dob, setDob] = useState(null);
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
    formData.append('formType', formType);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('country', country);
    formData.append('address', address);
    formData.append('language', language);
    formData.append('currency', currency);
    if (dob) formData.append('dob', dob.toISOString().split('T')[0]);
    if (idFile) formData.append('idFile', idFile);
    if (profilePic) formData.append('profilePic', profilePic);
    formData.append('password', password);

    try {
      const response = await axios.post('/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message);
      setTimeout(() => setRedirectToLogin(true), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
              className={`toggle-btn ${formType === 'customer' ? 'active' : ''}`}
              onClick={() => setFormType('customer')}
            >
              Customer
            </button>
            <button
              className={`toggle-btn ${formType === 'dealer' ? 'active' : ''}`}
              onClick={() => setFormType('dealer')}
            >
              Dealer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Naveen Teja"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <div className="select-wrapper">
              <FaGlobe className="select-icon" />
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select your country</option>
                {countries && Object.entries(countries).map(([code, countryData]) => (
                  <option key={code} value={countryData.name}>
                    {countryData.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                id="address"
                type="text"
                placeholder="123 Main St, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
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
                required
              >
                {currencies.codes().slice(0, 50).map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencies.code(code).currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth (Optional)</label>
            <DatePicker
              id="dob"
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select date"
              className="date-picker"
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
            />
          </div>

          <div className="form-group">
            <label>ID Document</label>
            <div className="file-upload">
              <label>
                <FaUpload className="upload-icon" />
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
            <label>Profile Picture (Optional)</label>
            <div className="file-upload">
              <label>
                <FaUpload className="upload-icon" />
                <span>{profilePic ? profilePic.name : 'Choose file...'}</span>
                <input
                  type="file"
                  onChange={handleFileChange(setProfilePic)}
                  accept=".jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>

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
            <FaGoogle /> Google
          </button>
          <button type="button" className="social-btn facebook">
            <FaFacebookF /> Facebook
          </button>
          <button type="button" className="social-btn yahoo">
            <FaYahoo /> Yahoo
          </button>
        </div>

        <div className="login-link">
          Already have an account?{' '}
          <button type="button" onClick={() => setRedirectToLogin(true)}>
            Log in
          </button>
        </div>
      </div>

      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        
        .react-datepicker__input-container {
          width: 100%;
        }
      `}</style>

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
          width: 90%;
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