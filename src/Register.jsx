import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaYahoo } from 'react-icons/fa';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        mobile,
        full_name: fullName,
        password,
      });

      setSuccessMessage("Registration successful. Redirecting to login...");
      setTimeout(() => setRedirectToLogin(true), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    }
  };

  const handleSocialSignup = (provider) => {
    window.location.href = `http://localhost:5000/api/users/auth/${provider}`;
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to top right, #fdf2e9, white, #e0f7fa)' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#1f2937' }}>Create Account</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />

          {error && <div style={errorStyle}>{error}</div>}
          {successMessage && <div style={successStyle}>{successMessage}</div>}

          <button type="submit" style={submitButtonStyle}>Register</button>

          <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '0.5rem', color: '#6b7280' }}>or</div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" style={socialButtonStyle} onClick={() => handleSocialSignup('google')}><FaGoogle style={{ marginRight: '0.5rem' }} /> Gmail</button>
            <button type="button" style={socialButtonStyle} onClick={() => handleSocialSignup('facebook')}><FaFacebookF style={{ marginRight: '0.5rem' }} /> Facebook</button>
            <button type="button" style={socialButtonStyle} onClick={() => handleSocialSignup('yahoo')}><FaYahoo style={{ marginRight: '0.5rem' }} /> Yahoo</button>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setRedirectToLogin(true)}
              style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {padding: '0.5rem 1rem', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '0.5rem',outline: 'none',color: '#374151',};

const submitButtonStyle = { width: '100%', padding: '0.5rem 1rem', color: 'white', backgroundColor: '#10b981', borderRadius: '0.5rem', transition: 'background-color 0.2s', cursor: 'pointer', border: 'none',};

const errorStyle = {
  padding: '0.5rem',
  fontSize: '14px',
  color: '#b91c1c',
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a5',
  borderRadius: '0.5rem',};

const successStyle = {
  padding: '0.5rem',
  fontSize: '14px',
  color: '#065f46',
  backgroundColor: '#d1fae5',
  border: '1px solid #6ee7b7',
  borderRadius: '0.5rem',
};

const socialButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.4rem 0.8rem',
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '500',
  color: '#374151',
  fontSize: '14px',
};
 