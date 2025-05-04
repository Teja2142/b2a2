import React, { useState } from "react";
import axios from "axios";

const Vehicle = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    condition: "",
    body_style: "",
    exterior_color: "",
    interior_color: "",
    transmission: "",
    drivetrain: "",
    fuel_economy: "",
    availability: "Available", // This will change to 'Sold' when someone buys it
    image_url: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/vehicles/", formData);
      setMessage("✅ Vehicle added successfully!");
      setFormData({
        make: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        condition: "",
        body_style: "",
        exterior_color: "",
        interior_color: "",
        transmission: "",
        drivetrain: "",
        fuel_economy: "",
        availability: "Available",
        image_url: "",
      });
    } catch (error) {
      setMessage("❌ Failed to add vehicle. Please try again.");
      console.error(error);
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "2.5rem",
      background: "linear-gradient(to right, #fdf2e9, #f0fdfa)",
      borderRadius: "1.5rem",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        marginBottom: "2rem",
        textAlign: "center",
        fontSize: "28px",
        color: "#111827",
        fontWeight: "700"
      }}>🚗 Post a New Vehicle</h2>
      <form onSubmit={handleSubmit} style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.25rem"
      }}>
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            value={value}
            onChange={handleChange}
            required={key !== "image_url"}
            style={{
              padding: "12px",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              fontSize: "15px",
              backgroundColor: "#fff",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
              transition: "box-shadow 0.2s ease-in-out"
            }}
          />
        ))}
        <div style={{ gridColumn: "1 / -1" }}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontWeight: "600",
              fontSize: "17px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4338ca")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4f46e5")}
          >
            🚀 Submit Vehicle
          </button>
        </div>
      </form>
      {message && <p style={{
        marginTop: "2rem",
        textAlign: "center",
        color: message.includes("✅") ? "#15803d" : "#dc2626",
        fontWeight: "600",
        fontSize: "16px"
      }}>{message}</p>}
    </div>
  );
};

export default Vehicle;
