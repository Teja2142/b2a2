import React, { useState, useEffect } from "react";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]); // Store all vehicles
  const [filters, setFilters] = useState({
    condition: "All",
    bodyStyle: "All",
    make: "All",
    model: "All",
    maxPrice: "All",
    maxMileage: "All",
    availability: "All", 
  });

  useEffect(() => {
    // Fetch vehicle data from Django backend
    fetch("https://api.b2a2cars.com/api/vehicles/vehicles/")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter vehicles based on selected criteria
  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      (filters.condition === "All" || vehicle.condition === filters.condition) &&
      (filters.bodyStyle === "All" || vehicle.body_style === filters.bodyStyle) &&
      (filters.make === "All" || vehicle.make === filters.make) &&
      (filters.model === "All" || vehicle.model === filters.model) &&
      (filters.maxPrice === "All" || vehicle.price <= Number(filters.maxPrice)) &&
      (filters.maxMileage === "All" || vehicle.mileage <= Number(filters.maxMileage)) &&
      (filters.availability === "All" || vehicle.availability === filters.availability) // New availability filter
    );
  });

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Sidebar Filters */}
      <div style={{ width: "250px", padding: "20px", borderRight: "2px solid #ccc" }}>
        <h2>Filter Inventory</h2>
        
        {/* Availability Filter */}
        <div style={{ marginBottom: "10px" }}>
          <label>Availability</label>
          <select name="availability" value={filters.availability} onChange={handleFilterChange} style={{ width: "100%", padding: "8px" }}>
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {["condition", "bodyStyle", "make", "model", "maxPrice", "maxMileage"].map((filter) => (
          <div key={filter} style={{ marginBottom: "10px" }}>
            <label>{filter.replace(/([A-Z])/g, " $1")}</label>
            <select name={filter} value={filters[filter]} onChange={handleFilterChange} style={{ width: "100%", padding: "8px" }}>
              <option value="All">All</option>
              {/* Dynamically add options from available vehicle data */}
              {[...new Set(vehicles.map((v) => v[filter.toLowerCase()]))].map((option, index) => (
                option && <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Vehicle Display */}
      <div style={{ flex: "1", padding: "20px" }}>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} style={{ border: "1px solid #ccc", borderRadius: "8px", marginBottom: "20px", padding: "15px", display: "flex" }}>
              <img src={vehicle.image_url} alt={vehicle.make} style={{ width: "200px", height: "auto", marginRight: "15px" }} />
              <div>
                <h3 style={{ fontWeight: "bold" }}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <p><strong>Price:</strong> ${vehicle.price} | <strong>Mileage:</strong> {vehicle.mileage}</p>
                <p><strong>Exterior Color:</strong> {vehicle.exterior_color} | <strong>Interior Color:</strong> {vehicle.interior_color}</p>
                <p><strong>Transmission:</strong> {vehicle.transmission} | <strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
                <p><strong>Fuel Economy:</strong> {vehicle.fuel_economy} mpg</p>
                <p><strong>Status:</strong> {vehicle.availability}</p> {/* Display availability status */}
              </div>
            </div>
          ))
        ) : (
          <p>No vehicles match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
