import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

// Utility for applying exponential backoff to API calls
const withRetry = (fn, retries = 3, delay = 1000) => async (...args) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(...args);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (2 ** i)));
    }
  }
};

// Component for a custom modal message box
const MessageBox = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4 transition-opacity duration-300 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform scale-100 transition-transform duration-300">
        <p className="text-lg font-medium text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// SVG Icon for the lock (used in the form)
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" />
  </svg>
);

// SVG Icon for Visibility Toggle (Eye)
const EyeIcon = ({ isVisible, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
        aria-label={isVisible ? "Hide password" : "Show password"}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isVisible ? (
                // Open Eye
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            ) : (
                // Closed Eye (Eye-slash)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.006A9.75 9.75 0 0112 18c-4.5 0-8.25-2.806-9.75-7.006a1.5 1.5 0 010-.988C3.75 7.082 7.5 4.375 12 4.375c.95 0 1.865.11 2.723.31a.75.75 0 01.378 1.403c-.63-.153-1.28-.238-1.93-.238-3.69 0-6.75 2.164-8.25 5.564a.75.75 0 000 .518c1.5 3.4 4.56 5.564 8.25 5.564.65 0 1.3-.085 1.93-.238a.75.75 0 01.378 1.403c-.858.2-1.773.31-2.723.31z" />
            )}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.076 6.136a9.71 9.71 0 011.924-.136C16.5 6 20.25 8.71 21.75 13c-1.5 4.29-5.25 7-9.75 7a9.75 9.75 0 01-1.924-.136M12 18c-4.5 0-8.25-2.806-9.75-7.006a1.5 1.5 0 010-.988c1.5-4.2 5.25-7.006 9.75-7.006s8.25 2.806 9.75 7.006a1.5 1.5 0 010 .988c-1.5 4.2-5.25 7.006-9.75 7.006z" />
        </svg>
    </button>
);


