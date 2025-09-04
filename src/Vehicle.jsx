import React, { useState } from "react";
import axios from "axios";

const Vehicle = () => {
  const [formData, setFormData] = useState({
    // Basic Vehicle Details
    listingId: "",
    vehicleTitle: "",
    make: "",
    model: "",
    variantTrim: "",
    modelYear: "",
    vin: "",
    bodyType: "",
    driveType: "",
    fuelType: "",
    transmission: "",
    engineSize: "",
    mileage: "",
    exteriorColor: "",
    interiorColor: "",
    conditionScore: "",

    // Media & Visual Engagement
    exteriorTour360: "",
    interiorPanorama: "",
    videoWalkaround: "",
    imageGallery: [],
    damageHotspots: "",

    // Inspection & Documentation
    conditionReport: "",
    serviceHistory: "",
    carfaxReport: "",
    titleStatus: "",
    titleDocument: "",
    emissionTest: "",

    // Auction Configuration
    auctionType: "",
    startingBid: "",
    buyNowPrice: "",
    reservePrice: "",
    bidIncrement: "",
    auctionStart: "",
    auctionEnd: "",
    proxyBidding: false,

    // Pricing & Payment
    currency: "USD",
    escrowPayment: false,
    securityDeposit: "",
    digitalWallet: false,
    installmentFinancing: false,

    // Listing Metadata
    specialFeatures: [],
    featuredListing: false,

    // Post-Sale Options
    extendedWarranty: false,
    serviceSupport: false
  });

  const [activeSection, setActiveSection] = useState("basic");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleMultiSelect = (e) => {
    const { name, value } = e.target;
    const currentValues = formData[name] || [];
    
    if (currentValues.includes(value)) {
      setFormData({
        ...formData,
        [name]: currentValues.filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: [...currentValues, value]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/vehicles/vehicles/", formData);
      setMessage("✅ Vehicle listed successfully!");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("❌ Failed to list vehicle. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureOptions = [
    "Sunroof", "Leather Seats", "Navigation", "Heated Seats",
    "Backup Camera", "Bluetooth", "Apple CarPlay", "Android Auto",
    "Premium Sound", "Alloy Wheels", "Towing Package", "Third Row Seating"
  ];

  const renderSection = () => {
    // Styles for form elements that repeat
    const inputStyle = {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const inputFocusStyle = {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
    };

    const fileInputStyle = {
      width: '100%',
      padding: '0.5rem',
      border: '1px dashed #d1d5db',
      borderRadius: '8px',
    };

    switch (activeSection) {
      case "basic":
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              gridColumn: '1 / -1',
              fontSize: '1.4rem',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}>Basic Vehicle Details</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Vehicle Title*</label>
              <input
                type="text"
                name="vehicleTitle"
                value={formData.vehicleTitle}
                onChange={handleChange}
                placeholder="e.g., 2019 Toyota Camry SE"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Make*</label>
              <select
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Make</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Model*</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Model</option>
                {/* These would be dynamically populated based on make in a real app */}
                <option value="Camry">Camry</option>
                <option value="Corolla">Corolla</option>
                <option value="RAV4">RAV4</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Variant/Trim</label>
              <input
                type="text"
                name="variantTrim"
                value={formData.variantTrim}
                onChange={handleChange}
                placeholder="e.g., SE, LE, XLE"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Model Year*</label>
              <select
                name="modelYear"
                value={formData.modelYear}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Year</option>
                {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>VIN (Vehicle ID Number)*</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="17-character VIN"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Body Type*</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Body Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Van/Minivan">Van/Minivan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Drive Type*</label>
              <select
                name="driveType"
                value={formData.driveType}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Drive Type</option>
                <option value="FWD">Front-Wheel Drive (FWD)</option>
                <option value="RWD">Rear-Wheel Drive (RWD)</option>
                <option value="AWD">All-Wheel Drive (AWD)</option>
                <option value="4WD">Four-Wheel Drive (4WD)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Fuel Type*</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Fuel Type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Transmission*</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="Dual-Clutch">Dual-Clutch</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Engine Size</label>
              <input
                type="text"
                name="engineSize"
                value={formData.engineSize}
                onChange={handleChange}
                placeholder="e.g., 2.5L I4"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Mileage*</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Miles"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Exterior Color*</label>
              <input
                type="text"
                name="exteriorColor"
                value={formData.exteriorColor}
                onChange={handleChange}
                placeholder="e.g., Midnight Black"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Interior Color*</label>
              <input
                type="text"
                name="interiorColor"
                value={formData.interiorColor}
                onChange={handleChange}
                placeholder="e.g., Beige Leather"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Condition Score (1-5)*</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      color: formData.conditionScore >= star ? '#f59e0b' : '#d1d5db',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      padding: '0',
                    }}
                    onClick={() => setFormData({...formData, conditionScore: star})}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "media":
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              gridColumn: '1 / -1',
              fontSize: '1.4rem',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}>Media & Visual Engagement</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>360° Exterior Tour</label>
              <input
                type="file"
                name="exteriorTour360"
                onChange={handleFileChange}
                accept="video/*,image/*"
                style={fileInputStyle}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Upload a 360° video or interactive file</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Interior Panorama View</label>
              <input
                type="file"
                name="interiorPanorama"
                onChange={handleFileChange}
                accept="video/*,image/*"
                style={fileInputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Video Walkaround</label>
              <input
                type="file"
                name="videoWalkaround"
                onChange={handleFileChange}
                accept="video/*"
                style={fileInputStyle}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Upload a walkaround video (max 5min)</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Image Gallery</label>
              <input
                type="file"
                name="imageGallery"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                style={fileInputStyle}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Upload high-quality photos (min 6 images)</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Damage Hotspots</label>
              <input
                type="file"
                name="damageHotspots"
                onChange={handleFileChange}
                accept="image/*"
                style={fileInputStyle}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Upload annotated images showing any damage</p>
            </div>
          </div>
        );
      
      case "auction":
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              gridColumn: '1 / -1',
              fontSize: '1.4rem',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}>Auction Configuration</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Auction Type*</label>
              <select
                name="auctionType"
                value={formData.auctionType}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="">Select Auction Type</option>
                <option value="Timed">Timed Auction</option>
                <option value="Live">Live Auction</option>
                <option value="Buy Now">Buy Now Only</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Starting Bid*</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#6b7280', fontWeight: '500' }}>$</span>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="100"
                  required
                  style={{ ...inputStyle, paddingLeft: '30px' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { paddingLeft: '30px' })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle, { paddingLeft: '30px' })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Buy Now Price</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#6b7280', fontWeight: '500' }}>$</span>
                <input
                  type="number"
                  name="buyNowPrice"
                  value={formData.buyNowPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="100"
                  style={{ ...inputStyle, paddingLeft: '30px' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { paddingLeft: '30px' })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle, { paddingLeft: '30px' })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Reserve Price</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#6b7280', fontWeight: '500' }}>$</span>
                <input
                  type="number"
                  name="reservePrice"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="100"
                  style={{ ...inputStyle, paddingLeft: '30px' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { paddingLeft: '30px' })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle, { paddingLeft: '30px' })}
                />
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Minimum price you're willing to accept</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Bid Increment*</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#6b7280', fontWeight: '500' }}>$</span>
                <input
                  type="number"
                  name="bidIncrement"
                  value={formData.bidIncrement}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="50"
                  required
                  style={{ ...inputStyle, paddingLeft: '30px' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { paddingLeft: '30px' })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle, { paddingLeft: '30px' })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Auction Start*</label>
              <input
                type="datetime-local"
                name="auctionStart"
                value={formData.auctionStart}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Auction End*</label>
              <input
                type="datetime-local"
                name="auctionEnd"
                value={formData.auctionEnd}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="proxyBidding"
                checked={formData.proxyBidding}
                onChange={handleChange}
                id="proxyBidding"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="proxyBidding" style={{ marginBottom: '0', fontWeight: '400' }}>Enable Proxy Bidding</label>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Allows automatic bidding up to buyer's max</p>
            </div>
          </div>
        );
      
      case "payment":
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              gridColumn: '1 / -1',
              fontSize: '1.4rem',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}>Pricing & Payment Details</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Currency Display*</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="escrowPayment"
                checked={formData.escrowPayment}
                onChange={handleChange}
                id="escrowPayment"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="escrowPayment" style={{ marginBottom: '0', fontWeight: '400' }}>Enable Escrow Payment</label>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Funds held by third party until delivery</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Security Deposit</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#6b7280', fontWeight: '500' }}>$</span>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="100"
                  style={{ ...inputStyle, paddingLeft: '30px' }}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { paddingLeft: '30px' })}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle, { paddingLeft: '30px' })}
                />
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Required from bidders (refundable)</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="digitalWallet"
                checked={formData.digitalWallet}
                onChange={handleChange}
                id="digitalWallet"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="digitalWallet" style={{ marginBottom: '0', fontWeight: '400' }}>Accept Digital Wallet Payments</label>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Enable cryptocurrency payments</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="installmentFinancing"
                checked={formData.installmentFinancing}
                onChange={handleChange}
                id="installmentFinancing"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="installmentFinancing" style={{ marginBottom: '0', fontWeight: '400' }}>Offer Installment Financing</label>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Allow buyers to pay in installments</p>
            </div>
          </div>
        );
      
      case "features":
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              gridColumn: '1 / -1',
              fontSize: '1.4rem',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}>Special Features</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.95rem',
              }}>Select Special Features</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}>
                {featureOptions.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      name="specialFeatures"
                      value={feature}
                      checked={formData.specialFeatures.includes(feature)}
                      onChange={handleMultiSelect}
                      style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
                    />
                    <label htmlFor={`feature-${feature}`} style={{ marginBottom: '0', fontWeight: '400' }}>{feature}</label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="featuredListing"
                checked={formData.featuredListing}
                onChange={handleChange}
                id="featuredListing"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="featuredListing" style={{ marginBottom: '0', fontWeight: '400' }}>Featured Listing</label>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginTop: '0.3rem',
              }}>Promote this listing for higher visibility</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="extendedWarranty"
                checked={formData.extendedWarranty}
                onChange={handleChange}
                id="extendedWarranty"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="extendedWarranty" style={{ marginBottom: '0', fontWeight: '400' }}>Eligible for Extended Warranty</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                name="serviceSupport"
                checked={formData.serviceSupport}
                onChange={handleChange}
                id="serviceSupport"
                style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
              />
              <label htmlFor="serviceSupport" style={{ marginBottom: '0', fontWeight: '400' }}>Offer Post-Sale Service Support</label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '2rem',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.2rem',
          color: '#111827',
          marginBottom: '0.5rem',
          fontWeight: '700',
        }}>🚘 Create New Vehicle Listing</h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Fill in all required details to list your vehicle for auction</p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2.5rem',
        position: 'relative',
      }}>
        {/* Pseudo-element for line */}
        <div style={{
          content: "''",
          position: 'absolute',
          top: '20px',
          left: '0',
          right: '0',
          height: '4px',
          background: '#e5e7eb',
          zIndex: '1',
        }}></div>

        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
          onClick={() => setActiveSection("basic")}
        >
          <span style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: activeSection === "basic" ? '#4f46e5' : '#e5e7eb',
            color: activeSection === "basic" ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}>1</span>
          <span style={{
            color: activeSection === "basic" ? '#111827' : '#6b7280',
            fontSize: '0.9rem',
            fontWeight: activeSection === "basic" ? '600' : '500',
          }}>Basic Details</span>
        </button>
        
        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
          onClick={() => setActiveSection("media")}
        >
          <span style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: activeSection === "media" ? '#4f46e5' : '#e5e7eb',
            color: activeSection === "media" ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}>2</span>
          <span style={{
            color: activeSection === "media" ? '#111827' : '#6b7280',
            fontSize: '0.9rem',
            fontWeight: activeSection === "media" ? '600' : '500',
          }}>Media</span>
        </button>
        
        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
          onClick={() => setActiveSection("auction")}
        >
          <span style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: activeSection === "auction" ? '#4f46e5' : '#e5e7eb',
            color: activeSection === "auction" ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}>3</span>
          <span style={{
            color: activeSection === "auction" ? '#111827' : '#6b7280',
            fontSize: '0.9rem',
            fontWeight: activeSection === "auction" ? '600' : '500',
          }}>Auction</span>
        </button>
        
        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
          onClick={() => setActiveSection("payment")}
        >
          <span style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: activeSection === "payment" ? '#4f46e5' : '#e5e7eb',
            color: activeSection === "payment" ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}>4</span>
          <span style={{
            color: activeSection === "payment" ? '#111827' : '#6b7280',
            fontSize: '0.9rem',
            fontWeight: activeSection === "payment" ? '600' : '500',
          }}>Payment</span>
        </button>
        
        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
          onClick={() => setActiveSection("features")}
        >
          <span style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: activeSection === "features" ? '#4f46e5' : '#e5e7eb',
            color: activeSection === "features" ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}>5</span>
          <span style={{
            color: activeSection === "features" ? '#111827' : '#6b7280',
            fontSize: '0.9rem',
            fontWeight: activeSection === "features" ? '600' : '500',
          }}>Features</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ /* No specific form style here */ }}>
        {renderSection()}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2rem',
          gridColumn: '1 / -1',
        }}>
          {activeSection !== "basic" && (
            <button
              type="button"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: 'none',
                background: '#f3f4f6',
                color: '#4b5563',
              }}
              onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
              onClick={() => {
                const sections = ["basic", "media", "auction", "payment", "features"];
                const currentIndex = sections.indexOf(activeSection);
                setActiveSection(sections[currentIndex - 1]);
              }}
            >
              ← Previous
            </button>
          )}
          
          {activeSection !== "features" ? (
            <button
              type="button"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: 'none',
                background: '#4f46e5',
                color: 'white',
              }}
              onMouseOver={(e) => e.target.style.background = '#4338ca'}
              onMouseOut={(e) => e.target.style.background = '#4f46e5'}
              onClick={() => {
                const sections = ["basic", "media", "auction", "payment", "features"];
                const currentIndex = sections.indexOf(activeSection);
                setActiveSection(sections[currentIndex + 1]);
              }}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s',
                border: 'none',
                background: isSubmitting ? '#a5b4fc' : '#4f46e5',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer', // Fixed: merged duplicate 'cursor'
              }}
              disabled={isSubmitting}
              onMouseOver={(e) => { if (!isSubmitting) e.target.style.background = '#4338ca'; }}
              onMouseOut={(e) => { if (!isSubmitting) e.target.style.background = '#4f46e5'; }}
            >
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </button>
          )}
        </div>
      </form>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          fontWeight: '500',
          textAlign: 'center',
          background: message.includes("✅") ? '#ecfdf5' : '#fef2f2',
          color: message.includes("✅") ? '#065f46' : '#b91c1c',
          border: `1px solid ${message.includes("✅") ? '#a7f3d0' : '#fecaca'}`,
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Vehicle;
