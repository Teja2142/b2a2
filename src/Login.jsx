import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

// Component for a custom modal message box
const MessageBox = ({ message, onClose }) => {
  return (
    <div style={styles.messageBoxOverlay}>
      <div style={styles.messageBoxContent}>
        <p>{message}</p>
        <button onClick={onClose} style={styles.messageBoxButton}>OK</button>
      </div>
    </div>
  );
};

// Inline CSS for the component
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to top right, #cfe2ff, white, #e0c3fc)',
    padding: '1rem',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  innerCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    textAlign: 'center',
    width: '100%',
  },
  rightPanel: {
    padding: '2rem',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.25rem',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    color: 'white',
    backgroundColor: '#3b82f6',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#3b82f6',
    fontSize: '14px',
    padding: 0,
  },
  error: {
    padding: '0.75rem',
    fontSize: '14px',
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '0.5rem',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  messageBoxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  messageBoxContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
  },
  messageBoxButton: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  },
  supportText: {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  helpText: {
    marginTop: '1.5rem',
  },
  loginTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  // Media queries for responsive design
  '@media (min-width: 768px)': {
    innerCard: {
      flexDirection: 'row',
    },
    leftPanel: {
      width: '50%',
    },
    rightPanel: {
      width: '50%',
    },
  },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messageBox, setMessageBox] = useState({ show: false, message: '' });
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for admin credentials
    if (email === 'admin@gmail.com' && password === 'Teja@2142') {
      localStorage.setItem('authToken', 'admin-token');
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
      setRedirectTo('/Admin');
      setLoading(false);
      return;
    }

    try {
      // ***FIX:*** Reverted to send `email` to match backend expectation.
      const response = await axios.post('http://localhost:8000/api/users/login/', {
        email: email, // Changed 'username' key back to 'email'
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout to prevent hanging
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setRedirectTo('/Auctions');
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.response?.status === 408) {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        const errorData = err.response?.data;
        if (errorData && errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else {
          setError(errorData?.detail || errorData?.message || 'Invalid email or password. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!emailOrUsername) {
      setError('Please enter your email or username');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/password-reset/', {
        username: emailOrUsername,
      }, {
        timeout: 10000,
      });
      
      if(response.status === 200) {
        setShowOTPModal(false);
        setShowNewPasswordModal(true);
        setError('');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Failed to send OTP. Please check your username/email.');
      }
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/password-reset/confirm/', {
        username: emailOrUsername,
        otp: enteredOtp,
        new_password: newPassword,
      }, {
        timeout: 10000,
      });
      
      if(response.status === 200) {
        setShowNewPasswordModal(false);
        setMessageBox({ show: true, message: 'Password changed successfully.' });
        setError('');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to reset password. Check your OTP.');
      }
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  const innerCardStyle = isMobile ? styles.innerCard : { ...styles.innerCard, flexDirection: 'row' };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={innerCardStyle}>
          {/* Left Panel - Support Card */}
          <div style={styles.leftPanel}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome Back</h2>
            <p style={styles.supportText}>
              We're glad to see you again. Log in to access your account and manage your dashboard. If you need any assistance, feel free to contact our support team.
            </p>
            <p style={styles.helpText}>
              <strong>Need help?</strong>
              <br />
              Email: support@b2a2cars.com
            </p>
          </div>

          {/* Right Panel - Login Form */}
          <div style={styles.rightPanel}>
            <h2 style={styles.loginTitle}>Login to Your Account</h2>
            <form style={styles.form} onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '14px', color: '#4b5563' }}>
                <button
                  type="button"
                  onClick={() => setShowOTPModal(true)}
                  style={styles.linkButton}
                >
                  Forgot password?
                </button>
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/Register')}
                    style={styles.linkButton}
                  >
                    Register here
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowOTPModal(false)} style={styles.closeButton}>&times;</button>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem' }}>Reset Password</h3>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>Enter your username or email to receive an OTP.</p>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSendOTP} style={styles.button}>Send OTP</button>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowNewPasswordModal(false)} style={styles.closeButton}>&times;</button>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem' }}>Enter OTP & New Password</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            {error && <div style={styles.error}>{error}</div>}
            <button onClick={handlePasswordChange} style={{ ...styles.button, backgroundColor: '#10b981' }}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Message Box */}
      {messageBox.show && (
        <MessageBox
          message={messageBox.message}
          onClose={() => setMessageBox({ show: false, message: '' })}
        />
      )}
    </div>
  );
}