// Main Login Component
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'dealer'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messageBox, setMessageBox] = useState({ show: false, message: '' });
  // New state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Define API endpoints based on the provided curl commands
  const API_ENDPOINTS = {
    // Production URLs for login remain the same
    user: 'https://b2a2cars.com/api/users/login/',
    dealer: 'https://api.b2a2cars.com/api/dealers/login/',
    passwordReset: {
        // Using local URLs for password reset requests as per your curl command
        request: {
            user: 'https://api.b2a2cars.com/api/users/password-reset/', 
            dealer: 'https://api.b2a2cars.com/api/dealers/password-reset/',
        },
        // Base URL for confirmation step, where the token will be appended to the path
        confirmBase: {
            user: 'https://api.b2a2cars.com/api/users/password-reset/',
            dealer: 'https://api.b2a2cars.com/api/dealers/password-reset/',
        }
    },
    // The CSRF token from your curl command
    CSRF_TOKEN: 'F0yGN8NfjlzieXwJc6E93KdZ1fKN1YYPc7u1p5tS0MAsruyjwArbR2FbbbjYmPv6',
  };

  const handleLogin = withRetry(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = API_ENDPOINTS[loginType];
    const userRole = loginType === 'user' ? 'user' : 'dealer';

    try {
      const response = await axios.post(apiUrl, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFTOKEN': API_ENDPOINTS.CSRF_TOKEN,
        },
        timeout: 10000,
      });

      const { token, ...user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ ...user, role: userRole }));
      
      if (loginType === 'dealer' && user.id){
        localStorage.setItem('dealerId', user.id);
      }

      setRedirectTo('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (err.code === 'ECONNABORTED' || err.response?.status === 408) {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        setError(errorData?.detail || errorData?.message || 'Invalid credentials or API error. Please try again.');
        console.error("Login Error:", err.response || err);
      }
    } finally {
      setLoading(false);
    }
  });

  const handleSendOTP = async () => {
    if (!emailOrUsername) {
      setError('Please enter your email or username');
      return;
    }
    setError('');

    const requestUrl = API_ENDPOINTS.passwordReset.request[loginType];

    try {
      // API call to request the password reset token
      const response = await axios.post(requestUrl, {
        email: emailOrUsername, // API expects 'email'
      }, {
        timeout: 10000,
        headers: {
            'X-CSRFTOKEN': API_ENDPOINTS.CSRF_TOKEN,
        }
      });
      
      // On success, notify the user and open the next modal to enter the token
      if(response.status === 200 || response.status === 204) {
        setShowOTPModal(false);
        setShowNewPasswordModal(true);
        setMessageBox({ show: true, message: 'Password reset token sent successfully. Please check your email.' });
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate password reset. Please check your email.');
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
    
    // Validate that the reset token is provided
    if (!resetToken) {
        setError('Please enter the reset token received via email.');
        return;
    }
    
    setError('');

    // Construct the URL with the token as a path parameter as requested
    const confirmBaseUrl = API_ENDPOINTS.passwordReset.confirmBase[loginType];
    const confirmUrl = `${confirmBaseUrl}${resetToken}/`;

    try {
      // API call to confirm reset and set new password
      const response = await axios.post(confirmUrl, {
        password: newPassword, // Payload includes new password
        confirmPassword: confirmPassword, // Payload includes confirmation
      }, {
        timeout: 10000,
        headers: {
            'X-CSRFTOKEN': API_ENDPOINTS.CSRF_TOKEN,
        }
      });
      
      if(response.status === 200) {
        setShowNewPasswordModal(false);
        setMessageBox({ show: true, message: 'Password changed successfully. You can now log in.' });
        // Clear inputs after successful reset
        setEmailOrUsername('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Check your token and try again.');
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  // Determine the primary color/theme based on login type
  const isUser = loginType === 'user';
  
  // NOTE: We pre-define the classes to ensure Tailwind JIT recognizes them.
  const primaryColors = {
    user: {
      color: 'indigo',
      hex: '#4f46e5',
      from: 'from-indigo-500',
      to: 'to-indigo-700',
    },
    dealer: {
      color: 'green',
      hex: '#10b981',
      from: 'from-green-500',
      to: 'to-green-700',
    }
  };
  const theme = primaryColors[loginType];

  return (
    // Container with background gradient and centered content
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-200">
      {/* Card Container (Responsive) */}
      <div className={`
        flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden
        transition-all duration-500 ease-in-out transform scale-100
        hover:shadow-3xl
        flex-col md:flex-row
      `}>

        {/* Left Panel - Dynamic Branding/Support */}
        <div className={`
          flex flex-col justify-center p-8 sm:p-12 text-white text-center
          w-full md:w-5/12 transition-colors duration-500
          ${theme.from} ${theme.to} bg-gradient-to-br
        `}>
          <h2 className="text-3xl font-extrabold mb-4 animate-fadeInUp">
            Welcome Back, {isUser ? 'User' : 'Dealer'}!
          </h2>
          <p className="text-sm opacity-90 leading-relaxed mb-6 animate-fadeIn delay-100">
            {isUser ? 
              "Log in to browse auctions, manage bids, and track your favorite cars." :
              "Access your dealer portal to list inventory, manage sales, and connect with buyers."
            }
          </p>
          <div className="mt-4 p-4 border border-white border-opacity-30 rounded-lg backdrop-blur-sm bg-black bg-opacity-10 text-sm">
            <strong className="block mb-1">Need Support?</strong>
            <p>support@{isUser ? 'b2a2cars.com' : 'dealersupport.com'}</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-8 sm:p-12 w-full md:w-7/12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sign In
          </h2>

          {/* Login Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 shadow-inner">
            <button
              onClick={() => { setLoginType('user'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isUser ? 'bg-white text-indigo-600 shadow-md transform scale-[1.02]' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <span className="md:inline">User Login</span>
            </button>
            <button
              onClick={() => { setLoginType('dealer'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isUser ? 'bg-white text-green-600 shadow-md transform scale-[1.02]' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <span className="md:inline">Dealer Login</span>
            </button>
          </div>

          <form className="flex flex-col space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8s2.5 1 5 1 5-1 5-1-2.5-1-5-1-5 1-5 1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </div>
                {/* Password visibility toggle */}
                <EyeIcon isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300 animate-slideDown">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: theme.hex }}
              className={`
                w-full py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform
                ${loading ? 'opacity-60 cursor-not-allowed' : `hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]`}
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : 'Login'}
            </button>

            {/* Links and Actions */}
            <div className="flex flex-col items-center gap-2 mt-4 text-sm">
              <button
                type="button"
                onClick={() => { setShowOTPModal(true); setError(''); }}
                className={`text-${theme.color}-600 font-semibold hover:text-${theme.color}-800 hover:underline transition duration-150`}
              >
                Forgot password?
              </button>
              <span className="text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/Register')}
                  className={`text-${theme.color}-600 font-bold hover:text-${theme.color}-800 hover:underline transition duration-150`}
                >
                  Register here
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Tailwind & JSX for Modals (Improved Aesthetics) */}
      {/* Step 1: Request Reset Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4 transition-opacity duration-300 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full flex flex-col gap-5 transform scale-100 transition-transform duration-300 animate-scaleIn">
            <button onClick={() => setShowOTPModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition">&times;</button>
            <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
            <p className="text-sm text-gray-500">Enter your email to receive a password reset token.</p>
            <input
              type="text"
              placeholder="Enter your email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              required
            />
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">{error}</div>}
            <button onClick={handleSendOTP} className={`w-full py-3 bg-${theme.color}-600 text-white rounded-xl font-semibold hover:bg-${theme.color}-700 transition duration-150 shadow-md`}>
              Request Reset Token
            </button>
          </div>
        </div>
      )}

      {/* Step 2: New Password Modal (uses the received token) */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4 transition-opacity duration-300 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full flex flex-col gap-5 transform scale-100 transition-transform duration-300 animate-scaleIn">
            <button onClick={() => { setShowNewPasswordModal(false); setError(''); }} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition">&times;</button>
            <h3 className="text-xl font-bold text-gray-800">Set New Password</h3>
            <p className="text-sm text-gray-500">Enter the **token** you received and your new password.</p>
            
            <input
              type="text"
              placeholder="Enter Reset Token (from email)"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              required
            />
            <input
              type="password"
              placeholder="New Password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              required
            />
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">{error}</div>}
            <button onClick={handlePasswordChange} className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition duration-150 shadow-md">
              Submit New Password
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

      {/* CSS for custom animations (since Tailwind doesn't provide these directly) */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}
