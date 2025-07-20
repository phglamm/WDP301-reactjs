import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space, Avatar, InputNumber } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined, 
  FilterOutlined,
  ReloadOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
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
  // Debug form values when modal opens
  React.useEffect(() => {
    if (visible) {
      console.log("Modal opened, current form values:", form.getFieldsValue());
      const appointmentTime = form.getFieldValue('appointmentTime');
      if (appointmentTime) {
        console.log("AppointmentTime in modal:", appointmentTime);
        console.log("AppointmentTime formatted:", moment(appointmentTime).format("DD/MM/YYYY HH:mm:ss"));
        console.log("Is moment:", moment.isMoment(appointmentTime));
      }
    }
  }, [visible, form]);

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
          {/* Appointment Time and Duration */}
        <div style={{ display: 'flex', gap: '16px' }}>          
        <Form.Item
            name="appointmentTime"
            label="Thời Gian Hẹn"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian hẹn' },              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const now = moment();
                  
                  // Check if selected time is in the past
                  if (value.isBefore(now)) {
                    return Promise.reject(new Error('Không thể chọn thời gian trong quá khứ'));
                  }
                  
                  // Check if time is between 20:00 and 07:00
                  const hour = value.hour();
                  if (hour >= 20 || hour < 7) {
                    return Promise.reject(new Error('Thời gian hẹn phải từ 07:00 đến 19:59'));
                  }
                  
                  return Promise.resolve();
                }
              }
            ]}
            style={{ flex: 2 }}
          >
            <DatePicker 
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày và giờ hẹn"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
              disabledTime={(current) => {
                const now = moment();
                const isToday = current && current.isSame(now, 'day');
                
                return {
                  disabledHours: () => {
                    const disabledHours = [];
                    
                    // Disable hours from 20:00 to 23:59
                    for (let i = 20; i <= 23; i++) {
                      disabledHours.push(i);
                    }
                    
                    // Disable hours from 00:00 to 06:59
                    for (let i = 0; i < 7; i++) {
                      disabledHours.push(i);
                    }
                      // If today, also disable past hours (but only within working hours)
                    if (isToday) {
                      const currentHour = now.hour();
                      // Only disable past hours within the working time range (7-19)
                      for (let i = 7; i <= currentHour && i < 20; i++) {
                        if (!disabledHours.includes(i)) {
                          disabledHours.push(i);
                        }
                      }
                    }
                    
                    return disabledHours;
                  },
                  disabledMinutes: (selectedHour) => {
                    const disabledMinutes = [];
                    
                    // If today and current hour, disable past minutes
                    if (isToday && selectedHour === now.hour()) {
                      const currentMinute = now.minute();
                      for (let i = 0; i <= currentMinute; i++) {
                        disabledMinutes.push(i);
                      }
                    }
                    
                    return disabledMinutes;
                  }
                };
              }}
              showNow={false}
              onChange={(value) => {
                console.log("DatePicker onChange:", value);
                if (value) {
                  console.log("DatePicker onChange formatted:", value.format("DD/MM/YYYY HH:mm:ss"));
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời Gian (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian dự kiến' }]}
            initialValue={45}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={15}
              max={180}
              step={15}
              placeholder="45"
              style={{ width: '100%' }}
              suffix={<ClockCircleOutlined />}
            />
          </Form.Item>
        </div>

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