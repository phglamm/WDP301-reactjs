import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined, ClockCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import moment from 'moment';

const TableView = ({ filteredAppointments, loading, onViewDetail }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'scheduled': { color: 'blue', text: 'Đã Lên Lịch' },
      'completed': { color: 'green', text: 'Hoàn Thành' },
      'cancelled': { color: 'red', text: 'Đã Hủy' },
      'in-progress': { color: 'orange', text: 'Đang Diễn Ra' }
    };
    return configs[status] || { color: 'default', text: status };
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Mục Đích',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 200,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: 'Thời Gian Hẹn',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 180,
      render: (time) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          {moment(time).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Google Meet',
      dataIndex: 'googleMeetLink',
      key: 'googleMeetLink',
      width: 150,
      render: (link) => (
        link ? (
          <Button 
            type="link" 
            icon={<VideoCameraOutlined />}
            onClick={() => window.open(link, '_blank')}
            size="small"
          >
            Tham Gia
          </Button>
        ) : (
          <span style={{ color: '#999' }}>Không có</span>
        )
      ),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem Chi Tiết">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredAppointments}
      rowKey="id"
      loading={loading}
      pagination={{ 
        pageSize: 10,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} trong ${total} cuộc hẹn`
      }}
      bordered
      scroll={{ x: 1200 }}
    />
  );
};

export default TableView;