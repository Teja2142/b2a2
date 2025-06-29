import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMicrophone, faCamera, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { faWhatsapp, faTwitter, faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Navbar = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const navigate = useNavigate();
  const messages = ["WELCOME TO B2A2 CARS CLUB", "DREAM YOUR CARS WITH US"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTextIndex(prev => (prev + 1) % messages.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('user'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const addTranslateScript = () => {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function () {
          new window.google.translate.TranslateElement({ pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL }, 'google_translate_element');
        };
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      }
    };
    addTranslateScript();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#2e5771", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 3%", flexWrap: "wrap", gap: "15px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: "60px" }} />
          <div style={{ marginLeft: "15px" }}><h2 style={{ margin: 0, fontWeight: "bold" }}>B<sub>2</sub>A<sub>2</sub> CARS CLUB</h2></div>
        </div>
        <div style={{ textAlign: "center", flexGrow: 1 }}><h2 style={{ margin: 0, fontWeight: "bold" }}>{messages[textIndex]}</h2></div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <a href="tel:+13147327749" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faPhone} style={{ fontSize: "22px", cursor: "pointer" }} /></a>
          <a href="https://wa.me/13147327749" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "25px", cursor: "pointer", color: "#25D366" }} /></a>
          <a href="https://twitter.com/B2A2CarsClub" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} style={{ fontSize: "25px", cursor: "pointer", color: "#1DA1F2" }} /></a>
          <a href="https://instagram.com/B2A2CarsClub" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} style={{ fontSize: "25px", cursor: "pointer", color: "#C13584" }} /></a>
          <a href="https://facebook.com/B2A2CarsClub" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} style={{ fontSize: "25px", cursor: "pointer", color: "#1877F2" }} /></a>
          <a href="https://linkedin.com/company/B2A2CarsClub" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px", cursor: "pointer", color: "#0077B5" }} /></a>
        </div>
      </div>

      <div style={{ backgroundColor: "#32556d", padding: "10px 3%" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#1d3a4d", borderRadius: "30px", padding: "10px 20px", flex: isMobile ? "1 1 100%" : 1, maxWidth: isMobile ? "100%" : "200px", order: isMobile ? 2 : 0, marginTop: isMobile ? "10px" : 0 }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: "#fff", fontSize: "18px" }} />
            <input type="text" placeholder="Search here" style={{ flex: 1, marginLeft: "10px", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px" }} />
            <FontAwesomeIcon icon={faMicrophone} style={{ color: "#fff", margin: "0 10px", fontSize: "18px" }} />
            <FontAwesomeIcon icon={faCamera} style={{ color: "#fff", fontSize: "18px" }} />
          </div>

          <ul style={{ listStyle: "none", display: "flex", gap: isMobile ? "10px" : "20px", fontSize: isMobile ? "14px" : "16px", fontWeight: "bold", margin: isMobile ? "10px 0" : "0", padding: 0, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", order: isMobile ? 1 : 0, flex: isMobile ? "1 1 100%" : "initial" }}>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/">HOME</Link></li>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/vehicles">VEHICLES</Link></li>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Auctions">AUCTION</Link></li>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/About">ABOUT US</Link></li>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Contact">CONTACT</Link></li>
            <li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Services">SERVICES</Link></li>
            {isLoggedIn ? (<li><button style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }} onClick={handleLogout}>LOGOUT</button></li>) : (<li><Link style={{ color: "#fff", textDecoration: "none" }} to="/Login">LOGIN</Link></li>)}
          </ul>

          <div id="google_translate_element" style={{ color: "#fff", fontSize: "16px", order: 3, maxHeight: "150px", overflowY: "auto", padding: "5px", backgroundColor: "#1d3a4d", borderRadius: "8px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
