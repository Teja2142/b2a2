import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMicrophone, faCamera, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [location, setLocation] = useState("Detecting...");
  const [language, setLanguage] = useState("Detecting...");
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [textIndex, setTextIndex] = useState(0);
  const messages = ["WELL COME TO B2A2 CARS CLUB", "DREAM YOUR CARS WITH US"];

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setLocation(data.country_name);
        setLanguage(getLanguageByCountry(data.country_code));
      })
      .catch(() => {
        setLocation("Unknown");
        setLanguage("English");
      });

    const timer1 = setTimeout(() => setTextIndex(1), 3000);
    return () => clearTimeout(timer1);
  }, []);

  const getLanguageByCountry = (code) => {
    const languageMap = {
      US: "English", IN: "English", FR: "French", DE: "German", CN: "Chinese", JP: "Japanese",
      RU: "Russian", ES: "Spanish", BR: "Portuguese", IT: "Italian",
    };
    return languageMap[code] || "English";
  };


  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      {/* Top Header */}
      <div style={{ backgroundColor: "#2e5771", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 3%", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: "60px" }} />
          <div style={{ marginLeft: "15px" }}>
            <h2 style={{ margin: 0, fontWeight: "bold" }}>B<sub>2</sub>A<sub>2</sub> CARS CLUB</h2>
          </div>
        </div>
        <div style={{ textAlign: "center", flexGrow: 1 }}>
          <h2 style={{ margin: 0, fontWeight: "bold" }}>{messages[textIndex]}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <a href="tel:+13147327749" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPhone} style={{ fontSize: "22px", cursor: "pointer" }} />
          </a>
          <a href="https://wa.me/13147327749" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "25px", cursor: "pointer", color: "#25D366" }} />
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} style={{ fontSize: "25px", cursor: "pointer", color: "#1DA1F2" }} />
          </a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} style={{ fontSize: "25px", cursor: "pointer", color: "#C13584" }} />
          </a>
          <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} style={{ fontSize: "25px", cursor: "pointer", color: "#1877F2" }} />
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px", cursor: "pointer", color: "#0077B5" }} />
          </a>
        </div>

      </div>

      {/* Search + Nav + Location Row */}
      <div style={{ backgroundColor: "#32556d", padding: "10px 3%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#1d3a4d", borderRadius: "30px", padding: "10px 20px", flex: 1, maxWidth: "200px" }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: "#fff", fontSize: "18px" }} />
            <input type="text" placeholder="Search here" style={{ flex: 1, marginLeft: "10px", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px" }} />
            <FontAwesomeIcon icon={faMicrophone} style={{ color: "#fff", margin: "0 10px", fontSize: "18px" }} />
            <FontAwesomeIcon icon={faCamera} style={{ color: "#fff", fontSize: "18px" }} />
          </div>

          {/* Navigation Links */}
          <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            marginLeft: "30px", // Adjusted margin to align properly
          }}
        >
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/">HOME </Link></li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/vehicles">VEHICLES </Link></li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Auctions"> AUCTION </Link> </li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/About">ABOUT US </Link></li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Contact"> CONTACT </Link></li>
          <li>SERVICES</li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Login">LOGIN</Link></li>
          <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Admin">Admin</Link></li>

        </ul>

          {/* Location */}
          <div style={{ color: "#fff", fontSize: "16px", whiteSpace: "nowrap" }}>
            <span>{location} - {language}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
