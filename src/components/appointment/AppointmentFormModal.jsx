import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space } from 'antd';
import { CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const AppointmentFormModal = ({
  visible,
  editingId,
  form,
  loading,
  onCancel,
  onSubmit
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <span>{editingId ? 'Chỉnh Sửa Cuộc Hẹn' : 'Tạo Cuộc Hẹn Mới'}</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="purpose"
          label="Mục Đích Cuộc Hẹn"
          rules={[{ required: true, message: 'Vui lòng nhập mục đích cuộc hẹn' }]}
        >
          <TextArea 
            rows={3} 
            placeholder="Nhập mục đích của cuộc hẹn..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="appointmentTime"
          label="Thời Gian Hẹn"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian hẹn' }]}
        >
          <DatePicker 
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày và giờ hẹn"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="googleMeetLink"
          label="Link Google Meet"
          rules={[
            { type: 'url', message: 'Vui lòng nhập đúng định dạng URL' }
          ]}
        >
          <Input 
            prefix={<VideoCameraOutlined />}
            placeholder="https://meet.google.com/..."
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng Thái"
          initialValue="scheduled"
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="scheduled">Đã Lên Lịch</Option>
            <Option value="in-progress">Đang Diễn Ra</Option>
            <Option value="completed">Hoàn Thành</Option>
            <Option value="cancelled">Đã Hủy</Option>
          </Select>
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingId ? 'Cập Nhật' : 'Tạo Cuộc Hẹn'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentFormModal;