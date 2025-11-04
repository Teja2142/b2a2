import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// --- SVG Icons (to remove external dependency) ---
const FaGoogle = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 488 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.9C307.2 92.5 280.7 80 248 80c-82.6 0-150.2 67.5-150.2 150.2S165.4 406.4 248 406.4c97.1 0 133.7-73.2 137.4-108.7H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>;
const FaFacebookF = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>;
const FaYahoo = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.9 310.4c-1.3-5.5-2.9-11.4-4.6-17.7l-1.3-4.8c-1.6-6-3.3-12.1-4.8-18.1-12.4-48.4-32.6-92.4-56.9-123.2-8-10.2-15.6-19-22.7-26.5-1.1-1.2-2.1-2.3-3-3.3-1-.9-2-1.8-2.9-2.6-2.6-2.3-5-4.2-7.1-5.7-1.1-.8-2.1-1.4-3-2-2.7-1.8-5-3.1-6.8-4-1-.5-1.8-.9-2.6-1.3-.8-.4-1.5-.7-2.2-1-1.3-.6-2.5-1.1-3.6-1.6-.6-.2-1.1-.4-1.6-.6-1.2-.5-2.4-.9-3.4-1.3-1.1-.4-2.1-.8-3-1.1-1.1-.4-2.1-.7-3.1-1-1.2-.4-2.4-.7-3.5-.9-1-.2-2-.4-2.9-.5-1.1-.2-2.2-.3-3.2-.4-1.1-.1-2.2-.2-3.3-.2-1.1 0-2.2-.1-3.3-.1-1.4 0-2.8 0-4.2.1-1.3.1-2.6.2-3.8.3-1.5.2-3.1.4-4.6.6-1.2.2-2.4.4-3.6.7-1.4.3-2.8.6-4.2.9-1.1.3-2.2.6-3.3.9-1.3.4-2.6.8-3.9 1.2-1.1.4-2.2.8-3.3 1.2-1.2.5-2.4 1-3.6 1.5-1.1.5-2.2 1-3.3 1.5-1.2.6-2.3 1.2-3.4 1.8-1.1.6-2.2 1.3-3.2 2-1.1.7-2.2 1.4-3.2 2.2-1.8 1.4-3.5 2.9-5 4.5-1.1 1.2-2.2 2.5-3.2 3.8-1.1 1.4-2.1 2.9-3 4.4-1.7 2.9-3.2 5.9-4.5 9-1.1 2.5-2 5-2.9 7.4-.9 2.5-1.8 5-2.5 7.4-.6 2.1-1.2 4.1-1.7 6.1-2.4 9.1-4.2 18.3-5.4 27.5-.6 4.8-1 9.6-1.3 14.3-.3 4.9-.4 9.7-.4 14.5v.2c0 20.3 3.6 40.1 10.4 58.3 1.9 5.1 4 10.1 6.3 15 1 2.1 2.1 4.2 3.2 6.2 1.2 2.1 2.5 4.2 3.8 6.2 2.2 3.5 4.6 6.9 7.1 10.1 1.2 1.5 2.5 3 3.7 4.5 1.4 1.6 2.8 3.2 4.2 4.8 1.4 1.5 2.8 2.9 4.2 4.3 1.3 1.3 2.6 2.5 3.9 3.6 1.6 1.4 3.2 2.7 4.8 3.9 1.6 1.2 3.2 2.4 4.8 3.4 1.7 1.1 3.4 2.1 5.1 3 1.7.9 3.4 1.8 5.1 2.6 1.6.8 3.2 1.5 4.9 2.1 1.5.6 3 1.1 4.5 1.6 1.7.5 3.5 1 5.2 1.4 3.3.7 6.7 1.2 10.1 1.6 3.4.4 6.8.6 10.2.6 6.9 0 13.7-.4 20.1-1.2 6-2 11.5-4.8 16.4-8.4 1.2-.9 2.3-1.8 3.4-2.7 4.5-3.8 8.1-8.5 10.7-13.8 1.1-2.2 2.1-4.4 2.9-6.6.9-2.2 1.6-4.5 2.2-6.7.6-2.2 1-4.4 1.3-6.6.3-2.1.5-4.1.5-6.1v-.2c.1-13.3-1.9-26.5-5.9-38.8zM416 64c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-86.9 237.3c-2.4-1.6-4.8-2.9-7-4-1.1-.6-2.2-1.1-3.3-1.7-2.1-1.1-4.2-2.3-6.1-3.5-1.1-.7-2.2-1.4-3.3-2.1-1.9-1.2-3.8-2.6-5.5-4-1-.8-2-1.7-3-2.6-1.7-1.5-3.3-3.1-4.8-4.7-1.5-1.7-2.9-3.5-4.2-5.4-1.2-1.8-2.3-3.7-3.3-5.7-1.8-3.7-3.2-7.6-4.2-11.7-1-4-.8-8.3-1.2-12.8-1.1-9.9-1-20.5-2.1-30.8-.2-1.9-.4-3.9-.6-5.8-.1-2-.2-4-.2-6 0-3.3 0-6.6.3-9.9.2-2.2.4-4.4.7-6.6.3-2.2.7-4.4 1.1-6.6.4-2.2.9-4.4 1.4-6.6.5-2.1 1.1-4.2 1.8-6.3.6-2 1.3-4 2-6 .8-2 1.6-4 2.5-6 .9-2 1.8-3.9 2.8-5.8 1-1.9 2-3.8 3.1-5.6 1.1-1.8 2.2-3.6 3.4-5.3 1.2-1.7 2.4-3.4 3.7-5 1.3-1.6 2.6-3.2 4-4.7 1.4-1.5 2.8-2.9 4.3-4.3 2.9-2.7 6-5.2 9.2-7.4 3.9-2.7 8-5 12.2-6.8 4.2-1.8 8.4-3.1 12.5-3.8 2.5-.4 4.9-.7 7.2-.9 2.4-.2 4.7-.2 6.9-.2 3.2 0 6.4.2 9.4.6 2.9.4 5.8.9 8.5 1.6 2.7.7 5.3 1.6 7.8 2.6 2.5 1 4.9 2.2 7.1 3.5 2.2 1.3 4.3 2.8 6.2 4.4 1.9 1.6 3.6 3.3 5.2 5.1 1.5 1.7 2.9 3.5 4.2 5.4 1.2 1.8 2.3 3.7 3.3 5.7.9 1.9 1.8 3.9 2.5 5.9.7 2 1.4 4 2 6 .6 2 1.1 4 1.5 6 .4 2 .8 4 1.1 5.9.3 2 .5 3.9.7 5.9.2 2 .3 3.9.3 5.9v.1c0 2.1-.1 4.3-.2 6.4-.1 2.2-.3 4.4-.6 6.6-.3 2.2-.7 4.4-1.1 6.6-.4 2.2-.9 4.4-1.5 6.6-1.1 4.5-2.7 8.8-4.6 13-1.8 3.9-3.9 7.7-6.2 11.2-1.1 1.7-2.3 3.4-3.5 5-1.2 1.6-2.4 3.2-3.7 4.7-1.3 1.5-2.7 2.9-4.1 4.3-1.4 1.3-2.9 2.6-4.4 3.8-1.5 1.2-3.1 2.4-4.7 3.4-1.6 1.1-3.2 2.1-4.9 3-1.6.9-3.3 1.8-5 2.6-1.6.8-3.3 1.5-5 2.1-3.1 1.2-6.4 2.2-9.7 2.9-3.2.7-6.5 1.1-9.7 1.2-3.2.1-6.3.1-9.4-.1-3.1-.2-6.1-.5-9.1-.9-3-.4-5.9-.9-8.7-1.5-2.8-.7-5.5-1.5-8.1-2.4-2.6-.9-5.1-2-7.5-3.1z"></path></svg>;
const FaUpload = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24z"></path></svg>;
const FaGlobe = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM88 240a152 152 0 0 1 53.8-113.5 156.8 156.8 0 0 1 111.3-43.3C293.5 125.5 352 195.9 352 280c0 48.2-21.7 90.3-55.7 119.2-34.2 29-79.3 44.9-129.2 44.9-52.9 0-100-18-135.5-47.5A152.1 152.1 0 0 1 88 240z"></path></svg>;
const FaMapMarkerAlt = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>;

