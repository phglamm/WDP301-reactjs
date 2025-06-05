import React from 'react'
import { IoMdMail } from "react-icons/io";
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";
const CardData = ({title, value, subTitle, onClick}) => {
  
  const getIconByTitle = (title) => {
    switch (title?.toLowerCase()) {
      case 'yêu cầu đang xử lý':
        return <FaClock size={22} className="text-orange-500" />;
      case 'yêu cầu đã xử lý':
        return <FaCheckCircle size={22} className="text-green-500" />;
      case 'yêu cầu chưa xử lý':
        return <FaExclamationTriangle size={22} className="text-red-500" />;
      case 'lịch khám':
        return <FaCalendarAlt size={22} className="text-blue-500" />;
      default:
        return <IoMdMail size={22} className="text-gray-500" />;
    }
  };

  return (
    <motion.div 
      className='w-[24%] h-[20%] border-1 border-gray-100 bg-white rounded-xl shadow-md flex flex-col px-5 py-4 mb-4 cursor-pointer'
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
        <div className='flex justify-between items-center mb-2'>
            <h1 className='text-gray-400 text-lg truncate'>{title}</h1>
            {getIconByTitle(title)}
        </div>
        <div className='flex-col justify-between items-center'>
            <h1 className='text-3xl font-bold'>{value}</h1>
            <p className='text-gray-400 text-sm'>{subTitle}</p>
        </div>
    </motion.div>
  )
}

export default CardData