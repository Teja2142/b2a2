import { Helmet } from 'react-helmet';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';




const faqs = [
  {
    question: "What is B2A2 Cars Club?",
    answer: "B2A2 Cars Club is an online car auction platform connecting buyers and sellers across the globe. We offer a secure, transparent, and exciting car bidding experience."
  },
  {
    question: "How do I participate in an auction?",
    answer: "Simply register for a free account, browse cars, and place your bid during live or scheduled auctions."
  },
  {
    question: "Are all listings verified?",
    answer: "Yes, we work only with verified sellers and inspect listings for accuracy to ensure buyer protection."
  },
  {
    question: "Can I schedule bids in advance?",
    answer: "Absolutely! You can place advance bids for upcoming auctions using our Auction Calendar feature."
  },
  {
    question: "How do I get notified about new listings or wins?",
    answer: "Enable notifications in your profile to receive instant alerts about new listings, price drops, and bid results."
  }
];




const About = () => {
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>About B2A2 Cars Club | Car Auctions Online</title>
        <meta
          name="description"
          content="Learn about B2A2 Cars Club, your premier destination for transparent, secure, and exciting online car auctions."
        />
        <meta name="keywords" content="car auctions, online car bidding, B2A2 Cars Club, live car auctions, auto auctions" />
      </Helmet>

      {/* Hero Section with Background Image */}
      <section style={{
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundImage: 'url("/images/about_bg.png")'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to B2A2 Cars Club</h1>
          <p style={{ fontSize: '1.25rem' }}>Where Passion Meets the Road – Trusted Car Auctions Online</p>
        </div>
      </section>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'sans-serif',
        color: '#1f2937'
      }}>
        {/* About Intro Split Section */}
        <section style={{
          display: 'flex',
          gridTemplateColumns: '1fr',
          gap: '32px',
          alignItems: 'center',
          margin: '64px 0',
          maxWidth: '100%'
        }}>
          <div style={{ maxWidth: '50%'}}>
            <img
              src="https://images.stockcake.com/public/0/2/a/02a2dd58-11b1-43d8-a8a9-ba82018a4a75/vintage-red-car-stockcake.jpg"
              alt="Auction Cars"
              style={{ borderRadius: '12px', width: "80%", height:"60%", boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
          <div style={{maxWidth: '50%'}}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem' }}>About B2A2 Cars Club</h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '1rem' }}>
              Your Premier Destination for Transparent & Exciting Car Auctions
            </p>
            <p style={{ fontSize: '1.125rem', color: '#374151' }}>
              <strong>B2A2 Cars Club</strong> is a global online platform for <strong>car auctions</strong>, connecting passionate buyers and sellers. Whether you're after a <strong>vintage gem</strong>, <strong>luxury model</strong>, or a reliable daily ride, we offer a trusted and competitive marketplace. Enjoy affordable pricing with verified listings across a wide range of vehicles. Experience a seamless bidding process backed by expert support and secure transactions.<br /><br />

              Discover a curated selection of <strong>high-quality pre-owned and new cars</strong> updated daily.<br />
              Leverage <em>advanced search filters</em> and <em>real-time notifications</em> to stay ahead.<br />
              Join a growing <strong>community of car enthusiasts and professional dealers</strong>.<br />
              Bid confidently with our <strong>transparent history reports</strong> and seller ratings.<br />
              Access <strong>exclusive auction events</strong> and <em>limited-time deals</em>.<br />
              Benefit from hassle-free <strong>financing</strong>, <strong>delivery</strong>, and <em>after-sale services</em>.<br /><br />

              Explore our <a href="/auctions" style={{ color: '#1e40af', textDecoration: 'underline' }}><strong>Auctions</strong></a> section for live and upcoming bids.<br />
              Need help? <a href="/contact" style={{ color: '#1e40af', textDecoration: 'underline' }}>Contact</a> our team or return to the <a href="/home" style={{ color: '#1e40af', textDecoration: 'underline' }}><strong>Home</strong></a> page to get started.
            </p>

          </div>
        </section>

        {/* Meet Us Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '32px' }}>Meet Us</h2>
          <article style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <p style={{ marginBottom: '24px' }}>
              <strong>Who We Are:</strong> Founded by car lovers, for car lovers. We combine technology with trust to help you find, bid, and buy the car that fits your lifestyle and passion. B2A2 is about making auctions exciting, transparent, and accessible to all.
            </p>
            <p>
              <strong>Our Mission:</strong> We're here to revolutionize the car auction industry with a seamless digital experience. We prioritize transparency, ease of use, and buyer protection, ensuring every transaction is smooth and secure.
            </p>
          </article>
        </section>

        {/* What We Offer */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '32px', color: '#1e40af', textAlign: 'center' }}>What We Offer</h2>
          <div style={{
            display: 'grid',
            gap: '32px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {[
              {
                title: 'Today Auctions',
                description: 'Explore a wide variety of cars daily. From budget buys to collector vehicles, our auctions offer something for everyone.'
              },
              {
                title: 'Live Auctions',
                description: 'Engage in real-time bidding with users across the globe. Watch bids rise and claim your winning moment.'
              },
              {
                title: 'Auction Calendar',
                description: 'Stay updated with our auction schedule. Plan ahead and never miss a chance to grab your dream car.'
              }
            ].map((offer, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f3f4f6',
                  transform: 'scale(1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1d4ed8', marginBottom: '12px' }}>{offer.title}</h3>
                <p style={{ color: '#4b5563', marginBottom: '16px' }}>{offer.description}</p>
                <a href="/auctions" style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#1d4ed8',
                  color: 'white',
                  borderRadius: '9999px',
                  transition: 'background-color 0.3s ease'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}>
                  View Auctions
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '32px', color: '#1e40af', textAlign: 'center' }}>How It Works</h2>
          <div style={{
            display: 'grid',
            gap: '32px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            textAlign: 'center'
          }}>
            {[
              'Register',
              'Browse Cars',
              'Place Bids',
              'Win & Drive'
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1d4ed8', marginBottom: '8px' }}>{index + 1}. {step}</h4>
                <p style={{ color: '#4b5563' }}>
                  {index === 0 && 'Create your free account and gain instant access to live auctions and listings.'}
                  {index === 1 && 'Explore listings with detailed specs, photos, and condition reports.'}
                  {index === 2 && 'Join live auctions or schedule bids in advance on upcoming vehicles.'}
                  {index === 3 && 'Secure the winning bid, complete the checkout, and arrange delivery easily.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', gap: '24px', flexWrap: 'wrap' }}>
          {/* Left side: Text */}
          <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '16px', color: '#1e40af' }}>
              Why Choose B2A2 Cars Club?
            </h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#374151', fontSize: '1.125rem', lineHeight: '1.75' }}>
              <li>Trusted platform with verified sellers and listings.</li>
              <li>User-friendly interface with powerful search and filters.</li>
              <li>Dedicated customer support to assist at every step.</li>
              <li>Mobile-friendly design to let you bid on the go.</li>
              <li>Community of passionate car lovers and dealers.</li>
              <li>Instant alerts on price drops, new listings, and wins.</li>
              <li>Flexible payment and delivery options tailored to your needs.</li>
            </ul>
          </div>

          {/* Right side: Image */}
          <div style={{ flex: '1 1 40%', minWidth: '280px', textAlign: 'center' }}>
            <img src="https://live.staticflickr.com/65535/48965479112_3d4d58fb7b_b.jpg" alt="Why Choose Us" style={{ maxWidth: '100%', borderRadius: '12px' }} />
          </div>
        </section>


        {/* Testimonials Slider */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '16px', color: '#1e40af', textAlign: 'center' }}>What Our Users Say</h2>
          <Slider {...testimonialSettings}>
            <div>
              <blockquote style={{
                backgroundColor: '#f9fafb',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
                maxWidth: '800px',
                margin: '0 auto'
              }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}>
                <p style={{ fontStyle: 'italic', color: '#374151' }}>
                  "B2A2 Cars Club made buying my dream car so easy. The live auction was thrilling and the process was smooth!"
                </p>
                <footer style={{ marginTop: '8px', textAlign: 'right', fontSize: '0.875rem', color: '#6b7280' }}>— Sarah J., California</footer>
              </blockquote>
            </div>
            <div>
              <blockquote style={{
                backgroundColor: '#f9fafb',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
                maxWidth: '800px',
                margin: '0 auto'
              }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}>
                <p style={{ fontStyle: 'italic', color: '#374151' }}>
                  "I love how transparent and detailed the listings are. I've bought two cars through B2A2 and both were great deals."
                </p>
                <footer style={{ marginTop: '8px', textAlign: 'right', fontSize: '0.875rem', color: '#6b7280' }}>— Rajiv P., New Delhi</footer>
              </blockquote>
            </div>
          </Slider>
        </section>

        {/* Join Us Section */}
        <section style={{
          textAlign: 'center',
          padding: '48px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '16px' }}>Ready to Join the Ride?</h2>
          <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '24px' }}>
            Sign up today and start bidding on your favorite cars. Discover unbeatable deals and a community that shares your passion.
          </p>
          <a href="/register" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#1d4ed8',
            color: 'white',
            borderRadius: '9999px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}>
            Join B2A2 Now
          </a>
        </section>
      </main>



      {/* FAQ Section */}
      <section style={{ margin: '64px auto', maxWidth: '800px', padding: '0 24px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#1e40af', marginBottom: '32px' }}>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            marginBottom: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <button
            onClick={() => toggleFAQ(index)}
            style={{
              width: '100%',
              background: '#f1f5f9',
              border: 'none',
              padding: '16px',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '1.125rem',
              cursor: 'pointer',
              color: '#1e3a8a'
            }}
          >
            {faq.question}
          </button>
          {activeIndex === index && (
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              fontSize: '1rem',
              color: '#374151',
              borderTop: '1px solid #e5e7eb'
            }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </section>

    </>
  );
};

export default About;