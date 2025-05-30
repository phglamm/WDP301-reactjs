import React from 'react';
import { FaUserMd } from 'react-icons/fa';

const Sidebar = ({ childrenList, selectedChildId, setSelectedChildId }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaUserMd size={28} />
        <h2>Học sinh</h2>
      </div>
      {childrenList.map((child) => (
        <div
          key={child.id}
          className={`student-card ${selectedChildId === child.id ? 'selected' : ''}`}
          onClick={() => setSelectedChildId(child.id)}
        >
          <div>{child.fullName}</div>
          <div className="student-sub">
            <span>MSSV: {child.studentId}</span>
            {child.profiles.length > 0 && <span>{child.profiles.length} hồ sơ</span>}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
