import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  message, 
  Space, 
  Tag, 
  Card, 
  Descriptions,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  CalendarOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  UserOutlined,
  
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import moment from 'moment';
import AppointmentService from '../../../services/Nurse/AppointmentService/AppointmentService';

const { TextArea } = Input;
const { Option } = Select;

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    today: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    inProgress: 0
  });

  // Calculate statistics
  const calculateStatistics = (appointmentList, todayList) => {
    const stats = {
      total: appointmentList.length,
      today: todayList.length, // Use actual today appointments from API
      scheduled: appointmentList.filter(apt => apt.status === 'scheduled').length,
      completed: appointmentList.filter(apt => apt.status === 'completed').length,
      cancelled: appointmentList.filter(apt => apt.status === 'cancelled').length,
      inProgress: appointmentList.filter(apt => apt.status === 'in-progress').length
    };
    
    setStatistics(stats);
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch both all appointments and today's appointments concurrently
      const [allResponse, todayResponse] = await Promise.all([
        AppointmentService.getAllAppointments(),
        AppointmentService.getTodayAppointments().catch(error => {
          console.error('Error fetching today appointments:', error);
          return { status: false, data: [] };
        })
      ]);

      if (allResponse && allResponse.status) {
        setAppointments(allResponse.data || []);
        setFilteredAppointments(allResponse.data || []);
      }

      if (todayResponse && todayResponse.status) {
        setTodayAppointments(todayResponse.data || []);
      }

      // Calculate statistics with both datasets
      calculateStatistics(
        allResponse?.data || [], 
        todayResponse?.data || []
      );

    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Có lỗi xảy ra khi tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments
  const filterAppointments = (filterType) => {
    setActiveFilter(filterType);
    let filtered = [...appointments];
    
    switch (filterType) {
      case 'today':
        // Use the today appointments from API
        filtered = todayAppointments;
        break;
      case 'scheduled':
        filtered = appointments.filter(apt => apt.status === 'scheduled');
        break;
      case 'completed':
        filtered = appointments.filter(apt => apt.status === 'completed');
        break;
      case 'cancelled':
        filtered = appointments.filter(apt => apt.status === 'cancelled');
        break;
      case 'in-progress':
        filtered = appointments.filter(apt => apt.status === 'in-progress');
        break;
      case 'all':
      default:
        filtered = appointments;
        break;
    }
    
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Table columns
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
        const getStatusConfig = (status) => {
          const configs = {
            'scheduled': { color: 'blue', text: 'Đã Lên Lịch' },
            'completed': { color: 'green', text: 'Hoàn Thành' },
            'cancelled': { color: 'red', text: 'Đã Hủy' },
            'in-progress': { color: 'orange', text: 'Đang Diễn Ra' }
          };
          return configs[status] || { color: 'default', text: status };
        };
        
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
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handle view detail
  const handleViewDetail = async (appointment) => {
    try {
      setLoading(true);
      const response = await AppointmentService.getAppointmentById(appointment.id);
      if (response && response.status) {
        setSelectedAppointment(response.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      message.error('Có lỗi xảy ra khi tải chi tiết cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Handle create new appointment
  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = {
        purpose: values.purpose,
        appointmentTime: values.appointmentTime.toISOString(),
        googleMeetLink: values.googleMeetLink,
        status: values.status || 'scheduled',
      };

      if (editingId) {
        // Add update API call when available
        // await AppointmentService.updateAppointment(editingId, formData);
        message.success('Cập nhật cuộc hẹn thành công');
      } else {
        await AppointmentService.createAppointment(formData);
        message.success('Tạo cuộc hẹn thành công');
      }

      setModalVisible(false);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      message.error('Có lỗi xảy ra khi lưu cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format('dddd, DD/MM/YYYY HH:mm');
  };

  return (
    <div className="p-6">
     {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('all')}
          >
            <Statistic
              title="Tất cả cuộc Hẹn"
              value={statistics.total}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'today' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('today')}
          >
            <Statistic
              title="Cuộc hẹn hôm Nay của tôi"
              value={statistics.today}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'scheduled' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('scheduled')}
          >
            <Statistic
              title="Đã Lên Lịch"
              value={statistics.scheduled}
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'in-progress' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('in-progress')}
          >
            <Statistic
              title="Đang Diễn Ra"
              value={statistics.inProgress}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('completed')}
          >
            <Statistic
              title="Hoàn Thành"
              value={statistics.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card 
            hoverable
            className={`cursor-pointer transition-all duration-300 ${
              activeFilter === 'cancelled' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-lg'
            }`}
            onClick={() => filterAppointments('cancelled')}
          >
            <Statistic
              title="Đã Hủy"
              value={statistics.cancelled}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Quản Lý Cuộc Hẹn</h2>
          <p className="text-gray-600">Quản lý và theo dõi các cuộc hẹn khám sức khỏe</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Tạo Cuộc Hẹn Mới
        </Button>
      </div>


      <Table
        columns={columns}
        dataSource={filteredAppointments}
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 5,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} trong ${total} cuộc hẹn`
        }}
        bordered
        scroll={{ x: 1200 }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <span>{editingId ? 'Chỉnh Sửa Cuộc Hẹn' : 'Tạo Cuộc Hẹn Mới'}</span>
          </div>
        }
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? 'Cập Nhật' : 'Tạo Cuộc Hẹn'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>Chi Tiết Cuộc Hẹn</span>
          </div>
        }
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedAppointment(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
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
    </div>
  );
};

export default Appointment;