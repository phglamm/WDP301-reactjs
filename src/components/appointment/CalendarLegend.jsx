import React from 'react';
import { Card } from 'antd';

const CalendarLegend = () => {
  const legendItems = [
    { color: '#1890ff', label: 'Đã Lên Lịch' },
    { color: '#fa8c16', label: 'Đang Diễn Ra' },
    { color: '#52c41a', label: 'Hoàn Thành' },
    { color: '#ff4d4f', label: 'Đã Hủy' }
  ];

  return (
    <Card className="mb-4" size="small">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-medium">Chú thích:</span>
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div style={{ 
              width: 16, 
              height: 16, 
              backgroundColor: item.color, 
              borderRadius: 2 
            }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CalendarLegend;