import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function Login({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for hardcoded admin credentials (fix typo in email)
    if (email === 'admin@gmail.com' && password === 'Teja@2142') {
      localStorage.setItem('authToken', 'admin-token');
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin', password }));
      setRedirectTo('/Admin');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        email,
        password,
      });

      const { token, user } = response.data;
      // Ensure user object has a role property for admin check
      if (user && user.isAdmin) {
        user.role = 'admin';
      }
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setRedirectTo('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    setShowOTPModal(true);
  };

  const handleSendOTP = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/users/password-reset', {
        username: emailOrUsername,
      });
      setOtp(res.data.otp);
      setShowOTPModal(false);
      setShowNewPasswordModal(true);
    } catch (err) {
      setError('Failed to send OTP.');
    }
  };

  const handlePasswordChange = async () => {
    if (otp !== enteredOtp) {
      setError('OTP does not match.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/users/password-reset/confirm', {
        username: emailOrUsername,
        new_password: newPassword,
      });
      setShowNewPasswordModal(false);
      alert('Password changed successfully.');
    } catch (err) {
      setError('Failed to reset password.');
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to top right, #cfe2ff, white, #e0c3fc)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#1f2937' }}>Welcome Back</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Email</label>
            <input
              type="email"
              style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Password</label>
            <input
              type="password"
              style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '0.5rem', fontSize: '14px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '0.5rem 1rem', color: 'white', backgroundColor: '#3b82f6', borderRadius: '0.5rem', transition: 'background-color 0.2s' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '14px', color: '#4b5563' }}>
            <button
              type="button"
              onClick={handlePasswordReset}
              style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot password?
            </button>
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setRedirectTo('/Register')}
                style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register here
              </button>
            </span>
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => setShowOTPModal(false)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Reset Password</h3>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
            <button
              onClick={handleSendOTP}
              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: '0.5rem' }}
            >
              Send OTP
            </button>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => setShowNewPasswordModal(false)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Enter OTP & New Password</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
            <button
              onClick={handlePasswordChange}
              style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '0.5rem' }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
