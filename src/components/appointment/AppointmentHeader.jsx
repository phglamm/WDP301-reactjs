import React from 'react';
import { Button, Space, Select } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined, 
  FilterOutlined,
  ReloadOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const AppointmentHeader = ({
  viewMode,
  setViewMode,
  showDateFilter,
  toggleDateFilter,
  calendarView,
  setCalendarView,
  onCreateNew,
  onRefresh
}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quản Lý Cuộc Hẹn</h2>
        <p className="text-gray-600">Quản lý và theo dõi các cuộc hẹn khám sức khỏe</p>
      </div>
      <Space size="middle">
        {/* View Mode Toggle */}
        <Button.Group>
          <Button 
            type={viewMode === 'calendar' ? 'primary' : 'default'}
            icon={<CalendarOutlined />}
            onClick={() => setViewMode('calendar')}
          >
            Lịch
          </Button>
          <Button 
            type={viewMode === 'list' ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => setViewMode('list')}
          >
            Danh Sách
          </Button>
        </Button.Group>

        {/* Calendar specific controls */}
        {viewMode === 'calendar' && (
          <>
            <Button 
              type={showDateFilter ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={toggleDateFilter}
            >
              {showDateFilter ? 'Ẩn Bộ Lọc' : 'Lọc Theo Ngày'}
            </Button>
            <Select
              value={calendarView}
              onChange={setCalendarView}
              style={{ width: 150 }}
            >
              <Option value="dayGridMonth">Tháng</Option>
              <Option value="timeGridWeek">Tuần</Option>
              <Option value="timeGridDay">Ngày</Option>
            </Select>          </>
        )}

        <Button 
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          title="Làm mới dữ liệu"
        >
          Làm Mới
        </Button>

        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onCreateNew}
          size="large"
        >
          Tạo Cuộc Hẹn Mới
        </Button>
      </Space>
    </div>
  );
};

export default AppointmentHeader;