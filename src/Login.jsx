import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// --- SVG Icons ---
const FaGoogle = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 488 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.9C307.2 92.5 280.7 80 248 80c-82.6 0-150.2 67.5-150.2 150.2S165.4 406.4 248 406.4c97.1 0 133.7-73.2 137.4-108.7H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>;
const FaFacebookF = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>;
const FaYahoo = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.9 310.4c-1.3-5.5-2.9-11.4-4.6-17.7l-1.3-4.8c-1.6-6-3.3-12.1-4.8-18.1-12.4-48.4-32.6-92.4-56.9-123.2-8-10.2-15.6-19-22.7-26.5-1.1-1.2-2.1-2.3-3-3.3-1-.9-2-1.8-2.9-2.6-2.6-2.3-5-4.2-7.1-5.7-1.1-.8-2.1-1.4-3-2-2.7-1.8-5-3.1-6.8-4-1-.5-1.8-.9-2.6-1.3-.8-.4-1.5-.7-2.2-1-1.3-.6-2.5-1.1-3.6-1.6-.6-.2-1.1-.4-1.6-.6-1.2-.5-2.4-.9-3.4-1.3-1.1-.4-2.1-.8-3-1.1-1.1-.4-2.1-.7-3.1-1-1.2-.4-2.4-.7-3.5-.9-1-.2-2-.4-2.9-.5-1.1-.2-2.2-.3-3.2-.4-1.1-.1-2.2-.2-3.3-.2-1.1 0-2.2-.1-3.3-.1-1.4 0-2.8 0-4.2.1-1.3.1-2.6.2-3.8.3-1.5.2-3.1.4-4.6.6-1.2.2-2.4.4-3.6.7-1.4.3-2.8.6-4.2.9-1.1.3-2.2.6-3.3.9-1.3.4-2.6.8-3.9 1.2-1.1.4-2.2.8-3.3 1.2-1.2.5-2.4 1-3.6 1.5-1.1.5-2.2 1-3.3 1.5-1.2.6-2.3 1.2-3.4 1.8-1.1.6-2.2 1.3-3.2 2-1.1.7-2.2 1.4-3.2 2.2-1.8 1.4-3.5 2.9-5 4.5-1.1 1.2-2.2 2.5-3.2 3.8-1.1 1.4-2.1 2.9-3 4.4-1.7 2.9-3.2 5.9-4.5 9-1.1 2.5-2 5-2.9 7.4-.9 2.5-1.8 5-2.5 7.4-.6 2.1-1.2 4.1-1.7 6.1-2.4 9.1-4.2 18.3-5.4 27.5-.6 4.8-1 9.6-1.3 14.3-.3 4.9-.4 9.7-.4 14.5v.2c0 20.3 3.6 40.1 10.4 58.3 1.9 5.1 4 10.1 6.3 15 1 2.1 2.1 4.2 3.2 6.2 1.2 2.1 2.5 4.2 3.8 6.2 2.2 3.5 4.6 6.9 7.1 10.1 1.2 1.5 2.5 3 3.7 4.5 1.4 1.6 2.8 3.2 4.2 4.8 1.4 1.5 2.8 2.9 4.2 4.3 1.3 1.3 2.6 2.5 3.9 3.6 1.6 1.4 3.2 2.7 4.8 3.9 1.6 1.2 3.2 2.4 4.8 3.4 1.7 1.1 3.4 2.1 5.1 3 1.7.9 3.4 1.8 5.1 2.6 1.6.8 3.2 1.5 4.9 2.1 1.5.6 3 1.1 4.5 1.6 1.7.5 3.5 1 5.2 1.4 3.3.7 6.7 1.2 10.1 1.6 3.4.4 6.8.6 10.2.6 6.9 0 13.7-.4 20.1-1.2 6-2 11.5-4.8 16.4-8.4 1.2-.9 2.3-1.8 3.4-2.7 4.5-3.8 8.1-8.5 10.7-13.8 1.1-2.2 2.1-4.4 2.9-6.6.9-2.2 1.6-4.5 2.2-6.7.6-2.2 1-4.4 1.3-6.6.3-2.1.5-4.1.5-6.1v-.2c.1-13.3-1.9-26.5-5.9-38.8zM416 64c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-86.9 237.3c-2.4-1.6-4.8-2.9-7-4-1.1-.6-2.2-1.1-3.3-1.7-2.1-1.1-4.2-2.3-6.1-3.5-1.1-.7-2.2-1.4-3.3-2.1-1.9-1.2-3.8-2.6-5.5-4-1-.8-2-1.7-3-2.6-1.7-1.5-3.3-3.1-4.8-4.7-1.5-1.7-2.9-3.5-4.2-5.4-1.2-1.8-2.3-3.7-3.3-5.7-1.8-3.7-3.2-7.6-4.2-11.7-1-4-.8-8.3-1.2-12.8-1.1-9.9-1-20.5-2.1-30.8-.2-1.9-.4-3.9-.6-5.8-.1-2-.2-4-.2-6 0-3.3 0-6.6.3-9.9.2-2.2.4-4.4.7-6.6.3-2.2.7-4.4 1.1-6.6.4-2.2.9-4.4 1.4-6.6.5-2.1 1.1-4.2 1.8-6.3.6-2 1.3-4 2-6 .8-2 1.6-4 2.5-6 .9-2 1.8-3.9 2.8-5.8 1-1.9 2-3.8 3.1-5.6 1.1-1.8 2.2-3.6 3.4-5.3 1.2-1.7 2.4-3.4 3.7-5 1.3-1.6 2.6-3.2 4-4.7 1.4-1.5 2.8-2.9 4.3-4.3 2.9-2.7 6-5.2 9.2-7.4 3.9-2.7 8-5 12.2-6.8 4.2-1.8 8.4-3.1 12.5-3.8 2.5-.4 4.9-.7 7.2-.9 2.4-.2 4.7-.2 6.9-.2 3.2 0 6.4.2 9.4.6 2.9.4 5.8.9 8.5 1.6 2.7.7 5.3 1.6 7.8 2.6 2.5 1 4.9 2.2 7.1 3.5 2.2 1.3 4.3 2.8 6.2 4.4 1.9 1.6 3.6 3.3 5.2 5.1 1.5 1.7 2.9 3.5 4.2 5.4 1.2 1.8 2.3 3.7 3.3 5.7.9 1.9 1.8 3.9 2.5 5.9.7 2 1.4 4 2 6 .6 2 1.1 4 1.5 6 .4 2 .8 4 1.1 5.9.3 2 .5 3.9.7 5.9.2 2 .3 3.9.3 5.9v.1c0 2.1-.1 4.3-.2 6.4-.1 2.2-.3 4.4-.6 6.6-.3 2.2-.7 4.4-1.1 6.6-.4 2.2-.9 4.4-1.5 6.6-1.1 4.5-2.7 8.8-4.6 13-1.8 3.9-3.9 7.7-6.2 11.2-1.1 1.7-2.3 3.4-3.5 5-1.2 1.6-2.4 3.2-3.7 4.7-1.3 1.5-2.7 2.9-4.1 4.3-1.4 1.3-2.9 2.6-4.4 3.8-1.5 1.2-3.1 2.4-4.7 3.4-1.6 1.1-3.2 2.1-4.9 3-1.6.9-3.3 1.8-5 2.6-1.6.8-3.3 1.5-5 2.1-3.1 1.2-6.4 2.2-9.7 2.9-3.2.7-6.5 1.1-9.7 1.2-3.2.1-6.3.1-9.4-.1-3.1-.2-6.1-.5-9.1-.9-3-.4-5.9-.9-8.7-1.5-2.8-.7-5.5-1.5-8.1-2.4-2.6-.9-5.1-2-7.5-3.1z"></path></svg>;

