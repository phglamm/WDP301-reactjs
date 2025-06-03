import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo/campusmedix.png';
import './Header.scss';

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  // Toggle menu mở/đóng (mobile)
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Đóng menu khi chọn link (mobile)
  const closeMenu = () => setMenuOpen(false);

  const titles = {
    profile: 'Hồ Sơ Sức Khỏe',
    medication: 'Thông Tin Thuốc',
    vaccination: 'Nhắc Nhở Tiêm Chủng',
    history: 'Lịch Sử Sức Khỏe',
  };
  const paths = {
    profile: '/health-profile',
    medication: '/drug-information',
    vaccination: '/vaccine-reminder',
    history: '/health-history',
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/">
        <div className="logo" >
          <img
            src={logo}
            alt="Logo"
            className="logoImage"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="logoText">CampusMedix</span>
        </div>
        </Link>

        {/* Hamburger cho mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Menu */}
        <ul className={`menu ${menuOpen ? 'menuMobileOpen' : ''}`}>
          {Object.keys(titles).map((key) => (
            <li key={key} className="menuItemWrapper">
              <Link
                to={paths[key]}
                className={`menuItem ${
                  hoveredItem === key || currentPath === paths[key] ? 'hovered' : ''
                }`}
                onMouseEnter={() => setHoveredItem(key)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={closeMenu} // đóng menu khi chọn
              >
                {titles[key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="userIcons">
          <FaUserCircle
            className={`icon ${hoveredIcon === 'user' ? 'hovered' : ''}`}
            title="Tài khoản"
            onMouseEnter={() => setHoveredIcon('user')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          <FaSignOutAlt
            className={`icon ${hoveredIcon === 'logout' ? 'hovered' : ''}`}
            title="Đăng xuất"
            onMouseEnter={() => setHoveredIcon('logout')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
