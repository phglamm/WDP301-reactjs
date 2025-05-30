import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const Header = ({ selectedChild }) => {
  return (
    <div className="profile-header">
      <div className="profile-header-top">
        <FaHeartbeat size={36} />
        <h1>Hồ sơ sức khỏe</h1>
      </div>
      <div className="profile-header-info">
        <div>{selectedChild?.fullName || 'Chưa chọn học sinh'}</div>
        <div>MSSV: {selectedChild?.studentId}</div>
      </div>
    </div>
  );
};

export default Header;
