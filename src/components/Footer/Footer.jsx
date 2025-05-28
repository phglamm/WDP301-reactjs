import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../../assets/logo/campusmedix.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width để xử lý responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Kết hợp style responsive
  const dynamicStyles = {
    inputContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'stretch',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: 'center',
    },
    emailInput: {
      flex: isMobile ? 'unset' : 1,
      width: isMobile ? '100%' : 'auto',
      minWidth: '280px',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      boxSizing: 'border-box',
    },
    subscribeButton: {
      padding: '14px 28px',
      backgroundColor: '#407CE2',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      whiteSpace: 'nowrap',
      width: isMobile ? '100%' : 'auto',
      marginTop: isMobile ? '12px' : '0',
    },
    bottomSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '30px',
      borderTop: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '20px',
      flexDirection: isMobile ? 'column' : 'row',
      textAlign: isMobile ? 'center' : 'left',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : 'flex-start',
    },
    socialSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      justifyContent: isMobile ? 'center' : 'flex-end',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.logoSection}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo Theo Dõi Sức Khỏe Trẻ Em" style={styles.logoImage} />
            <span style={styles.logoText}>CampusMedix</span>
          </div>
        </div>

        <div style={styles.newsletterSection}>
          <h3 style={styles.newsletterTitle}>Cập Nhật Thông Tin Sức Khỏe Con Bạn</h3>
          <p style={styles.newsletterSubtitle}>
            Nhận thông báo về lịch tiêm chủng, lời khuyên sức khỏe và cập nhật quan trọng
          </p>

          <form onSubmit={handleSubscribe} style={styles.subscribeForm}>
            <div style={dynamicStyles.inputContainer}>
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={dynamicStyles.emailInput}
                required
              />
              <button type="submit" style={dynamicStyles.subscribeButton}>
                {isSubscribed ? 'Đã Đăng Ký!' : 'Đăng Ký'}
              </button>
            </div>
          </form>

          {isSubscribed && (
            <div style={styles.successMessage}>
              ✓ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin hữu ích đến email của bạn.
            </div>
          )}
        </div>

        <div style={dynamicStyles.bottomSection}>
          <div style={dynamicStyles.leftSection}>
            <span style={styles.copyright}>
              © 2024 Theo Dõi Sức Khỏe Trẻ Em. Tất cả quyền được bảo lưu.
            </span>
          </div>

          <div style={dynamicStyles.socialSection}>
            <span style={styles.followText}>Theo dõi chúng tôi:</span>
            <div style={styles.socialIcons}>
              <a href="#" style={styles.socialIcon} aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    padding: '60px 0 30px',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoImage: {
    width: '55px',
    height: 'auto',
    objectFit: 'contain',
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #407CE2, #223A6A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  newsletterSection: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  newsletterTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  newsletterSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  },
  subscribeForm: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  successMessage: {
    marginTop: '16px',
    padding: '12px 20px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-block',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '14px',
    color: '#6b7280',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  followText: {
    fontSize: '14px',
    color: '#6b7280',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  socialIcons: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    color: '#6b7280',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid #e5e7eb',
    fontSize: '16px',
  },
};

export default Footer;
