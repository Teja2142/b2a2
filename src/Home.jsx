import React, { useState, useEffect } from "react";
import { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';


  


const carImages = [
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss1.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss3.jpg",
  "https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/ss2.jpg",
];

const Home = () => {

  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    { end: 28593, suffix: '+', label: 'Vehicles Sold' },
    { end: 96, suffix: '%', label: 'Customer Satisfaction' },
    { end: 69, suffix: '+', label: 'Global Partners' }
  ];


  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const vehicles = [
    { year: 2017, make: "SUBARU", model: "FORESTER 2.0XT TOURING", price: "$20,000", miles: "120,000 MILES",image: "https://pictures.dealer.com/v/victorysubarusoa/1661/b57077dd76f32d1e2749304370cffcfbx.jpg"  },
    { year: 2012, make: "HYUNDAI", model: "AZERA", price: "$12,500",miles: "98,000 MILES", image: "https://i0.wp.com/drivenautos.com/images/hyundai-azera-second-generation.jpg?w=750&ssl=1" },
    { year: 2013, make: "FORD", model: "ESCAPE SEL", price: "$6,900", miles: "155,554 MILES", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwsq7D5HjrkN5h75uSMhPRv9UC7tPMJ_iUaQ&s" },
    { year: 2011, make: "JEEP", model: "PATRIOT LATITUDEX", price: "$8,000", image: "https://live.staticflickr.com/8167/6958723466_c0c9b8d9c7_b.jpg" },
    { year: 2018, make: "TOYOTA", model: "CAMRY SE", price: "$18,000", miles: "110,000 MILES",image: "https://img.goodfon.com/original/1920x1080/0/36/toyota-toyota-rav4-gr-sport-hybrid-eksterer.jpg" },
    { year: 2019, make: "NISSAN", model: "ALTIMA SV", price: "$19,500", miles: "80,000 MILES",image: "https://cdn2.picryl.com/photo/2021/12/03/nissan-qashqai-2021-in-nissan-global-hq-gallery-front-6a7ebc-1024.jpg" },
    { year: 2020, make: "HONDA", model: "CIVIC EX", price: "$22,000", miles: "50,000 MILES",image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/2021_Honda_City_Hatchback_RS_1.5_GN5_%2820210922%29.jpg" },
    { year: 2021, make: "TESLA", model: "MODEL 3", price: "$35,000", miles: "30,000 MILES",image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Tesla_Model_3_%282023%29_Auto_Zuerich_2023_1X7A1313.jpg" }
  ];

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);


  return (
    <div style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
      {/* Title */}
      <h2 style={{ fontSize: "24px", fontWeight: "bold", padding: "10px", color: "#333" }}>
        Find your next car at B2A2 From World wide
      </h2>

      {/* Image Container */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={carImages[currentIndex]} alt="Car" style={{ width: "100%", height: "auto", maxHeight: "600px", objectFit: "cover", transition: "opacity 1s ease-in-out", }}/>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
          <button style={{ backgroundColor: '#1F4C6B', color: 'white', padding: '15px 40px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'}}>
            VIEW INVENTORY</button>

          <button style={{ backgroundColor: '#1F4C6B', color: 'white', padding: '15px 40px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>
              SCHEDULE SERVICE</button>
        </div>

        <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>SHOP BY MODEL</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', justifyContent: 'center', alignItems: 'center', maxWidth: '90%', margin: '0 auto'}}>
          {[
            { name: 'COUPE', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon1.png', url: '/coupe' },
            { name: 'SEDAN', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon2.png', url: '/sedan' },
            { name: 'CONVERTIBLE', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon3.png', url: '/convertible' },
            { name: 'MINI VAN', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon4.png', url: '/minivan' },
            { name: 'SUV', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon5.png', url: '/suv' },
            { name: 'TRUCK', imageUrl: 'https://cdn07.carsforsale.com/CustomTemplatePhotos/1035164/photos/icon6.png', url: '/truck' }
          ].map((car, index) => (
            <a key={index} href={car.url} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '100px', fontSize: '14px', textDecoration: 'none', color: '#000' }}>
              <img src={car.imageUrl} alt={car.name} style={{ width: '90px', height: '60px', objectFit: 'contain' }} />
              <span style={{ marginTop: '10px', color: '#666', textDecoration: 'underline' }}>{car.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* how it works */}
      <div
            style={{ width: "100%", textAlign: "center", padding: "40px", backgroundColor: "#ffffff",}}>
            {/* Heading Section */}
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px", }}>
              <h2
                style={{ fontSize: "28px", fontWeight: "700", color: "#374151", margin: "0", }} >
                HOW IT WORKS
              </h2>
              <span
                style={{ border: "2px solid #ea580c", color: "#ea580c", padding: "6px 16px", borderRadius: "16px", fontWeight: "700", fontSize: "16px", whiteSpace: "nowrap", }} >
                EASY AS 1-2-3
              </span>
            </div>

            {/* Steps Section */}
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", marginTop: "32px", position: "relative", flexWrap: "wrap", }} >
              {[
                { icon: "🔍", title: "Find Your Car", button: "ALL INVENTORY" },
                { icon: "🗺", title: "Stop By Our Lot", button: "GET DIRECTIONS" },
                { icon: "🚗", title: "Drive Home Today", button: "LEAVE A TESTIMONIAL" },
              ].map((item, index, arr) => (
                <div
                  key={index}
                  style={{ textAlign: "center", padding: "20px", width: "280px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", }} >
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "20px", fontWeight: "700", color: "#374151", textAlign: "center", flexWrap: "wrap", }} >
                    <span style={{ color: "#ea580c", fontSize: "28px" }}>{item.icon}</span>
                    {item.title}
                  </div>
                  <button
                    style={{ backgroundColor: "#1e3a8a", color: "white", padding: "14px 32px", borderRadius: "6px", marginTop: "16px", fontSize: "16px", fontWeight: "700", border: "none", cursor: "pointer", whiteSpace: "nowrap", }} >
                    {item.button}
                  </button>
                  {/* Vertical Line for larger screens */}
                  {index < arr.length - 1 && (
                    <div
                      style={{ position: "absolute", top: "50%", right: "-24px", height: "80%", width: "2px", backgroundColor: "#d1d5db", display: "none", }} className="vertical-line">

                    </div>
                  )}
                </div>
              ))}
            </div>
      </div>

      {/* cars by make */}
      <div style={{
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    maxWidth: "80%",
    margin: "auto"
    }}>
    <h2 style={{ fontWeight: "bold", color: "#222" }}>Bid on Cars by Make</h2>

    <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        marginTop: "20px"
    }}>
        {["bmw.png", "vw.png", "honda.png", "jeep.png"].map((brand, index) => (
        <img 
            key={index}
            src={`/images/${brand}`}
            alt={brand.split(".")[0]}
            style={{
            width: "120px",
            height: "120px",
            borderRadius: "10px",
            transition: "transform 0.3s ease-in-out",
            cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        />
        ))}
    </div>

    <button style={{
        backgroundColor: "#2d4f64",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "15px",
        transition: "0.3s"
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = "#1b3a50"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#2d4f64"}>
        More
    </button>
    </div>


    <div style={{ backgroundColor: "#a5a5a5", color: "#000", padding: "50px 20px", fontFamily: "sans-serif" }}>
      {/* Top Part: Heading and Description */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "20px" }}>
          Ways to Bid & Buy at <span style={{ fontWeight: "900" }}>B<sub>2</sub>A<sub>2</sub> Auction</span>
        </h1>
        <p style={{ fontSize: "22px", maxWidth: "1200px", margin: "0 auto", fontWeight: "600" }}>
          At Salvage Car Auctions, we offer our members the best auction experience with three convenient ways to bid & buy salvage, clean and repairable cars for sale.
        </p>
      </div>

      {/* Bottom Part: Three Columns (Fixed Row Style) */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "30px", flexWrap: "nowrap", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Left Column */}
        <div style={{ flex: "1", maxWidth: "33%", minWidth: "0" }}>
          <p style={{ fontSize: "20px", fontWeight: "600", lineHeight: "1.6" }}>
            <strong>Bypass pre-bidding and live digital auctions on certain vehicles by instantaneously purchasing cars online with our "Buy It Now" option.</strong><br />
            Although you may still bid on vehicles with the "Buy It Now" option if you'd like, you can also purchase them immediately at a pre-set price. View all "Buy It Now" cars for sale available right now.
          </p>
        </div>

        {/* Middle Column */}
        <div style={{ flex: "1", maxWidth: "33%", minWidth: "0" }}>
          <p style={{ fontSize: "20px", fontWeight: "600", lineHeight: "1.6" }}>
            <strong>Preliminary bidding, also known as a pre-bid,</strong> is a convenient type of bidding option which allows you to place an incremental value bid up to 1 hour before the live auto auction starts. Your pre-bid will be presented during the live auction and could be the winning bid if no other bidder submits a higher bid either during the live auction or during the pre-bidding phase.
          </p>
        </div>

        {/* Right Column */}
        <div style={{ flex: "1", maxWidth: "33%", minWidth: "0" }}>
          <p style={{ fontSize: "20px", fontWeight: "600", lineHeight: "1.6" }}>
            <strong>Live bidding</strong> is a type of internet bidding that allows you to place virtual bids on cars in real time. Enjoy the excitement of fast-paced online live auto auctions from anywhere, anytime. Participating in live car sales is easy; you compete against other bidders by placing incremental bids to become the high bidder and win the sale of the vehicle. Find cars & bids live today!
          </p>
        </div>
      </div>
    </div>


      {/* cars scrolling */}
      <div
            style={{ textAlign: "center", backgroundColor: "#f8f8f8", padding: "40px 20px", }} >
            <h2
              style={{ fontSize: "26px", fontWeight: "700", color: "#374151", marginBottom: "20px",}} >
              Featured Vehicles
            </h2>

            {/* Scrollable Vehicles List */}
            <div
              style={{ display: "flex", overflowX: "auto", gap: "16px", padding: "10px", whiteSpace: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none", maxWidth: "100%", scrollSnapType: "x mandatory",}} >
              {vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  style={{ width: "260px", borderRadius: "6px", flex: "0 0 auto", position: "relative",overflow: "hidden", transition: "transform 0.3s ease-in-out", scrollSnapAlign: "center",}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(1)";
                    e.currentTarget.querySelector(".details").style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(0.7)";
                    e.currentTarget.querySelector(".details").style.opacity = "0";
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px", filter: "brightness(0.7)", transition: "filter 0.3s ease-in-out", }}/>
                    {/* Vehicle Details */}
                    <div
                      className="details"
                      style={{ opacity: "0", position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", textAlign: "center", transition: "opacity 0.3s ease-in-out",}}>
                      <p
                        style={{ fontSize: "16px", fontWeight: "600", color: "#facc15", marginBottom: "4px",}}>
                        {vehicle.price}
                      </p>
                      <p
                        style={{ fontSize: "14px", fontWeight: "500", color: "white",}}>
                        {vehicle.miles}
                      </p>
                    </div>
                    {/* Vehicle Year & Model */}
                    <p
                      style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "18px", fontWeight: "700", color: "white", margin: "0", textAlign: "center", whiteSpace: "nowrap", }}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button
              style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 24px", borderRadius: "6px", fontSize: "16px", fontWeight: "600", border: "none", cursor: "pointer", marginTop: "20px",}}>
              View All
            </button>
      </div>

      {/* about us */}
      <div style={{  backgroundColor: '#f8f9fa', padding: '60px 20px', margin: '40px 0'}}>
        <div style={{maxWidth: '1200px',margin: '0 auto',display: 'flex',flexWrap: 'wrap',gap: '40px',justifyContent: 'center',alignItems: 'center'}}>
    
      </div>
      {/* Text Content */}
      <div
      ref={ref}
      style={{
        flex: '1 1 400px',
        padding: '20px'
      }}
    >
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#1F4C6B',
        marginBottom: '20px',
        position: 'relative',
        display: 'inline-block'
      }}>
        About B2A2 Cars
        <span style={{
          position: 'absolute',
          bottom: '-10px',
          left: '0',
          width: '60px',
          height: '4px',
          backgroundColor: '#ff9800'
        }}></span>
      </h2>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: '#333',
        marginBottom: '25px'
      }}>
        Since 2025, B2A2 Cars has been revolutionizing the pre-owned vehicle market with 
        our commitment to quality, transparency, and customer satisfaction. 
        We bridge the gap between global markets and local buyers.
      </p>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#ff9800', margin: '0 0 5px 0' }}>
              {inView && (
                <CountUp
                  end={stat.end}
                  duration={2}
                  suffix={stat.suffix}
                />
              )}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '0' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <button style={{
        backgroundColor: '#1F4C6B',
        color: 'white',
        padding: '15px 40px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#153248'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#1F4C6B'}
      >
        MEET OUR TEAM
      </button>
    </div>

          {/* Image Section */}
          <div style={{ 
            flex: '1 1 400px',
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            minHeight: '400px',
            background: `url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover`
          }}>
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '20px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Our St. Louis Facility</h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>
                Visit our 50,000 sq.ft. state-of-the-art inspection center
              </p>
            </div>
          </div>
      </div>


    {/* Hero Section */}
    <div style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "url('https://images.unsplash.com/photo-1485982353291-4f167f9dee32?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9wZW4lMjByb2FkfGVufDB8fDB8fHww') no-repeat center center/cover",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)"
        }}></div>
        <div style={{
          position: "relative",
          maxWidth: "600px",
          padding: "20px",
          zIndex: 1
        }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase" }}>B2A2 Car</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>6994 CHIPPEWA ST | SAINT LOUIS, MO 63109</p>
          <button
            style={{
              background: isHovered ? "#e68900" : "#ff9800",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "5px",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Start your journey with AtoZ Car"
          >
            START HERE
          </button>
          <p style={{ fontSize: "1rem", marginTop: "20px", lineHeight: "1.6" }}>
            At AtoZ Car, we take pride in the way we do business. We focus 100% on our 
            customers and believe car-buying should be a fun, hassle-free experience! 
            Our impressive selection of cars, trucks, and SUVs is sure to meet your needs. 
            We'd like to thank you for considering AtoZ Car for your next vehicle purchase.
          </p>
        </div>
      </div>

    {/* maps */}
    <div style={{
      width: 'device-width',
      height: '400px',
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px solid #ddd',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <iframe
        title="Uppal, Hyderabad Map"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ 
          border: 0, 
          minHeight: '300px', // Ensures visibility on smaller devices
          maxHeight: '600px'  // Prevents excessive height on larger screens
        }}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7617.521018140705!2d78.55763133558444!3d17.405233872968334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb987c2e6c315b%3A0xe7432d4cb6ae1e02!2sUppal%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1648544373206!5m2!1sen!2sin"
        allowFullScreen
      ></iframe>
    </div>



        {/* footer */}
        <div
      style={{
        background: "#1E3348",
        color: "white",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      {/* Company Name */}
      <h2 style={{ marginBottom: "5px", fontSize: "24px" }}>B2A2 Car</h2>
      <div
        style={{
          width: "50px",
          height: "3px",
          backgroundColor: "#ff9800",
          margin: "10px auto",
        }}
      ></div>

      {/* Address and Contact Info */}
      <p style={{ marginBottom: "5px", fontSize: "14px", lineHeight: "1.5" }}>
        📍 6994 Chippewa St <br /> Saint Louis, MO 63109
      </p>
      <p style={{ fontSize: "14px" }}>📞 (618) 408-0552</p>

      {/* Social Media Icons */}
      <div
        style={{
          margin: "15px 0",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {["🅕", "🅧", "🅸", "🅻", "🅈"].map((icon, index) => (
          <a
            key={index}
            href="#"
            style={{
              color: "white",
              fontSize: "20px",
              textDecoration: "none",
              padding: "5px",
            }}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Horizontal Line */}
      <hr
        style={{
          width: "80%",
          border: "0.5px solid #ccc",
          margin: "20px auto",
        }}
      />

      {/* Legal and Links */}
      <p
        style={{
          fontSize: "12px",
          lineHeight: "1.5",
          padding: "0 10px",
          wordWrap: "break-word",
        }}
      >
        2025 - {new Date().getFullYear()} Powered by B2A2 Car. <br />
        By placing calls to this dealership, you agree to the {" "}
        <a href="#" style={{ color: "#ff9800", textDecoration: "none" }}>
          Terms and Conditions of Use.
        </a>
      </p>

      {/* Footer Navigation Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          fontSize: "14px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        {["Sitemap", "Terms and Conditions", "Dealer Sign-In"].map(
          (text, index) => (
            <a
              key={index}
              href="#"
              style={{ color: "#ff9800", textDecoration: "none" }}
            >
              {text}
            </a>
          )
        )}
      </div>
    </div>

    </div>


  );
};

export default Home;
