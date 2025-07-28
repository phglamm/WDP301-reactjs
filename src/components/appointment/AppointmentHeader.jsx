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