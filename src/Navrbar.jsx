import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faGlobe, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram, faWhatsapp, faYoutube, faTelegram } from "@fortawesome/free-brands-svg-icons";

const Navbar = () => {
  const [location, setLocation] = useState("Detecting...");
  const [language, setLanguage] = useState("Detecting...");
  const [hoveredMenu, setHoveredMenu] = useState(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.country_name);
        setLanguage(getLanguageByCountry(data.country_code));
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
        setLocation("Unknown");
        setLanguage("English");
      });
  }, []);

  const getLanguageByCountry = (countryCode) => {
    const languageMap = {
      US: "English",
      IN: "English",
      FR: "French",
      DE: "German",
      CN: "Chinese",
      JP: "Japanese",
      RU: "Russian",
      ES: "Spanish",
      BR: "Portuguese",
      IT: "Italian",
    };
    return languageMap[countryCode] || "English";
  };

  const menuItems = [
    { name: "Home", subItems: ["Overview", "News", "Updates"] },
    { name: "Vehicles", subItems: ["New Cars", "Used Cars", "Electric"] },
    { name: "Auctions", subItems: ["Upcoming Auctions", "Past Auctions"] },
    { name: "Shipping", subItems: ["Rates", "Tracking", "Logistics"] },
    { name: "Contact", subItems: ["Support", "Email", "Location"] },
    { name: "About", subItems: ["Our Story", "Careers", "Team"] },
  ];

  return (
    <div style={{ width: "100%", backgroundColor: "#333", color: "#fff", paddingBottom: "10px" }}>
      {/* Top Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 2%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/images/image.png" alt="Logo" style={{ width: "50px", marginRight: "10px" }} />
          <h2>B2A2</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input type="text" placeholder="Search car model..." 
            style={{ padding: "8px", borderRadius: "5px", marginRight: "5px", border: "none", outline: "none" }} />
          <FontAwesomeIcon icon={faSearch} style={{ cursor: "pointer", fontSize: "18px" }} />
        </div>

        <div>
          <FontAwesomeIcon icon={faFacebook} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
          <FontAwesomeIcon icon={faTwitter} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
          <FontAwesomeIcon icon={faInstagram} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
          <FontAwesomeIcon icon={faWhatsapp} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
          <FontAwesomeIcon icon={faYoutube} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
          <FontAwesomeIcon icon={faTelegram} style={{ margin: "0 10px", cursor: "pointer", fontSize: "25px" }} />
        </div>
      </div>

      {/* Bottom Row (Navigation & Location) */}
      <nav style={{ backgroundColor: "#222", padding: "10px 2%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{ position: "relative" }}
              onMouseEnter={() => setHoveredMenu(index)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <a
                href="#"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "bold",
                  padding: "10px 15px",
                  display: "block",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => e.target.style.color = "#ffcc00"}
                onMouseLeave={(e) => e.target.style.color = "#fff"}
              >
                {item.name} <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "5px" }} />
              </a>

              {hoveredMenu === index && (
                <div style={{
                  position: "absolute",
                  top: "40px",
                  left: "0",
                  backgroundColor: "#444",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  borderRadius: "5px",
                  width: "160px",
                  zIndex: 1000
                }}>
                  {item.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href="#"
                      style={{
                        display: "block",
                        padding: "10px",
                        color: "#fff",
                        textDecoration: "none",
                        transition: "0.3s",
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#555"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: "10px", color: "#fff", fontSize: "16px" }}>
          <FontAwesomeIcon icon={faGlobe} style={{ marginRight: "5px" }} />
          <span>{location} - {language}</span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
