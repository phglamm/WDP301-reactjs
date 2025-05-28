import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo/campusmedix.png'; // Import logo if needed`

const Header = () => {
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [hoveredIcon, setHoveredIcon] = React.useState(null);

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

        <ul style={styles.menu}>
          <li>
            <Link 
              to="/health-profile" 
              style={{
                ...styles.menuItem,
                ...(hoveredItem === 'profile' ? styles.menuItemHover : {})
              }}
              onMouseEnter={() => setHoveredItem('profile')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Hồ Sơ Sức Khỏe
            </Link>
          </li>
          <li>
            <Link 
              to="/medication-information" 
              style={{
                ...styles.menuItem,
                ...(hoveredItem === 'medication' ? styles.menuItemHover : {})
              }}
              onMouseEnter={() => setHoveredItem('medication')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Thông Tin Thuốc
            </Link>
          </li>
          <li>
            <Link 
              to="/vaccination-reminders" 
              style={{
                ...styles.menuItem,
                ...(hoveredItem === 'vaccination' ? styles.menuItemHover : {})
              }}
              onMouseEnter={() => setHoveredItem('vaccination')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Nhắc Nhở Tiêm Chủng
            </Link>
          </li>
          <li>
            <Link 
              to="/health-history" 
              style={{
                ...styles.menuItem,
                ...(hoveredItem === 'history' ? styles.menuItemHover : {})
              }}
              onMouseEnter={() => setHoveredItem('history')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Lịch Sử Sức Khỏe
            </Link>
          </li>
        </ul>

        <div style={styles.userIcons}>
          <FaUserCircle 
            style={{
              ...styles.icon,
              ...(hoveredIcon === 'user' ? styles.iconHover : {})
            }}
            title="Tài khoản"
            onMouseEnter={() => setHoveredIcon('user')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          <FaSignOutAlt 
            style={{
              ...styles.icon,
              ...(hoveredIcon === 'logout' ? styles.iconHover : {})
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
  },
  menuItem: {
    textDecoration: 'none',
    color: '#374151',
    fontWeight: '500',
    fontSize: '14px',
    padding: '8px 12px',
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
};


export default Header;