import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';

const AppointmentStats = ({ statistics, activeFilter, onFilterChange }) => {
  const statsConfig = [
    {
      key: 'all',
      title: 'Tất cả cuộc Hẹn',
      value: statistics.total,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
      ringColor: 'ring-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'today',
      title: 'Cuộc hẹn hôm Nay',
      value: statistics.today,
      icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16',
      ringColor: 'ring-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      key: 'scheduled',
      title: 'Đã Lên Lịch',
      value: statistics.scheduled,
      icon: <CalendarOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
      ringColor: 'ring-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'in-progress',
      title: 'Đang Diễn Ra',
      value: statistics.inProgress,
      icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16',
      ringColor: 'ring-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      key: 'completed',
      title: 'Hoàn Thành',
      value: statistics.completed,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
      ringColor: 'ring-green-500',
      bgColor: 'bg-green-50'
    },
    {
      key: 'cancelled',
      title: 'Đã Hủy',
      value: statistics.cancelled,
      icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
      color: '#ff4d4f',
      ringColor: 'ring-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statsConfig.map((stat) => (
        <Col xs={24} sm={12} md={8} lg={4} key={stat.key}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === stat.key ? `ring-2 ${stat.ringColor} ${stat.bgColor}` : 'hover:shadow-lg'
            }`}
            onClick={() => onFilterChange(stat.key)}
          >
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={{ color: stat.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AppointmentStats;