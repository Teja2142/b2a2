import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostVehicle = () => {
  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: '',
    features: '',
    description: '',
    transmission: '',
    fuel_type: '',
    body_style: '',
    registration_number: '',
    price: '',
    status: 'active',
    starting_price: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // API configuration
  const API_BASE_URL = 'https://api.b2a2cars.com/api/vehicles';
  const CSRF_TOKEN = 'UXMmkXokhtQRoJ8SrJ93Vrs5CTrHN580';
  const AUTH_TOKEN = 'admin';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const createVehicle = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/vehicles/`,
        new URLSearchParams(formData),
        {
          headers: {
            'accept': 'multipart/form-data',
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFTOKEN': CSRF_TOKEN
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create vehicle: ${error.response?.data?.message || error.message}`);
    }
  };

  const uploadImages = async (vehicleId) => {
    if (!images.length) return;

    const formData = new FormData();
    
    // Add all images
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    // Add vehicle reference
    formData.append('vehicle', vehicleId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/vehicle-images/bulk-upload/`,
        formData,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'multipart/form-data',
            'X-CSRFTOKEN': CSRF_TOKEN
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload images: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Create the vehicle
      const vehicleResponse = await createVehicle();
      const vehicleId = vehicleResponse.id || 'vehicle'; // Fallback to string if no ID

      // Step 2: Upload images if any
      if (images.length > 0) {
        await uploadImages(vehicleId);
      }

      showMessage('Vehicle posted successfully!', 'success');
      
      // Reset form
      setFormData({
        vin: '',
        make: '',
        model: '',
        year: '',
        color: '',
        mileage: '',
        features: '',
        description: '',
        transmission: '',
        fuel_type: '',
        body_style: '',
        registration_number: '',
        price: '',
        status: 'active',
        starting_price: ''
      });
      setImages([]);

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Post New Vehicle</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Basic Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">Basic Information</h5>
                    
                    <div className="mb-3">
                      <label htmlFor="vin" className="form-label">VIN *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vin"
                        name="vin"
                        value={formData.vin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="make" className="form-label">Make *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="make"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="model" className="form-label">Model *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="year" className="form-label">Year *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        min="1900"
                        max="2030"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="color" className="form-label">Color</label>
                      <input
                        type="text"
                        className="form-control"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mileage" className="form-label">Mileage</label>
                      <input
                        type="number"
                        className="form-control"
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">Additional Details</h5>
                    
                    <div className="mb-3">
                      <label htmlFor="transmission" className="form-label">Transmission</label>
                      <select
                        className="form-select"
                        id="transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Transmission</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                        <option value="semi-automatic">Semi-Automatic</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="fuel_type" className="form-label">Fuel Type</label>
                      <select
                        className="form-select"
                        id="fuel_type"
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="body_style" className="form-label">Body Style</label>
                      <input
                        type="text"
                        className="form-control"
                        id="body_style"
                        name="body_style"
                        value={formData.body_style}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="registration_number" className="form-label">Registration Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="registration_number"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="starting_price" className="form-label">Starting Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id="starting_price"
                        name="starting_price"
                        value={formData.starting_price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Description and Features */}
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="features" className="form-label">Features</label>
                      <textarea
                        className="form-control"
                        id="features"
                        name="features"
                        rows="3"
                        value={formData.features}
                        onChange={handleInputChange}
                        placeholder="Enter vehicle features separated by commas"
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter vehicle description"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h5 className="mb-3 text-primary">Vehicle Images</h5>
                    <div className="mb-3">
                      <label htmlFor="images" className="form-label">Upload Images</label>
                      <input
                        type="file"
                        className="form-control"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="form-text">
                        You can select multiple images. Supported formats: JPG, JPEG, PNG
                      </div>
                    </div>
                    
                    {images.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          {images.length} image(s) selected
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="sold">Sold</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row mt-4">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Posting Vehicle...
                        </>
                      ) : (
                        'Post Vehicle'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostVehicle;