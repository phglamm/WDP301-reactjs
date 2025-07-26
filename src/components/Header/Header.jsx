import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo/campusmedix.png";
import "./Header.scss";
import { Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const loggedDropdown = [
    {
      key: "1",
      label: (
        <Link
          to="/profile"
          className="text-gray-700 hover:text-gray-900"
          onClick={() => setMenuOpen(false)}
        >
          Tài khoản
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="text-gray-700 hover:text-gray-900 cursor-pointer"
          onClick={handleLogoutClick}
        >
          Đăng xuất
        </div>
      ),
    },
  ];

  const guessDropdown = [
    {
      key: "1",
      label: (
        <Link to="/login" className="text-gray-700 hover:text-gray-900">
          Đăng nhập
        </Link>
      ),
    },
  ];

  const items = isAuthenticated ? loggedDropdown : guessDropdown;

  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const titles = {
    profile: "Hồ Sơ Sức Khỏe",
    medication: "Thông Tin Thuốc",
    vaccination: "Nhắc Nhở Tiêm Chủng",
    // history: "Lịch Sử Sức Khỏe",
    appointment: "Tạo lịch hẹn",
  };
  const paths = {
    profile: "/health-profile",
    medication: "/drug-information",
    vaccination: "/vaccine-reminder",
    // history: "/health-history",
    appointment: "/parent-appointment",
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/">
            <div className="logo">
              <img
                src={logo}
                alt="Logo"
                className="logoImage"
                onError={(e) => {
                  e.target.style.display = "none";
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
          <ul className={`menu ${menuOpen ? "menuMobileOpen" : ""}`}>
            {Object.keys(titles).map((key) => (
              <li key={key} className="menuItemWrapper">
                <Link
                  to={paths[key]}
                  className={`menuItem ${
                    hoveredItem === key || currentPath === paths[key]
                      ? "hovered"
                      : ""
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
            <div className="font-bold  ">
              {user?.fullName}
            </div>
            <Dropdown menu={{ items }} trigger={["hover"]} placement="bottomRight">
              <FaUserCircle
                size={40}
                className={`icon ${hoveredIcon === "user" ? "hovered" : ""}`}
                title="Tài khoản"
                onMouseEnter={() => setHoveredIcon("user")}
                onMouseLeave={() => setHoveredIcon(null)}
              />
            </Dropdown>
          </div>
        </nav>
      </header>

      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-[9999]"
          onClick={closeLogoutModal}
          style={{
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div
            className="rounded-lg p-6 max-w-sm w-11/12 mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              zIndex: 10000,
              border: "1px solid #e5e7eb",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium min-w-[100px]"
                onClick={closeLogoutModal}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium min-w-[100px]"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
