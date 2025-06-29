import React from 'react';
import { Card, Button, Tag, DatePicker } from 'antd';
import { CalendarOutlined, ClearOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const DateFilter = ({ 
  dateRange, 
  onDateRangeChange, 
  onClearDateRange 
}) => {
  return (
    <Card className="mb-4" size="small">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <span className="font-medium">Lọc theo khoảng thời gian:</span>
        </div>
        <RangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Từ ngày', 'Đến ngày']}
          allowClear={false}
          style={{ minWidth: 280 }}
        />
        {dateRange && (
          <Button 
            type="text" 
            icon={<ClearOutlined />}
            onClick={onClearDateRange}
            size="small"
          >
            Xóa Bộ Lọc
          </Button>
        )}
        {dateRange && (
          <Tag color="blue">
            {`${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`}
          </Tag>
        )}
      </div>
    </Card>
  );
};

export default DateFilter;