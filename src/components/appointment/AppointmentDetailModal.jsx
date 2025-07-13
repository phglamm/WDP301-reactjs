import React from 'react';
import { Modal, Button, Card, Descriptions, Tag } from 'antd';
import { 
  EyeOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  VideoCameraOutlined,
  UserOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const AppointmentDetailModal = ({
  visible,
  selectedAppointment,
  onCancel,
  formatDateTime
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>Chi Tiết Cuộc Hẹn</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        selectedAppointment?.googleMeetLink && (
          <Button 
            key="join" 
            type="primary" 
            icon={<VideoCameraOutlined />}
            onClick={() => window.open(selectedAppointment.googleMeetLink, '_blank')}
          >
            Tham Gia Cuộc Họp
          </Button>
        )
      ]}
      width={700}
      centered
    >
      {selectedAppointment && (
        <div>
          {/* Appointment Information */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>Thông Tin Cuộc Hẹn</span>
              </div>
            }
            style={{ marginBottom: 16 }}
            size="small"
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="ID Cuộc Hẹn">
                <Tag color="blue">#{selectedAppointment.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng Thái">
                <Tag color={
                  selectedAppointment.status === 'scheduled' ? 'blue' :
                  selectedAppointment.status === 'completed' ? 'green' :
                  selectedAppointment.status === 'cancelled' ? 'red' : 'orange'
                }>
                  {selectedAppointment.status === 'scheduled' ? 'Đã Lên Lịch' :
                   selectedAppointment.status === 'completed' ? 'Hoàn Thành' :
                   selectedAppointment.status === 'cancelled' ? 'Đã Hủy' : 'Đang Diễn Ra'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời Gian Hẹn" span={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ClockCircleOutlined />
                  {formatDateTime(selectedAppointment.appointmentTime)}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày Tạo">
                {moment(selectedAppointment.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập Nhật Lần Cuối">
                {moment(selectedAppointment.updatedAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Mục Đích" span={2}>
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  border: '1px solid #d9d9d9'
                }}>
                  {selectedAppointment.purpose}
                </div>
              </Descriptions.Item>
              {selectedAppointment.googleMeetLink && (
                <Descriptions.Item label="Google Meet Link" span={2}>
                  <Button 
                    type="link" 
                    icon={<VideoCameraOutlined />}
                    onClick={() => window.open(selectedAppointment.googleMeetLink, '_blank')}
                  >
                    {selectedAppointment.googleMeetLink}
                  </Button>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Nurse Information (if available) */}
          {selectedAppointment.nurse && (
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined style={{ color: '#52c41a' }} />
                  <span>Y Tá Phụ Trách</span>
                </div>
              }
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Tên Y Tá">
                  <strong>{selectedAppointment.nurse.fullName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="ID Y Tá">
                  <Tag color="green">#{selectedAppointment.nurse.id}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">
                  {selectedAppointment.nurse.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedAppointment.nurse.email}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;