export default function Login() {
  const [email, setEmail] = useState('banothnaveenbsc2@gmail.com'); // Pre-fill email for easy testing
  const [password, setPassword] = useState('Naveen@2142'); // Pre-fill password for easy testing
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API Endpoints: IMPORTANT: Changed from local address to the live domain for consistency.
  const loginApiUrl = 'https://api.b2a2cars.com/api/users/login/';
  const passwordResetUrl = 'https://api.b2a2cars.com/api/users/password-reset/';

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!validateEmail(email) || !password) {
      setError('Please enter a valid email and password.');
      setIsLoading(false);
      return;
    }

    // Prepare data for application/x-www-form-urlencoded
    const data = new URLSearchParams();
    data.append('email', email);
    data.append('password', password);

    try {
      const response = await axios.post(loginApiUrl, data.toString(), {
        headers: {
          // Explicitly set the content type
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        }
      });

      // --- TOKEN CATCHING SUCCESS: This is where the token is generated and stored. ---
      const access_token = response.data.tokens?.access;
      const refresh_token = response.data.tokens?.refresh;

      if (access_token) {
        console.log("Login Success: Access Token generated and retrieved.");
        console.log("Token starts with:", access_token.substring(0, 20) + "...");

        // Store the access token for use in protected routes
        if (rememberMe) {
          localStorage.setItem('authToken', access_token);
        } else {
          sessionStorage.setItem('authToken', access_token);
        }
        // Optionally store refresh token if needed for renewal
        if (refresh_token) {
           localStorage.setItem('refreshToken', refresh_token);
        }

        setSuccessMessage("Login successful! Redirecting to profile...");
        setTimeout(() => setRedirectToProfile(true), 1500);
      } else {
        setError('Login successful, but no authorization token received.');
      }

    } catch (err) {
      // Handle API errors (e.g., 400 Bad Request, invalid credentials)
      console.error("Login error:", err);
      const errorDetail = err.response?.data?.detail || err.response?.data?.error;
      const errorMessage = errorDetail || 'Login failed. Please check your credentials and ensure the API is running.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address to reset your password.');
      return;
    }

    // Reset logic here (kept simple for demonstration, assumes passwordResetUrl is correct)
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      // The password reset usually requires JSON or form-urlencoded with just the email
      await axios.post(passwordResetUrl, { email }, { headers: { 'Content-Type': 'application/json' } });

      setSuccessMessage(`Password reset request sent to ${email}. Check your inbox!`);

    } catch (err) {
      console.error("Password reset error:", err);
      const errorMessage = err.response?.data?.detail || 'Password reset failed. User may not exist or email is incorrect.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  if (redirectToProfile) {
    // Navigate to the profile page after successful login
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <style>
        {/* CSS styles remain the same for aesthetics */}
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          :root {
            --primary-color: #3b82f6;
            --primary-hover: #2563eb;
            --text-color: #1f2937;
            --light-gray: #f9fafb;
            --border-color: #d1d5db;
            --success-color: #10b981;
            --error-color: #ef4444;
            --card-bg: #ffffff;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--light-gray);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem 1rem;
            min-height: 100vh;
          }

          .login-card {
            background: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 450px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .form-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .form-header h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-color);
            margin-top: 0;
            margin-bottom: 0.5rem;
          }

          .form-header p {
            color: #6b7280;
            margin: 0;
          }

          /* --- Form Groups --- */
          .form-group {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-bottom: 1.5rem;
          }

          .form-group.required label::after {
            content: '*';
            color: var(--error-color);
            margin-left: 0.25rem;
          }

          label {
            color: var(--text-color);
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }

          input:not([type="checkbox"]) {
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 1rem;
            color: var(--text-color);
            background-color: white;
            transition: border-color 0.2s, box-shadow 0.2s;
            width: 100%;
            box-sizing: border-box;
          }

          input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            outline: none;
          }

          /* --- Checkbox Group --- */
          .checkbox-group {
            flex-direction: row;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .checkbox-group input[type="checkbox"] {
            margin-right: 0.75rem;
            width: 1rem;
            height: 1rem;
            min-width: 1rem;
            min-height: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            vertical-align: middle;
            position: relative;
            background-color: white;
            transition: background-color 0.2s, border-color 0.2s;
          }

          .checkbox-group input[type="checkbox"]:checked {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }

          .checkbox-group input[type="checkbox"]:checked::before {
            content: '✓';
            display: block;
            color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.75rem;
            line-height: 1;
          }

          .checkbox-group label {
            margin-bottom: 0;
            font-weight: 400;
            font-size: 0.875rem;
            cursor: pointer;
          }

          /* --- Messages --- */
          .error-message, .success-message {
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-weight: 500;
          }

          .error-message {
            background-color: #fef2f2;
            color: var(--error-color);
            border: 1px solid #fee2e2;
          }

          .success-message {
            background-color: #ecfdf5;
            color: var(--success-color);
            border: 1px solid #d1fae5;
          }

          /* --- Submit Button --- */
          .submit-btn {
            width: 100%;
            padding: 0.75rem;
            margin-top: 0.5rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.125rem;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            position: relative;
          }

          .submit-btn:hover:not(:disabled) {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
          }

          .submit-btn:active:not(:disabled) {
            transform: translateY(0);
          }

          .submit-btn:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }

          .submit-btn.loading::after {
            content: '';
            position: absolute;
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            right: 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* --- Forgot Password --- */
          .forgot-password {
            text-align: right;
            margin-bottom: 1.5rem;
          }

          .forgot-password a {
            color: var(--primary-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
          }

          .forgot-password a:hover {
            text-decoration: underline;
          }

          /* --- Social Login --- */
          .social-login {
            margin-top: 2rem;
            text-align: center;
          }

          .social-login p {
            color: #6b7280;
            margin-bottom: 1rem;
            position: relative;
          }

          .social-login p::before, .social-login p::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 30%;
            height: 1px;
            background-color: var(--border-color);
          }

          .social-login p::before {
            left: 0;
          }

          .social-login p::after {
            right: 0;
          }

          .social-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }

          .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: white;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            width: 3.5rem;
            height: 3.5rem;
          }

          .social-btn:hover {
            background-color: var(--light-gray);
            transform: translateY(-2px);
          }

          .social-btn svg {
            width: 1.5rem;
            height: 1.5rem;
          }

          .google-btn svg { color: #DB4437; }
          .facebook-btn svg { color: #4267B2; }
          .yahoo-btn svg { color: #720e9e; }

          /* --- Register Link --- */
          .register-link {
            text-align: center;
            margin-top: 2rem;
            color: #6b7280;
          }

          .register-link a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
          }

          .register-link a:hover {
            text-decoration: underline;
          }

          /* --- Responsive --- */
          @media (max-width: 768px) {
            .login-card {
              padding: 1.5rem;
            }

            .social-buttons {
              flex-wrap: wrap;
            }
          }
        `}
      </style>

      <div className="login-container">
        <div className="login-card">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group required">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group required">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="checkbox-group" style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <div className="forgot-password">
                <a onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Forgot password?</a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google-btn">
                <FaGoogle />
              </button>
              <button type="button" className="social-btn facebook-btn">
                <FaFacebookF />
              </button>
              <button type="button" className="social-btn yahoo-btn">
                <FaYahoo />
              </button>
            </div>
          </div>

          <div className="register-link">
            Don't have an account? <a href="/register">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
}
