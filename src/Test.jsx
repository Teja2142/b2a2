import React, { useState, useEffect, useCallback } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const carImages = [
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss1.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss3.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss2.jpg",
];

const Test = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: windowWidth } = useWindowSize();
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const vehicles = [
    // ... (keep your vehicles array the same)
  ];

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const responsiveStyles = {
    heroContainer: {
      height: isMobile ? "70vh" : "100vh",
      padding: isMobile ? "20px" : "40px",
    },
    heroTitle: {
      fontSize: isMobile ? "2rem" : "3rem",
    },
    heroAddress: {
      fontSize: isMobile ? "1rem" : "1.2rem",
    },
    shopByModelGrid: {
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)",
      gap: isMobile ? "8px" : "10px",
    },
    howItWorksSteps: {
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "24px" : "48px",
    },
    featuredVehicleCard: {
      width: isMobile ? "280px" : "260px",
    },
    buttonGroup: {
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "20px",
    },
  };

  return (
    <div style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
      {/* Title */}
      <h2 style={{ 
        fontSize: isMobile ? "20px" : "24px", 
        fontWeight: "bold", 
        padding: "10px", 
        color: "#333" 
      }}>
        Find your next car at B2A2 From World wide
      </h2>

      {/* Image Container */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img
          src={carImages[currentIndex]}
          alt="Car"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: isMobile ? "300px" : "600px",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>

      <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ ...responsiveStyles.buttonGroup, display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <button style={{
            backgroundColor: '#1F4C6B',
            color: 'white',
            padding: isMobile ? '12px 24px' : '15px 40px',
            fontSize: isMobile ? '14px' : '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'
          }}>VIEW INVENTORY</button>

          <button style={{
            backgroundColor: '#1F4C6B',
            color: 'white',
            padding: isMobile ? '12px 24px' : '15px 40px',
            fontSize: isMobile ? '14px' : '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'
          }}>SCHEDULE SERVICE</button>
        </div>

        <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>SHOP BY MODEL</h3>

        <div style={{
          display: 'grid',
          ...responsiveStyles.shopByModelGrid,
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '90%',
          margin: '0 auto'
        }}>
          {/* ... (keep your shop by model mapping the same) */}
        </div>
      </div>

      {/* How it works */}
      <div style={{ width: '100%', textAlign: 'center', padding: isMobile ? '20px' : '40px', backgroundColor: '#ffffff' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#374151' }}>HOW IT WORKS</h2>
          <span style={{ 
            border: '2px solid #ea580c', 
            color: '#ea580c', 
            padding: '6px 16px', 
            borderRadius: '16px', 
            fontWeight: '700', 
            fontSize: isMobile ? '14px' : '16px' 
          }}>
            EASY AS 1-2-3
          </span>
        </div>

        <div style={{ 
          display: 'flex', 
          ...responsiveStyles.howItWorksSteps, 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '32px', 
          position: 'relative' 
        }}>
          {/* ... (keep your steps mapping the same, remove vertical lines for mobile) */}
        </div>
      </div>

      {/* Featured Vehicles */}
      <div style={{ textAlign: 'center', backgroundColor: '#f8f8f8', padding: isMobile ? '20px 10px' : '40px 20px' }}>
        <h2 style={{ 
          fontSize: isMobile ? '22px' : '26px', 
          fontWeight: '700', 
          color: '#374151', 
          marginBottom: '20px' 
        }}>
          Featured Vehicles
        </h2>
        
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '16px', 
          padding: '10px', 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none' 
        }}>
          {vehicles.map((vehicle, index) => (
            <div key={index} style={{ 
              ...responsiveStyles.featuredVehicleCard,
              borderRadius: '6px', 
              flex: '0 0 auto', 
              position: 'relative', 
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out'
            }}>
              {/* ... (keep your vehicle card content the same) */}
            </div>
          ))}
        </div>
        
        <button style={{ 
          backgroundColor: '#ea580c', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '6px', 
          fontSize: '16px', 
          fontWeight: '600', 
          border: 'none', 
          cursor: 'pointer', 
          marginTop: '20px' 
        }}>
          View All
        </button>
      </div>

      {/* Hero Section */}
      <div style={{ 
        position: "relative",
        width: "100%",
        height: responsiveStyles.heroContainer.height,
        background: "url('https://images.unsplash.com/photo-1485982353291-4f167f9dee32?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9wZW4lMjByb2FkfGVufDB8fDB8fHww') no-repeat center center/cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        padding: responsiveStyles.heroContainer.padding
      }}>
        {/* ... (keep your hero section content the same with responsive styles) */}
      </div>

      {/* Maps */}
      <div style={{
        width: '100%',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '20px 0'
      }}>
        <iframe
          title="Uppal, Hyderabad Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7617.521018140705!2d78.55763133558444!3d17.405233872968334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb987c2e6c315b%3A0xe7432d4cb6ae1e02!2sUppal%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1648544373206!5m2!1sen!2sin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Test;