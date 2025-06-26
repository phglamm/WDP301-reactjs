import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/userSlice'
import { IoHomeOutline, IoLogOutOutline, IoDocumentTextOutline, IoSettingsOutline, IoNotificationsOutline  } from "react-icons/io5";
import { LuUserSearch } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import * as Texts from './text'; // Import texts
import NotificationSection from '../NotificationSection/NotificationSection';

// Placeholder menu items
const menuItems = [
    { id: 'Thong Bao', label: 'Yêu cầu từ phụ huynh', icon: <IoNotificationsOutline/>, link:'/nurse/parentrequest' },
    { id: 'thuoc va vat tu ', label: 'Thuốc và Vật Tư', icon: <IoDocumentTextOutline/>, link:'/nurse/medicine' },
    { id: 'Danh sách học sinh ', label: 'Danh sách Học Sinh', icon: <MdOutlineSupervisorAccount/>, link:'/nurse/studentlist' },
    { id: 'Tiem chung', label: 'Tiêm Chủng ', icon: <IoSettingsOutline/>, link:'/nurse/injection-event' },
    { id: 'Lich hen', label: 'Lịch Hẹn ', icon: <TbEdit/>, link:'/nurse/appointment' },
    { id: 'Tin nhan', label: 'Tin Nhắn ', icon: <TiMessages/>, link:'/nurse/messages' },
    { id: 'Hỗ trợ', label: Texts.SUPPORT, icon: <BiSupport />, link:'/nurse/support' },
    { id: 'Điều khoản/chính sách', label: Texts.TERMS_POLICY, icon: <IoDocumentTextOutline />, link:'/nurse/terms-policy' },
    { id: 'Đăng xuất', label: Texts.LOGOUT, icon: <IoLogOutOutline />, action: 'logout' },
];


const Sidebar = ({ selectedItem, setSelectedItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
       setSelectedItem('Trang Chủ')
    }, [ setSelectedItem ]);

    const handleLogOut = () => {
        dispatch(logout());
    };

    const handleNavigation = (item) => {
        if (item.action === 'logout') {
            handleLogOut();
            return;
        }
        
        setSelectedItem(item.label);
        navigate(item.link);
    };

    const sidebarVariants = {
        open: { width: '250px' },
        closed: { width: '80px' },
    };

    const textVariants = {
        open: { opacity: 1, width: 'auto', marginLeft: '12px', display: 'block' },
        closed: { opacity: 0, width: 0, marginLeft: '0px', transitionEnd: { display: 'none' } },
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
        <div className='h-full w-full flex flex-row bg-gray-100  '> 
            <motion.div 
                className={`h-full ${isOpen ? 'bg-[#F3F7FF]' : 'bg-white'} pt-[2%] shadow-lg z-40 absolute w-full flex flex-col p-4`} 
                variants={sidebarVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >  
                {/* Profile Section */}
                <motion.div 
                    className='flex flex-row items-center mb-3 ' 
                >
                    <img 
                        src='/logo.png' 
                        alt='logo'
                        width={48}
                        height={48} 
                        className='bg-black rounded-full flex-shrink-0' 
                    />            
                    <motion.div 
                        className='overflow-hidden' // To hide text smoothly
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        variants={textVariants}
                        transition={profileTextTransition}
                    >
                        <p className='text-sm whitespace-nowrap'>{Texts.GREETING}</p>
                        <p className='text-sm font-bold whitespace-nowrap'>{user?.name}</p>
                        <p className='text-xs text-gray-600 whitespace-nowrap hover:underline cursor-pointer'>{Texts.VIEW_PROFILE}</p>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className='flex flex-row rounded-xl bg-[linear-gradient(90deg,_#FF7345_33.76%,_#FFDC95_99.87%)] items-center  mb-2 shadow-md cursor-pointer' 
                    initial={{scale: 1}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => {
                        setSelectedItem('Trang Chu');
                        navigate('/nurse');
                    }}
                >
                    <motion.div className='flex items-center py-2 transition-colors duration-150'>
                        <IoHomeOutline className='text-xl w-12 h-7 text-white  flex items-center justify-center flex-shrink-0' />
                        <motion.div 
                            className='overflow-hidden text-sm font-medium  whitespace-nowrap' // To hide text smoothly
                            initial="closed"
                            animate={isOpen ? "open" : "closed"}
                            variants={textVariants}
                            transition={profileTextTransition}
                        >
                            <p className='text-sm text-white whitespace-nowrap'>{Texts.HOME}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Navigation Items */}
                <nav className=' rounded-2xl py-1 bg-white'>
                    <ul className='justify-between flex flex-col'>
                        {menuItems.map((item) => (
                            <React.Fragment key={item.id}>
                                <li className='my-1'>
                                    <motion.div className='flex py-2 items-center rounded-lg cursor-pointer'
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        onClick={() => handleNavigation(item)}
                                    >
                                        <span className={`text-2xl w-12 h-7 flex items-center justify-center flex-shrink-0 ${selectedItem === item.label ? 'text-orange-500' : ''}`}> {/* Icon container */}
                                            {item.icon}
                                        </span>
                                        <motion.span
                                            className={`text-sm font-medium overflow-hidden whitespace-nowrap ${selectedItem === item.label ? 'text-orange-500' : ''}`}
                                            initial="closed"
                                            animate={isOpen ? "open" : "closed"}
                                            variants={textVariants}
                                            transition={menuItemTextTransition}
                                        >
                                            {item.label}
                                        </motion.span>
                                    </motion.div>
                                </li>
                                {item.id === 'Tin nhan' && (
                                    <motion.hr 
                                        className="border-gray-300 mx-4 "
                                        initial="closed"
                                        animate={isOpen ? "open" : "closed"}
                                        variants={{ open: { opacity: 1, display: 'block' }, closed: { opacity: 0, transitionEnd: { display: 'none' } } }}
                                        transition={menuItemTextTransition}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>
            </motion.div>
            
            {/* Main Content Area */}
            <div className=' bg-[#F3F7FF] lg:pl-[5vw] md:pl-[9vw] sm:pl-[11vw]  pl-[14vw] z-10 grow  p-4'> 
              <NotificationSection/>
            </div>
        </div>
    )
}

export default Sidebar