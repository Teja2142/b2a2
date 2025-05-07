import React from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup,
  Badge 
} from 'react-bootstrap';
import {
  FaCar,
  FaGlobeAmericas,
  FaShieldAlt,
  FaSearch,
  FaShip,
  FaStore,
  FaMoneyBillWave,
  FaFileAlt,
  FaHeadset,
  FaChevronRight,
  FaPlayCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';



const Services = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  const AnimatedCard = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeIn}
        transition={{ delay: delay * 0.1 }}
      >
        {children}
      </motion.div>
    );
  };

  const services = [
    {
      title: "U.S.-Based Auto Auctions",
      icon: <FaCar style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Bid on verified listings with clean titles",
        "Access exclusive inventory",
        "Fast, secure auction processes"
      ],
      badge: "Exclusive"
    },
    {
      title: "Global Buyer Access",
      icon: <FaGlobeAmericas style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Browse in your native language",
        "Region-specific import info",
        "Auto-adjusted bidding platform"
      ],
      badge: "Worldwide"
    },
    {
      title: "Secure Bidding",
      icon: <FaShieldAlt style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Refundable security deposits",
        "Transparent transactions",
        "Verified bidders only"
      ],
      badge: "Protected"
    },
    {
      title: "Vehicle Inspections",
      icon: <FaSearch style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Certified mechanic inspections",
        "Live video walkarounds",
        "Pre-bid peace of mind"
      ],
      badge: "Verified"
    },
    {
      title: "Global Shipping",
      icon: <FaShip style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Door-to-door delivery",
        "Real-time tracking",
        "Customs clearance support"
      ],
      badge: "Reliable"
    },
    {
      title: "Dealer Network",
      icon: <FaStore style={{ fontSize: '40px', color: '#0d6efd' }} />,
      items: [
        "Reach international buyers",
        "Serious inquiries only",
        "Strategic auction timing"
      ],
      badge: "Network"
    }
  ];

  const featureHighlights = [
    {
      title: "Escrow Payments",
      icon: <FaMoneyBillWave style={{ fontSize: '30px', color: '#0d6efd' }} />,
      description: "Funds held securely until delivery confirmation"
    },
    {
      title: "Import Guidance",
      icon: <FaFileAlt style={{ fontSize: '30px', color: '#0d6efd' }} />,
      description: "Country-specific rules and tax calculations"
    },
    {
      title: "24/7 Support",
      icon: <FaHeadset style={{ fontSize: '30px', color: '#0d6efd' }} />,
      description: "Multilingual assistance anytime"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Vehicles Auctioned" },
    { value: "50+", label: "Countries Served" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Customer Support" }
  ];

  const testimonialData = [
    {
      quote: "B2A2 made purchasing vehicles from the U.S. incredibly simple. Their platform and support team guided me through every step.",
      name: "Carlos Mendez",
      role: "Auto Dealer, Mexico"
    },
    {
      quote: "Exceptional service and transparency throughout the buying process. Highly recommended for international dealers!",
      name: "Fatima Al Zahra",
      role: "Importer, UAE"
    },
    {
      quote: "The B2A2 dashboard is very intuitive. It made my vehicle sourcing fast and reliable.",
      name: "John Smith",
      role: "Fleet Manager, Kenya"
    },
    {
      quote: "Smooth transactions and reliable delivery every time. I've worked with many—B2A2 stands out!",
      name: "Liam Tanaka",
      role: "Used Car Seller, Japan"
    }
  ];

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0',
        color: 'white',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Global Auto Auctions <span style={{ color: '#0d6efd' }}>Made Simple</span>
            </h1>
            <p style={{ 
              fontSize: '1.5rem', 
              marginBottom: '2.5rem',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              America's trusted platform connecting international buyers with U.S. vehicle auctions
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Link to={"/auctions"} style={{ textDecoration: 'none', color: 'white' }}>
                  Browse Auctions
                </Link>
                 <FaChevronRight />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s ease'
                }}
              >
                <FaPlayCircle /> How It Works
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </section>


      {/* Feature & Service Highlights */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Container>
          <Row style={{ marginBottom: '4rem'  }}>
            <Col style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                Your <span style={{ color: '#0d6efd' }}>Competitive Advantage</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#6c757d', maxWidth: '700px', margin: '0 auto' }}>
                We go beyond just auctions to provide complete solutions for international buyers.
              </p>
            </Col>
          </Row>

          <Row style={{ display: 'flex', gap: '2rem' }}>
            {[
              {
                icon: "🚚",
                title: "Global Logistics",
                description: "End-to-end logistics support for international shipping."
              },
              {
                icon: "🔒",
                title: "Secure Transactions",
                description: "Your payments and data are protected with industry standards."
              },
              {
                icon: "🌐",
                title: "Worldwide Reach",
                description: "Serving clients across more than 50 countries."
              }
            ].map((card, index) => (
              <Col key={index} md={4}>
                <div
                  style={{  backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem 2rem', height: '80%', textAlign: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', borderTop: '4px solid #0d6efd', transition: '0.3s', cursor: 'pointer', display: 'flex', }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderTopColor = '#0dcaf0';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderTopColor = '#0d6efd';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '2.5rem', backgroundColor: 'rgba(13, 110, 253, 0.1)', width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d6efd' }}>
                       {card.icon}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{card.title}</h3><br/>
                    <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>{card.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>



      {/* Feature Highlights */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Container>
          <Row style={{ marginBottom: '4rem' }}>
            <Col style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge pill style={{ backgroundColor: '#0d6efd', color: 'white', padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>
                  <Link to={"/about"} style={{ textDecoration: 'none', color: 'white' }}>
                    Why Choose Us?
                  </Link>
                </Badge>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                  Your <span style={{ color: '#0d6efd' }}>Competitive Advantage</span>
                </h2>
                <p style={{ fontSize: '1.125rem', color: '#6c757d', maxWidth: '700px', margin: '0 auto' }}>
                  We provide secure payments, expert import help, and 24/7 global support for peace of mind.
                </p>
              </motion.div>
            </Col>
          </Row>

          <div
            className="features-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
              padding: '3rem 1rem',
              backgroundColor: '#f9f9f9',
            }}>
            {featureHighlights.map((feature, index) => (
              <Card
                key={index}
                style={{
                  flex: '1 1 280px',
                  maxWidth: '320px',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                  padding: '2rem',
                  borderTop: '4px solid #0d6efd',
                  transition: '0.3s',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderTopColor = '#0dcaf0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderTopColor = '#0d6efd';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0d6efd' }}>
                  {feature.icon}
                </div>
                <h5 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>{feature.title}</h5>
                <p style={{ color: '#6c757d' }}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>


      {/* Testimonials Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0d6efd', color: 'white' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge pill style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  CLIENT SUCCESS
                </Badge>
                <h2 style={{ fontSize: '2.75rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center' }}>
                  Trusted by Thousands of International Buyers
                </h2>
                <Slider {...sliderSettings}>
                  {testimonialData.map((t, idx) => (
                    <div key={idx}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '10px', maxWidth: '700px', margin: '0 auto' }}>
                        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                          "{t.quote}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white', marginRight: '1rem' }}></div>
                          <div>
                            <h5 style={{ fontWeight: '700', marginBottom: '0' }}>{t.name}</h5>
                            <p style={{ opacity: '0.8', marginBottom: '0', fontSize: '0.9rem' }}>{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section> 

      {/* Stats Section */}
      <section style={{ padding: '5rem 0',  backgroundColor: '#212529',  color: 'white', position: 'relative', overflow: 'hidden'  }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(13, 110, 253, 0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(13, 202, 240, 0.1)'}}></div>
        <Container>
          <Row style={{ gap: '1.5rem 0' , display: 'flex' , gap : '90px' , marginLeft: '10%' }}>
            {stats.map((stat, index) => (
              <Col key={index} md={6} lg={3}>
                <motion.div  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} style={{ textAlign: 'center' }}>
                  <h3 style={{  fontSize: '3.5rem',  fontWeight: '800',  color: '#0d6efd', marginBottom: '0.5rem' }}>
                    {stat.value}
                  </h3>
                  <p style={{ textTransform: 'uppercase',  fontSize: '1rem', letterSpacing: '1px',fontWeight: '600', opacity: '0.8'}}>
                    {stat.label}
                  </p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0',  backgroundColor: 'white',  textAlign: 'center', background: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container style={{ maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: '2.75rem',  fontWeight: '800',  marginBottom: '1.5rem', lineHeight: '1.3' }}>
              Ready to Access U.S. Auto Auctions?
            </h2>
            <p style={{ fontSize: '1.25rem',  marginBottom: '2.5rem', color: '#495057'}}>
              Join thousands of satisfied international buyers in our trusted auction platform
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s ease' }}>
                <Link to={"/auctions"} style={{ textDecoration: 'none', color: 'white' }}>
                  Browse Auctions
                </Link>
                 <FaChevronRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'white', color: '#0d6efd', border: '2px solid #0d6efd', borderRadius: '50px', fontWeight: '700', transition: 'transform 0.2s ease' }} >
                <Link to={"/contact"} style={{ textDecoration: 'none', color: '#0d6efd' }}>
                  Contact Us
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Services;