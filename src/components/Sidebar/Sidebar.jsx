import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/userSlice";
import {
  IoHomeOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoMedicalOutline,
  IoCalendarOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { LuUserSearch, LuStethoscope } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { MdOutlineSupervisorAccount, MdAssignmentInd, MdOutlineInventory2 } from "react-icons/md";
import { TbEdit, TbVaccine, TbClipboardList } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { RiParentLine, RiMedicineBottleLine } from "react-icons/ri";
import * as Texts from "./text"; // Import texts
import NotificationSection from "../NotificationSection/NotificationSection";
import AnimatedLogo from "../AnimatedLogo/AnimatedLogo";

const Sidebar = ({ selectedItem, setSelectedItem }) => {
  const [isOpen, setIsOpen] = useState(false);  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);// Get route prefix based on user role
  const getRoutePrefix = () => {
    return "/nurse";
  };

  // Base menu items for nurse
  const baseMenuItems = [
    {
      id: "Yêu cầu từ phụ huynh",
      label: "Yêu cầu từ phụ huynh",
      icon: <RiParentLine />,
      link: `${getRoutePrefix()}/parentrequest`,
    },
    {
      id: "Thuốc và Vật Tư",
      label: "Thuốc và Vật Tư",
      icon: <MdOutlineInventory2 />,
      link: `${getRoutePrefix()}/medicine`,
    },
    {
      id: "Danh sách học sinh ",
      label: "Danh sách Học Sinh",
      icon: <FaUsers />,
      link: `${getRoutePrefix()}/studentlist`,
    },
    {
      id: "Tiem chung",
      label: "Tiêm Chủng ",
      icon: <TbVaccine />,
      link: `${getRoutePrefix()}/injection-event`,
    },
    {
      id: "Kham Suc Khoe",
      label: "Khám Sức Khỏe",
      icon: <LuStethoscope />,
      link: `${getRoutePrefix()}/health-event`,
    },
    {
      id: "Lich hen",
      label: "Lịch Hẹn ",
      icon: <IoCalendarOutline />,      link: `${getRoutePrefix()}/appointment`,
    },
  ];
  
  // Bottom menu items
  const bottomMenuItems = [
    {
      id: "Hỗ trợ",
      label: Texts.SUPPORT,
      icon: <BiSupport />,
      link: `${getRoutePrefix()}/support`,
    },
    {
      id: "Điều khoản/chính sách",
      label: Texts.TERMS_POLICY,
      icon: <TbClipboardList />,
      link: `${getRoutePrefix()}/terms-policy`,
    },
    {
      id: "Đăng xuất",
      label: Texts.LOGOUT,
      icon: <IoLogOutOutline />,
      action: "logout",
    },
  ];
  // Construct menu items based on role
  const getMenuItems = () => {
    let menuItems = [...baseMenuItems];

    // Add bottom menu items
    menuItems = [...menuItems, ...bottomMenuItems];

    return menuItems;
  };
  const menuItems = getMenuItems();

  useEffect(() => {
    // Function to determine the selected item based on current path
    const getCurrentSelectedItem = () => {
      const currentPath = location.pathname;
      
      // Find the menu item that matches the current path
      const currentItem = menuItems.find(item => item.link === currentPath);
      
      if (currentItem) {
        return currentItem.label;
      }
      
      // Fallback to default if no match found
      return "Yêu cầu từ phụ huynh";
    };

    setSelectedItem(getCurrentSelectedItem());
  }, [setSelectedItem, location.pathname, menuItems]);

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleNavigation = (item) => {
    if (item.action === "logout") {
      handleLogOut();
      return;
    }

    setSelectedItem(item.label);
    navigate(item.link);
  };

  const sidebarVariants = {
    open: { width: "250px" },
    closed: { width: "80px" },
  };

  const textVariants = {
    open: { opacity: 1, width: "auto", display: "block" },
    closed: {
      opacity: 0,
      width: 0,
      marginLeft: "0px",
      transitionEnd: { display: "none" },
    },
  };

  const profileTextTransition = {
    duration: 0.2,
    delay: isOpen ? 0.2 : 0,
  };

  const menuItemTextTransition = {
    duration: 0.2,
    delay: isOpen ? 0.25 : 0, // Slightly delay menu item text after profile
  };

  return (
    <div className="h-full w-full flex flex-row">
      <motion.div
        className={`h-full ${
          isOpen ? "bg-[#F3F7FF]" : "bg-white"
        } pt-[2%] shadow-lg z-40 absolute w-full flex flex-col p-4`}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <motion.div
          className={`flex ${isOpen ? 'py-2' : 'py-0'} flex-col justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-900 items-center mb-2 shadow-md cursor-pointer`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatedLogo
            width={isOpen ? 100 : 50}
            height={isOpen ? 80 : 50}
            style={{ filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))" }}
            isInfinite={true}
          />
          <motion.div
            className="overflow-hidden" // To hide text smoothly
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={textVariants}
            transition={profileTextTransition}
          >
            <p className="text-xl text-white font-bold whitespace-nowrap">CampusMedix</p>
          </motion.div>
        </motion.div>

        {/* Profile Section */}
        <motion.div className="flex flex-row items-center mb-3">
          <motion.div
            className="overflow-hidden" // To hide text smoothly
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={textVariants}
            transition={profileTextTransition}
          >
            <p className="text-sm whitespace-nowrap">{Texts.GREETING}</p>
            <p className="text-sm font-bold whitespace-nowrap">
              {user?.fullName}
            </p>
          </motion.div>
        </motion.div>


        {/* Navigation Items */}
        <nav className="rounded-2xl py-1 bg-white">
          <ul className="justify-between flex flex-col">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <li className="my-1">
                  <motion.div
                    className="flex py-2 items-center rounded-lg cursor-pointer"
                    initial={{ scale: 1 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => handleNavigation(item)}
                  >
                    <span
                      className={`text-2xl w-12 h-7 flex items-center justify-center flex-shrink-0 ${
                        selectedItem === item.label ? "text-blue-500" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <motion.span
                      className={`text-sm font-medium overflow-hidden whitespace-nowrap ${
                        selectedItem === item.label ? "text-blue-500" : ""
                      }`}
                      initial="closed"
                      animate={isOpen ? "open" : "closed"}
                      variants={textVariants}
                      transition={menuItemTextTransition}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </li>
                {item.id === "Tin nhan" && (
                  <motion.hr
                    className="border-gray-300 mx-4 "
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={{
                      open: { opacity: 1, display: "block" },
                      closed: {
                        opacity: 0,
                        transitionEnd: { display: "none" },
                      },
                    }}
                    transition={menuItemTextTransition}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </motion.div>

    </div>
  );
};

export default Sidebar;
