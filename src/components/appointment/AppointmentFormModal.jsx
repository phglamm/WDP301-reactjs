import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space, Avatar } from 'antd';
import { CalendarOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const AppointmentFormModal = ({
  parent,
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
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 16 }}
      >
        {/* Parent Selection */}
        <Form.Item
          name="parentId"
          label="Chọn Phụ Huynh"
          rules={[{ required: true, message: 'Vui lòng chọn phụ huynh' }]}
        >
          <Select
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
            showSearch
            filterOption={(input, option) => {
              const searchValue = input.toLowerCase().trim();
              const parentData = option.props['data-parent'];
              
              if (!parentData || !searchValue) return true;
              
              return (
                parentData.fullName.toLowerCase().includes(searchValue) ||
                parentData.phone.includes(searchValue) ||
                parentData.email.toLowerCase().includes(searchValue)
              );
            }}
            style={{ width: '100%' }}
            notFoundContent="Không tìm thấy phụ huynh"
            allowClear
            optionLabelProp='label'
          >
            {parent && parent.length > 0 ? (
              parent.map((parentItem) => (
                <Option 
                  key={parentItem.id} 
                  value={parentItem.id}
                  label={`${parentItem.fullName} - ${parentItem.phone}`}
                  data-parent={parentItem}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '4px 0'
                  }}>
                    <Avatar 
                      size="small" 
                      style={{ 
                        backgroundColor: '#1890ff',
                        flexShrink: 0 
                      }}
                    >
                      {parentItem.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      minWidth: 0,
                      flex: 1
                    }}>
                      <span style={{ 
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#262626'
                      }}>
                        {parentItem.fullName}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#8c8c8c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{parentItem.phone}</span>
                        <span>•</span>
                        <span>{parentItem.email}</span>
                      </span>
                    </div>
                  </div>
                </Option>
              ))
            ) : (
              <Option disabled value="">
                {loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu phụ huynh'}
              </Option>
            )}
          </Select>
        </Form.Item>

        {/* Purpose */}
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

        {/* Appointment Time */}
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
            showNow={false}
          />
        </Form.Item>

        {/* Form Actions */}
        <Form.Item className="mb-0" style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={onCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none'
              }}
            >
              {editingId ? 'Cập Nhật' : 'Tạo Cuộc Hẹn'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentFormModal;