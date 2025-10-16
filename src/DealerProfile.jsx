import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration (MUST BE UPDATED BY USER) ---
// NOTE: These must be replaced with dynamic values (e.g., loaded from your app state).
const API_BASE_URL = 'https://api.b2a2cars.com/api';
// Assuming the DEALER_ID is the UUID used in the profile URL
const DEALER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'; 
// Assuming the CSRF token is required for all state-changing requests
const CSRF_TOKEN = 'F0yGN8NfjlzieXwJc6E93KdD1fKN1YYPc7u1p5tS0MAsruyjwArbR2FbbbjYmPv6'; 

// --- SVG Icons (Standard for all) ---
const FaHome = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.5.07L224 384c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32l.07 95.73 112.5-.07a16 16 0 0 0 16-16V300.11L295.63 148.26A24.58 24.58 0 0 0 288 144c-2.8 0-5.6.8-8.37 4.26zM524.52 224.33l-99.73-100.27a8.77 8.77 0 0 0-4.14-2.58l-52.48-11.23a6.83 6.83 0 0 0-4.13.91L288 88l-87.9 44.57a6.83 6.83 0 0 0-4.13-.91L143.25 121.5a8.77 8.77 0 0 0-4.14 2.58L39.48 224.33a8.88 8.88 0 0 0-1.4 12.18l14.18 20.73a8.88 8.88 0 0 0 12.28 1.48L288 163.63l223.56 100.83a8.88 8.88 0 0 0 12.28-1.48l14.18-20.73a8.88 8.88 0 0 0-1.4-12.18z"></path></svg>;
const FaCarPlus = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M633.8 281.7l-35.8-35.8c-10.2-10.2-26.6-10.2-36.8 0L544 288V192c0-8.8-7.2-16-16-16H480V96c0-8.8-7.2-16-16-16h-48V32c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v48H224V32c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v48H16c-8.8 0-16 7.2-16 16v96H96v96H0v128c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64V333.7l29.8 29.8c10.2 10.2 26.6 10.2 36.8 0l35.8-35.8c10.2-10.2 10.2-26.6 0-36.8zM448 304v-96h-32v96h32zm-64 0v-96h-32v96h32zM320 304v-96h-32v96h32zm-64 0v-96h-32v96h32zM128 192v-80h32v80h-32zM64 432c0 8.8-7.2 16-16 16s-16-7.2-16-16v-80h32v80zm448 0c0 8.8-7.2 16-16 16s-16-7.2-16-16v-80h32v80z"/></svg>;
const FaCar = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M499.9 160l-72-64a32.09 32.09 0 0 0-21.3-8H344V48c0-17.67-14.33-32-32-32H32C14.33 16 0 30.33 0 48v288c0 17.67 14.33 32 32 32h32c0 20.8 12.44 39.1 32 46.8V480h64v-32h128v32h64v-49.2c19.56-7.7 32-26 32-46.8h32c17.67 0 32-14.33 32-32V192c0-17.7-14.3-32-32-32zM64 320H32V64h288v96H128c-17.67 0-32 14.33-32 32v128zm102 64c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm224 0c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm64-96h-96V192h96v128z"/></svg>;
const FaUser = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>;
const FaSignOutAlt = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H48c-26.5 0-48-21.5-48-48V224c0-26.5 21.5-48 48-48h240v-96c0-21.5 25.5-32 41-17l168 168c9.3 9.3 9.3 24.3 0 33.7zM64 420c0 4.4 3.6 8 8 8h192c4.4 0 8-3.6 8-8v-32c0-4.4-3.6-8-8-8H72c-4.4 0-8 3.6-8 8v32zM32 68c0-4.4 3.6-8 8-8h192c4.4 0 8 3.6 8 8v32c0 4.4-3.6 8-8 8H40c-4.4 0-8-3.6-8-8V68z"/></svg>;
const FaCloudUploadAlt = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 384c-12.8 0-25.6-4.9-35.4-14.6l-80-80c-19.5-19.5-19.5-51.2 0-70.7l80-80c19.5-19.5 51.2-19.5 70.7 0 19.5 19.5 19.5 51.2 0 70.7L288 288V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h240c26.5 0 48-21.5 48-48V416h160c26.5 0 48-21.5 48-48V192c0-26.5-21.5-48-48-48H320c-26.5 0-48 21.5-48 48v32h16c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H288z"/></svg>;


// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const SidebarButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                : 'text-indigo-900 hover:bg-indigo-100 hover:text-indigo-700'
        }`}
    >
        <Icon className="w-5 h-5 mr-3" />
        {label}
    </button>
);

const Sidebar = ({ active, setActive, handleLogout }) => {
    const sections = [
        { name: 'Home', label: 'Dashboard Home', icon: FaHome },
        { name: 'PostVehicle', label: 'Post New Vehicle', icon: FaCarPlus },
        { name: 'MyVehicles', label: 'My Vehicles', icon: FaCar },
        { name: 'ProfileUpdate', label: 'Profile Update', icon: FaUser },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-xl transition-all duration-300">
            <div>
                <h1 className="text-2xl font-extrabold text-indigo-700 mb-8">Dealer Portal</h1>
                <nav className="space-y-3">
                    {sections.map(section => (
                        <SidebarButton
                            key={section.name}
                            icon={section.icon}
                            label={section.label}
                            isActive={active === section.name}
                            onClick={() => setActive(section.name)}
                        />
                    ))}
                </nav>
            </div>
            <div className="pt-4 border-t border-gray-200">
                <SidebarButton
                    icon={FaSignOutAlt}
                    label="Logout"
                    isActive={false}
                    onClick={handleLogout}
                />
            </div>
        </div>
    );
};

// --- Section Content Components ---

const HomeContent = ({ dealerData }) => (
    <div className="p-8 space-y-6 bg-gray-50 min-h-full">
        <h2 className="text-4xl font-bold text-gray-800">Welcome back, {dealerData.company_name || 'Dealer'}!</h2>
        <p className="text-gray-600 text-lg">Your central hub for managing inventory and profile details. Always ensure your profile details are up-to-date.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                <p className="text-sm font-medium text-gray-500">Profile Email</p>
                <p className="text-xl font-bold text-gray-900 mt-1 truncate">{dealerData.email || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dealerData.phone || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{dealerData.city || 'N/A'}, {dealerData.state || 'N/A'}</p>
            </div>
        </div>
        <p className="text-sm text-gray-500 pt-4">Note: Statistics like "Total Listings" would require another API endpoint not provided here.</p>
    </div>
);

const MyVehiclesContent = () => (
    <div className="p-8 space-y-6 bg-gray-50 min-h-full">
        <h2 className="text-4xl font-bold text-gray-800 border-b pb-4">My Vehicles</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600">This section would fetch and display a list of all vehicles associated with your dealer profile using a dedicated `GET` request.</p>
            <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="font-semibold text-blue-800">API Endpoint required:</p>
                <code className="text-xs text-blue-700">GET {API_BASE_URL}/vehicles/vehicles/?dealer={DEALER_ID}</code>
            </div>
        </div>
    </div>
);

const PostVehicleContent = () => {
    const initialVehicleState = {
        vin: '', make: '', model: '', year: 2024, color: '', mileage: 0,
        features: '', description: '', registration_number: '', price: '',
        starting_price: '', transmission: 'automatic', fuel_type: 'petrol',
        body_style: 'sedan', status: 'active'
    };
    const [vehicleData, setVehicleData] = useState(initialVehicleState);
    const [images, setImages] = useState([]);
    const [postedVehicleId, setPostedVehicleId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [uploadingImages, setUploadingImages] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setVehicleData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleImageChange = (e) => {
        // Ensure files exist before setting state
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const uploadImages = async (vehicleId) => {
        if (images.length === 0) return true;

        setUploadingImages(true);
        try {
            if (images.length === 1) {
                // Single image upload endpoint (assumes multipart/form-data for file upload)
                const formData = new FormData();
                formData.append('vehicle', vehicleId);
                formData.append('image', images[0]);

                await axios.post(`${API_BASE_URL}/vehicles/vehicle-images/`, formData, {
                    headers: { 'X-CSRFTOKEN': CSRF_TOKEN, 'Content-Type': 'multipart/form-data' }
                });

            } else {
                // Bulk image upload endpoint
                // NOTE: The cURL suggested passing an array of "string" which usually means base64 image data 
                // for bulk JSON uploads. We must convert files to base64 before sending.
                
                const base64Images = await Promise.all(images.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result.split(',')[1]); // Only the base64 data part
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(file);
                    });
                }));


                await axios.post(`${API_BASE_URL}/vehicles/vehicle-images/bulk-upload/`, {
                    vehicle: vehicleId,
                    images: base64Images
                }, {
                    headers: { 'X-CSRFTOKEN': CSRF_TOKEN, 'Content-Type': 'application/json' }
                });
            }
            return true;
        } catch (error) {
            console.error('Image Upload Error:', error.response || error);
            setMessage({ type: 'error', text: 'Vehicle details saved, but image upload failed.' });
            return false;
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmitVehicle = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        setPostedVehicleId(null);

        // Prepare API payload, ensuring year and mileage are correct types
        const payload = {
            ...vehicleData,
            year: parseInt(vehicleData.year),
            mileage: parseFloat(vehicleData.mileage),
        };

        try {
            // Step 1: Post Vehicle Details (application/json)
            const response = await axios.post(`${API_BASE_URL}/vehicles/vehicles/`, payload, {
                headers: { 'X-CSRFTOKEN': CSRF_TOKEN, 'Content-Type': 'application/json' }
            });

            // Assuming the API returns the new vehicle object with an 'id' or 'vin'
            const vehicleId = response.data.id || response.data.vin; 
            setPostedVehicleId(vehicleId);

            // Step 2: Upload Images (only if details were successful)
            const imagesSuccess = await uploadImages(vehicleId);

            if (imagesSuccess) {
                setMessage({ type: 'success', text: `Vehicle successfully posted! ID: ${vehicleId}` });
                setVehicleData(initialVehicleState);
                setImages([]);
            }

        } catch (error) {
            console.error('Vehicle Post Error:', error.response || error);
            const errorText = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            setMessage({ type: 'error', text: `Failed to post vehicle: ${errorText}` });
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, name, type = 'text', required = true) => (
        <div className="flex flex-col form-row">
            <label htmlFor={name} className="font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={vehicleData[name]}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required={required}
            />
        </div>
    );

    const renderSelect = (label, name, options) => (
        <div className="flex flex-col form-row">
            <label htmlFor={name} className="font-medium text-gray-600 mb-1">{label}</label>
            <select
                id={name}
                name={name}
                value={vehicleData[name]}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-full">
            <h2 className="text-4xl font-bold text-gray-800 border-b pb-4">Post New Vehicle</h2>
            
            {message && (
                <div className={`p-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmitVehicle} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h3 className="text-xl font-semibold text-indigo-700 md:col-span-3">Core Details</h3>
                    {renderInput('VIN', 'vin')}
                    {renderInput('Make', 'make')}
                    {renderInput('Model', 'model')}
                    {renderInput('Year', 'year', 'number')}
                    {renderInput('Color', 'color')}
                    {renderInput('Mileage (km)', 'mileage', 'number')}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h3 className="text-xl font-semibold text-indigo-700 md:col-span-3">Pricing & Status</h3>
                    {renderInput('Price', 'price', 'text')}
                    {renderInput('Starting Price', 'starting_price', 'text')}
                    {renderInput('Registration Number', 'registration_number')}
                    {renderSelect('Status', 'status', [
                        { value: 'active', label: 'Active' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'sold', label: 'Sold' },
                    ])}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h3 className="text-xl font-semibold text-indigo-700 md:col-span-3">Specifications</h3>
                    {renderSelect('Transmission', 'transmission', [
                        { value: 'automatic', label: 'Automatic' },
                        { value: 'manual', label: 'Manual' },
                    ])}
                    {renderSelect('Fuel Type', 'fuel_type', [
                        { value: 'petrol', label: 'Petrol' },
                        { value: 'diesel', label: 'Diesel' },
                        { value: 'electric', label: 'Electric' },
                    ])}
                    {renderSelect('Body Style', 'body_style', [
                        { value: 'sedan', label: 'Sedan' },
                        { value: 'suv', label: 'SUV' },
                        { value: 'truck', label: 'Truck' },
                        { value: 'coupe', label: 'Coupe' },
                    ])}
                    <div className="flex flex-col md:col-span-3">
                        <label htmlFor="features" className="font-medium text-gray-600 mb-1">Features (Comma Separated)</label>
                        <textarea
                            id="features" name="features" rows="2" value={vehicleData.features}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex flex-col md:col-span-3">
                        <label htmlFor="description" className="font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                            id="description" name="description" rows="4" value={vehicleData.description}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Images Upload</h3>
                    <p className="text-sm text-gray-500">Select one or more images to upload with this vehicle.</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {images.length > 0 && (
                        <p className="text-sm text-green-600">Selected {images.length} file(s) for upload.</p>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploadingImages}
                        className="flex items-center bg-indigo-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 disabled:bg-indigo-400"
                    >
                        {(loading || uploadingImages) ? (
                            <>
                                <LoadingSpinner />
                                <span className="ml-2">{uploadingImages ? 'Uploading Images...' : 'Posting Vehicle...'}</span>
                            </>
                        ) : (
                            <>
                                <FaCloudUploadAlt className="w-5 h-5 mr-2" />
                                Post Vehicle Listing
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};


const ProfileUpdateContent = ({ dealerData, setDealerData, activeTab, setActiveTab, setFormMessage, formMessage, handleSubmit, handleChange, fetchDealerProfile }) => {

    // Fetch profile data when the component mounts
    useEffect(() => {
        fetchDealerProfile();
    }, [fetchDealerProfile]);

    const renderFormSection = (title, fields, currentData) => (
        <div className="form-section bg-white p-6 rounded-xl shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-4">
                {fields.map(field => (
                    <div className="flex flex-col sm:flex-row sm:items-center form-row gap-4" key={field.name}>
                        <label htmlFor={field.name} className="sm:w-1/3 font-medium text-gray-600">{field.label}</label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={currentData[field.name] || ''}
                            onChange={handleChange}
                            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            required={field.required}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="tab-content">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Dealer Documents</h3>
            <p className="text-gray-600 mb-4">This section would show the status of mandatory dealer verification documents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 documents-grid">
                {[
                    { title: "Trade License", status: "Approved", date: "2024-01-15" },
                    { title: "Tax Registration", status: "Pending", date: "2024-03-20" },
                    { title: "Bank Statement", status: "Rejected", date: "2024-05-01" },
                ].map((doc, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-inner flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className={`text-sm ${doc.status === 'Approved' ? 'text-green-600' : doc.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>Status: {doc.status}</p>
                            <p className="text-xs text-gray-500">Last Update: {doc.date}</p>
                        </div>
                        <button className="bg-indigo-500 text-white text-sm py-1 px-3 rounded-full hover:bg-indigo-600 transition-colors">View/Upload</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="tab-content p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Profile Information</h3>

            {formMessage && (
                <div className={`p-3 mb-4 rounded-lg text-white font-medium ${formMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {formMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {renderFormSection("Company & Contact Details", [
                    { name: "company_name", label: "Company Name", type: "text", required: true },
                    { name: "email", label: "Email Address", type: "email", required: true },
                    { name: "phone", label: "Phone Number", type: "tel", required: true },
                ], dealerData)}

                {renderFormSection("Business Location", [
                    { name: "address", label: "Street Address", type: "text", required: true },
                    { name: "city", label: "City", type: "text", required: true },
                    { name: "state", label: "State/Region", type: "text", required: true },
                    { name: "country", label: "Country", type: "text", required: true },
                ], dealerData)}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors transform hover:scale-105"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="dealer-container p-4 sm:p-8 bg-gray-50 min-h-full">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <header className="dealer-header bg-indigo-700 text-white p-4 sm:p-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="dealer-identity flex items-center mb-4 md:mb-0">
                        <div className="w-20 h-20 bg-white text-indigo-700 rounded-full flex items-center justify-center text-4xl mr-4 shadow-lg">
                            <FaUser />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold">{dealerData.company_name || 'Loading Company...'}</h2>
                            <p className="text-indigo-200">{dealerData.email || 'N/A'}</p>
                        </div>
                    </div>
                </header>

                <div className="tab-navigation flex border-b border-gray-200 bg-white">
                    <button
                        className={`tab-button px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'form' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                        onClick={() => setActiveTab('form')}
                    >
                        Contact & Business Info
                    </button>
                    <button
                        className={`tab-button px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'documents' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Document Status
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {activeTab === 'form' ? renderForm() : renderDocuments()}
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component ---

const App = () => {
    // --- State Management ---
    const [activeSection, setActiveSection] = useState('Home');
    const [dealerData, setDealerData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('form');
    const [formMessage, setFormMessage] = useState(null);

    // Function to fetch dealer data (Memoized for use in useEffect dependency)
    const fetchDealerProfile = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/dealers/dealer-profiles/${DEALER_ID}/`, {
                headers: { 'X-CSRFTOKEN': CSRF_TOKEN }
            });
            setDealerData(response.data);
        } catch (err) {
            console.error('Fetch Error:', err.response || err);
            setError('Failed to load dealer profile. Check console for API details.');
            // Set minimal default data structure on failure
            setDealerData({ company_name: 'Dealer', email: 'N/A' });
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means it only runs on mount

    // --- Profile Update Handlers (for ProfileUpdateContent) ---

    const handleChange = (e) => {
        setDealerData({ ...dealerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage(null);
        setLoading(true);

        const formData = new FormData();
        // Append all fields required by the cURL request to FormData
        ['company_name', 'address', 'city', 'state', 'country', 'phone', 'email'].forEach(key => {
             // Only append if the key exists in dealerData to prevent sending 'undefined'
            if (dealerData[key]) {
                formData.append(key, dealerData[key]);
            }
        });

        try {
            await axios.put(`${API_BASE_URL}/dealers/dealer-profiles/${DEALER_ID}/`, formData, {
                headers: {
                    'X-CSRFTOKEN': CSRF_TOKEN,
                    'accept': 'application/json',
                    // axios automatically sets Content-Type to multipart/form-data for FormData
                },
            });
            setFormMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Re-fetch data to confirm
            await fetchDealerProfile(); 
        } catch (err) {
            const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            setFormMessage({ type: 'error', text: `Failed to save changes. Error: ${errorDetail}` });
            console.error('Profile Update Error:', err.response || err);
        } finally {
            setLoading(false);
        }
    };

    // --- General Handlers ---

    const handleLogout = () => {
        console.log('Logging out...');
        // Placeholder for real logout logic
        setFormMessage({ type: 'success', text: 'You have been logged out (Mock action).' });
        setTimeout(() => setFormMessage(null), 3000);
    };

    // --- Content Router ---

    const renderContent = () => {
        if (loading && activeSection !== 'PostVehicle') return <LoadingSpinner />;
        
        switch (activeSection) {
            case 'Home':
                return <HomeContent dealerData={dealerData} />;
            case 'PostVehicle':
                return <PostVehicleContent />;
            case 'MyVehicles':
                return <MyVehiclesContent />;
            case 'ProfileUpdate':
                return (
                    <ProfileUpdateContent
                        dealerData={dealerData}
                        setDealerData={setDealerData}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        formMessage={formMessage}
                        setFormMessage={setFormMessage}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        fetchDealerProfile={fetchDealerProfile}
                    />
                );
            default:
                return <HomeContent dealerData={dealerData} />;
        }
    };

    // --- Main Layout ---

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <style jsx="true">{`
                /* Simple Scrollbar Styling for aesthetics */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
            
            {/* Sidebar Navigation */}
            <Sidebar
                active={activeSection}
                setActive={setActiveSection}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
