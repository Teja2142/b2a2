import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_DJANGO_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Base input style that can be reused
  const baseInputStyle = {
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#3182ce',
      outline: 'none'
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#2d3748'
    },
    hero: {
        background: `url('https://t3.ftcdn.net/jpg/03/06/74/08/360_F_306740852_i6tI64yGPZRWCWrTxTyoJTaifZMXZJc7.jpg') no-repeat center center/cover`,
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        borderRadius: '8px',
        marginBottom: '40px'
      },
    card: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      marginBottom: '40px'
    },
    section: {
      flex: '1 1 300px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '30px',
      minWidth: '300px'
    },
    heading: {
      color: '#1e40af',
      fontSize: '1.8rem',
      marginBottom: '20px',
      fontWeight: '600'
    },
    subHeading: {
      color: '#1e40af',
      fontSize: '1.3rem',
      marginBottom: '15px',
      fontWeight: '600'
    },
    text: {
      color: '#4a5568',
      marginBottom: '15px',
      lineHeight: '1.6'
    },
    link: {
      color: '#3182ce',
      textDecoration: 'none',
      transition: 'color 0.2s',
      ':hover': {
        color: '#2c5282'
      }
    },
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    input: baseInputStyle,
    textarea: {
      ...baseInputStyle,
      minHeight: '150px',
      resize: 'vertical'
    },
    button: {
      backgroundColor: '#3182ce',
      color: 'white',
      padding: '14px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#2c5282'
      },
      ':disabled': {
        backgroundColor: '#a0aec0',
        cursor: 'not-allowed'
      }
    },
    mapContainer: {
      width: '100%',
      height: '250px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    infoSection: {
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    features: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '40px'
    },
    featureCard: {
      flex: '1 1 300px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
      }
    },
    featureCardHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
    statusMessage: {
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '500'
    },
    success: {
      backgroundColor: '#c6f6d5',
      color: '#22543d'
    },
    error: {
      backgroundColor: '#fed7d7',
      color: '#742a2a'
    }
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Contact Us | B2A2 Cars Club</title>
        <meta
          name="description"
          content="Get in touch with B2A2 Cars Club. Contact our team for inquiries, support, or any questions about our car auction services."
        />
      </Helmet>

      <div style={styles.hero}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Contact B2A2 Cars Club</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          We're here to help you with any questions about our auctions, services, or your account.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Our Office</h2>
          <p style={styles.text}>
            <strong>B2A2 Cars Club - Hyderabad Office</strong><br />
            123 Auto Trade Tower<br />
            Gachibowli, Hyderabad<br />
            Telangana 500032, India
          </p>

          <h3 style={styles.subHeading}>Contact Information</h3>
          <p style={styles.text}>
            <strong>Phone:</strong> <a href="tel:+919876543210" style={styles.link}>+91 98765 43210</a>
          </p>
          <p style={styles.text}>
            <strong>Email:</strong> <a href="mailto:contact@b2a2cars.com" style={styles.link}>contact@b2a2cars.com</a>
          </p>
          <p style={styles.text}>
            <strong>Business Hours:</strong> Mon-Sat, 9:00 AM - 7:00 PM IST
          </p>

          <div style={styles.mapContainer}>
            <iframe
              title="B2A2 Cars Club Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.263794348774!2d78.3494068!3d17.4471558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8b5a0a4b%3A0x6b5a19269e5b3f0e!2sGachibowli%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.subHeading}>Send Us a Message</h2>
          
          {submitStatus === 'success' && (
            <div style={{ ...styles.statusMessage, ...styles.success }}>
              Thank you! Your message has been sent successfully.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div style={{ ...styles.statusMessage, ...styles.error }}>
              There was an error submitting your message. Please try again.
            </div>
          )}

          <form style={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="name" style={styles.text}>Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label htmlFor="email" style={styles.text}>Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label htmlFor="subject" style={styles.text}>Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              style={styles.input}
            />

            <label htmlFor="message" style={styles.text}>Your Message:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              style={styles.textarea}
            ></textarea>

            <button
              type="submit"
              style={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.heading}>Why Contact B2A2 Cars Club?</h2>
        <p style={styles.text}>
          Whether you're a buyer looking for your dream car or a seller wanting to list your vehicle, our team is ready to assist you. We provide comprehensive support for all aspects of our auction platform, from registration and bidding to payment and vehicle delivery.
        </p>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <h3 style={styles.subHeading}>Expert Support</h3>
          <p style={styles.text}>
            Our knowledgeable team specializes in car auctions and can guide you through every step of the process, ensuring a smooth experience.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.subHeading}>Quick Response</h3>
          <p style={styles.text}>
            We pride ourselves on responding to all inquiries within 24 hours. Your questions and concerns are our top priority.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.subHeading}>Comprehensive Help</h3>
          <p style={styles.text}>
            From technical issues to auction strategies, we provide detailed answers and resources to address all your needs.
          </p>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.heading}>Other Ways to Connect</h2>
        <p style={styles.text}>
          <strong>Social Media:</strong> Follow us on <a href="https://twitter.com/b2a2cars" style={styles.link}>Twitter</a>, <a href="https://facebook.com/b2a2cars" style={styles.link}>Facebook</a>, and <a href="https://instagram.com/b2a2cars" style={styles.link}>Instagram</a> for the latest updates and auction highlights.
        </p>
        <p style={styles.text}>
          <strong>Community Forum:</strong> Join our <a href="/forum" style={styles.link}>community forum</a> to connect with other car enthusiasts, share experiences, and get advice.
        </p>
        <p style={styles.text}>
          <strong>Help Center:</strong> Visit our <a href="/help" style={styles.link}>help center</a> for FAQs, guides, and tutorials about using our platform.
        </p>
      </div>
    </div>
  );
};

export default Contact;