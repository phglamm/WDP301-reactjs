import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo/campusmedix.png';

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu mở/đóng (mobile)
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Đóng menu khi chọn link (mobile)
  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <img
            src={logo}
            alt="Logo"
            style={styles.logoImage}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={styles.logoText}>CampusMedix</span>
        </div>

        {/* Hamburger cho mobile */}
        <div style={styles.hamburger} onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Menu */}
        <ul
          style={{
            ...styles.menu,
            ...(menuOpen ? styles.menuMobileOpen : {}),
          }}
        >
          {['profile', 'medication', 'vaccination', 'history'].map((key, idx) => {
            const titles = {
              profile: 'Hồ Sơ Sức Khỏe',
              medication: 'Thông Tin Thuốc',
              vaccination: 'Nhắc Nhở Tiêm Chủng',
              history: 'Lịch Sử Sức Khỏe',
            };
            const paths = {
              profile: '/health-profile',
              medication: '/medication-information',
              vaccination: '/vaccination-reminders',
              history: '/health-history',
            };

            return (
              <li key={key} style={styles.menuItemWrapper}>
                <Link
                  to={paths[key]}
                  style={{
                    ...styles.menuItem,
                    ...(hoveredItem === key ? styles.menuItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredItem(key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={closeMenu} // đóng menu khi chọn
                >
                  {titles[key]}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={styles.userIcons}>
          <FaUserCircle
            style={{
              ...styles.icon,
              ...(hoveredIcon === 'user' ? styles.iconHover : {}),
            }}
            title="Tài khoản"
            onMouseEnter={() => setHoveredIcon('user')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          <FaSignOutAlt
            style={{
              ...styles.icon,
              ...(hoveredIcon === 'logout' ? styles.iconHover : {}),
            }}
            title="Đăng xuất"
            onMouseEnter={() => setHoveredIcon('logout')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 20px rgba(64, 124, 226, 0.15)',
    borderBottom: '1px solid rgba(64, 124, 226, 0.1)',
    width: '100%',
    margin: 0,
    padding: 0,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    margin: 0,
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '16px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  logoImage: {
    height: '45px',
    width: 'auto',
    marginRight: '12px',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  logoText: {
    background: 'linear-gradient(135deg, #407CE2, #223A6A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    gap: '16px',
    margin: 0,
    padding: 0,
    alignItems: 'center',

    // Ẩn menu trên mobile
    '@media(max-width: 768px)': {
      display: 'none',
    },
  },
  menuMobileOpen: {
    position: 'absolute',
    top: '64px',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'column',
    display: 'flex',
    gap: 0,
    padding: '12px 0',
    boxShadow: '0 4px 20px rgba(64,124,226,0.15)',
    borderRadius: '0 0 8px 8px',
  },
  menuItemWrapper: {
    margin: 0,
  },
  menuItem: {
    textDecoration: 'none',
    color: '#374151',
    fontWeight: '500',
    fontSize: '14px',
    padding: '8px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'block',
  },
  menuItemHover: {
    backgroundColor: 'rgba(64, 124, 226, 0.1)',
    color: '#407CE2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(64, 124, 226, 0.2)',
  },
  userIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    color: '#6b7280',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '8px',
    borderRadius: '50%',
  },
  iconHover: {
    color: '#407CE2',
    backgroundColor: 'rgba(64, 124, 226, 0.1)',
    transform: 'scale(1.15)',
    boxShadow: '0 4px 12px rgba(64, 124, 226, 0.2)',
  },
  hamburger: {
    display: 'none',
    cursor: 'pointer',
  },

  // Style cho responsive
  '@media(max-width: 768px)': {
    menu: {
      display: 'none',
    },
    hamburger: {
      display: 'block',
    },
  },
};

export default Header;