// --- Data (to remove external dependencies) ---
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

export default function Register() {
  // Updated state to use 'customer' for API alignment and pre-filling with curl example data
  const [formType, setFormType] = useState('customer');

  const [fullName, setFullName] = useState('Naveen Banoth');
  const [email, setEmail] = useState('banothnaveenbsc2@gmail.com');
  const [phone, setPhone] = useState('6309069639'); // Plain number
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Telangana');
  const [address, setAddress] = useState('1st ward');
  const [zipCode, setZipCode] = useState('506132');
  const [gender, setGender] = useState('male');
  const [language, setLanguage] = useState('Lambada');
  const [currency, setCurrency] = useState('INR');
  const [dob, setDob] = useState('2000-07-11');
  const [password, setPassword] = useState('Naveen@2142');
  const [confirmPassword, setConfirmPassword] = useState('Naveen@2142');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [idFile, setIdFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerApiUrl = 'https://api.b2a2cars.com/api/users/register/';


  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const validatePassword = (pwd) => {
    // Basic validation to match the curl's password complexity
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain one uppercase letter.';
    if (!/\d/.test(pwd)) return 'Password must contain one digit.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain one special character.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    // Map all fields from the curl command to formData
    formData.append('form_type', formType); // 'customer' or 'dealer'
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone); // Sending the raw phone number
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('country', country);
    formData.append('dob', dob);
    formData.append('state', state);
    formData.append('address', address);
    formData.append('zip_code', zipCode);
    formData.append('gender', gender);
    formData.append('language', language);
    formData.append('currency', currency);

    // Append files if they exist (using file object and its name)
    if (idFile) formData.append('id_file', idFile, idFile.name);
    if (profilePic) formData.append('profile_pic', profilePic, profilePic.name);

    try {
      const response = await axios.post(registerApiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios handles boundary
          'accept': 'application/json',
          // The X-CSRFTOKEN from the curl is omitted as it's typically handled by session cookies
        },
      });

      setSuccessMessage(response.data.message || "Registration successful! Redirecting to login...");
      setTimeout(() => setRedirectToLogin(true), 1500);

    } catch (err) {
      console.error("Registration error:", err);
      // Attempt to parse validation errors from the response data
      let errorMessage = 'Registration failed. Please review the form.';
      const responseData = err.response?.data;

      if (responseData) {
        // Simple heuristic for displaying complex Django errors
        const firstErrorKey = Object.keys(responseData)[0];
        if (firstErrorKey && Array.isArray(responseData[firstErrorKey])) {
            errorMessage = `${firstErrorKey}: ${responseData[firstErrorKey][0]}`;
        } else if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
        } else if (typeof responseData.error === 'string') {
            errorMessage = responseData.error;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <style>
        {/* Retain original styling */}
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          :root {
            --primary-color: #3b82f6; /* Blue 500 */
            --primary-hover: #2563eb; /* Blue 600 */
            --text-color: #1f2937; /* Gray 800 */
            --light-gray: #f9fafb; /* Gray 50 */
            --border-color: #d1d5db; /* Gray 300 */
            --success-color: #10b981; /* Green 500 */
            --error-color: #ef4444; /* Red 500 */
            --card-bg: #ffffff;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--light-gray);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .register-container {
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Align to top for longer forms */
            padding: 2rem 1rem;
            min-height: 100vh;
          }

          .register-card {
            background: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 650px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .form-header h2 {
            font-size: 1.875rem; /* 30px */
            font-weight: 700;
            color: var(--text-color);
            margin-top: 0;
            margin-bottom: 1.5rem;
          }

          /* --- Toggle Buttons --- */
          .form-type-toggle {
            display: flex;
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
          }

          .toggle-btn {
            flex-grow: 1;
            padding: 0.75rem 1.5rem;
            border: none;
            background-color: transparent;
            color: var(--text-color);
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
          }

          .toggle-btn.active {
            background-color: var(--primary-color);
            color: var(--card-bg);
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .toggle-btn:not(.active):hover {
            background-color: var(--light-gray);
          }

          /* --- Form Layout and Groups --- */
          .form-row {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-bottom: 1rem;
          }

          /* Required Indicator */
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

          input:not([type="checkbox"]), select, .date-picker, .file-upload-item label span {
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 1rem;
            color: var(--text-color);
            background-color: white;
            transition: border-color 0.2s, box-shadow 0.2s;
            appearance: none; /* Remove default styling for select/date */
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 100%;
            box-sizing: border-box;
          }

          input:focus, select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            outline: none;
          }

          /* Special styling for select with icon */
          .select-wrapper, .input-with-icon {
            position: relative;
            display: flex;
            align-items: center;
          }

          .select-wrapper select {
            padding-left: 2.5rem; /* Make space for the icon */
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1.25rem;
          }

          .select-wrapper svg, .input-with-icon svg {
            position: absolute;
            left: 0.75rem;
            color: #6b7280;
            pointer-events: none;
          }

          .input-with-icon input {
            padding-left: 2.5rem;
          }

          /* --- File Upload Styling --- */
          .file-upload {
              display: flex;
              gap: 1.5rem;
          }

          .file-upload-item {
              flex: 1;
          }

          .file-upload-item label {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0.75rem 1rem;
            border: 1px dashed var(--border-color);
            border-radius: 6px;
            background-color: var(--light-gray);
            cursor: pointer;
            transition: background-color 0.2s;
            margin-bottom: 0;
            height: 44px; /* Match input height */
          }

          .file-upload-item label:hover {
            background-color: #eff6ff; /* Blue 50 */
          }

          .file-upload-item input[type="file"] {
            display: none;
          }

          .file-upload-item label span {
            border: none;
            padding: 0;
            margin-left: 0.5rem;
            font-size: 0.9rem;
            color: #6b7280;
            background-color: transparent;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .file-upload-item label svg {
            width: 1.25em;
            height: 1.25em;
            color: var(--primary-color);
          }

          /* --- Checkbox Group --- */
          .checkbox-group {
            flex-direction: row;
            align-items: center;
            margin-top: 0.5rem;
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
          }

          .checkbox-group a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
          }

          .checkbox-group a:hover {
            text-decoration: underline;
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
            margin-top: 1rem;
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

          /* --- Social Login and Links (retained for completeness) --- */
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

          .social-login p::before { left: 0; }
          .social-login p::after { right: 0; }

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

          .login-link {
            text-align: center;
            margin-top: 2rem;
            color: #6b7280;
          }

          .login-link a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
          }

          .login-link a:hover {
            text-decoration: underline;
          }

          /* --- Responsive --- */
          @media (max-width: 768px) {
            .register-card {
              padding: 1.5rem;
            }

            .form-row, .file-upload {
              flex-direction: column;
              gap: 0;
            }
            .file-upload-item {
                margin-bottom: 1rem;
            }

            .social-buttons {
              flex-wrap: wrap;
            }
          }
        `}
      </style>

      <div className="register-container">
        <div className="register-card">
          <div className="form-header">
            <h2>Create Your Account</h2>
          </div>

          {/* Form Type Toggle - Updated to 'customer' */}
          <div className="form-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${formType === 'customer' ? 'active' : ''}`}
              onClick={() => setFormType('customer')}
            >
              Customer Account
            </button>
            <button
              type="button"
              className={`toggle-btn ${formType === 'dealer' ? 'active' : ''}`}
              onClick={() => setFormType('dealer')}
            >
              Dealer Account
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group required">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
                <div className="form-group required">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-with-icon">
                    <FaGlobe />
                    <input
                      type="tel"
                      id="phone"
                      placeholder="e.g. 6309069639"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="date-picker"
                  />
                </div>
            </div>

            {/* Location Information */}
            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="country">Country</label>
                <div className="select-wrapper">
                  <FaGlobe />
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Select Country</option>
                    {countryList.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group required">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group required">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Language and Currency (now always visible for comprehensive registration) */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="language">Preferred Language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="Lambada">Lambada</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="currency">Preferred Currency</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencyList.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group required">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* File Uploads (now always visible for comprehensive registration) */}
            <div className="file-upload">
              <div className="form-group file-upload-item">
                <label>Profile Picture (Optional)</label>
                <label htmlFor="profilePic">
                  <FaUpload />
                  <span>{profilePic ? profilePic.name : 'Choose file...'}</span>
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange(setProfilePic)}
                />
              </div>

              <div className="form-group file-upload-item">
                <label>ID Document (Optional)</label>
                <label htmlFor="idFile">
                  <FaUpload />
                  <span>{idFile ? idFile.name : 'Choose file...'}</span>
                </label>
                <input
                  type="file"
                  id="idFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange(setIdFile)}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : `Create ${formType === 'dealer' ? 'Dealer' : 'Customer'} Account`}
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <p>Or sign up with</p>
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

          <div className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}
