import React, { useState, useEffect } from "react";

const carImages = [
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss1.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss3.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss2.jpg",
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
      {/* Title */}
      <h2 style={{ fontSize: "24px", fontWeight: "bold", padding: "10px", color: "#333" }}>
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
            maxHeight: "600px",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
