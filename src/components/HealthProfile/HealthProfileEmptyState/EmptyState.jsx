import React from 'react';
import { FaRegStickyNote } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <FaRegStickyNote size={48} />
      <div>Chưa có hồ sơ sức khỏe nào cho học sinh này.</div>
      <div>Hãy tạo hồ sơ đầu tiên bằng cách điền form bên trên.</div>
    </div>
  );
};

export default EmptyState;
