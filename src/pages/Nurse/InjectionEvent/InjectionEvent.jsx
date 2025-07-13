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
  Tag, 
  Space, 
  Card, 
  Row, 
  Col,
  Descriptions,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  DownloadOutlined
} from '@ant-design/icons';
import injectionEventService from '../../../services/Nurse/InjectionEvent/InjectionEvent';
import CardData from '../../../components/CardData/CardData';
import moment from 'moment';
import VaccinationService from '../../../services/Nurse/VaccinationService/VaccinationService';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const InjectionEvent = () => {
  const [injectionEvents, setInjectionEvents] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState({}); // Change to object
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCard, setSelectedCard] = useState('all');
  const [form] = Form.useForm();

  // Fetch injection events
  const fetchInjectionEvents = async () => {
    try {
      setLoading(true);
      const response = await injectionEventService.getAllInjectionEvents();
      if (response.status && response.data) {
        setInjectionEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching injection events:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu sự kiện tiêm chủng!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch vaccinations for dropdown
  const fetchVaccinations = async () => {
    try {
      const response = await VaccinationService.getAllVaccinations();
      if (response.status && response.data) {
        setVaccinations(response.data);
      }
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    }
  };

  // Download registered students list
  const handleDownloadStudents = async (event) => {
    try {
      setDownloadLoading(prev => ({ ...prev, [event.id]: true }));
      message.loading({ content: 'Đang tải danh sách học sinh...', key: `download-${event.id}` });
      
      const blob = await injectionEventService.downloadStudentRegisteredInjectionEvent(event.id);
      
      console.log('Blob received:', blob);
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      
      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error('Empty file received');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const eventName = event.vaccination?.name?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'vaccination_event';
      const eventDate = moment(event.date).format('YYYY-MM-DD');
      const timestamp = moment().format('HHmmss');
      
      link.download = `${eventName}_Event_${event.id}_${eventDate}_${timestamp}.xlsx`;
      
      // Set download attributes
      link.setAttribute('download', link.download);
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);
      
      message.success({ 
        content: 'Tải xuống thành công!', 
        key: `download-${event.id}` 
      });
      
    } catch (error) {
      console.error('Error downloading students list:', error);
      message.error({ 
        content: `Có lỗi xảy ra khi tải danh sách học sinh: ${error.message}`, 
        key: `download-${event.id}` 
      });
    } finally {
      setDownloadLoading(prev => ({ ...prev, [event.id]: false }));
    }
  };

  useEffect(() => {
    fetchInjectionEvents();
    fetchVaccinations();
  }, []);

  // Filter events based on search and selected card
  const filteredEvents = injectionEvents.filter(event => {
    let matchesSearch = true;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      matchesSearch = (
        event.vaccination?.name?.toLowerCase().includes(searchLower) ||
        event.vaccination?.description?.toLowerCase().includes(searchLower) ||
        event.vaccination?.type?.toLowerCase().includes(searchLower)
      );
    }

    let matchesCard = true;
    if (selectedCard === 'free') {
      matchesCard = event.vaccination?.type === 'free';
    } else if (selectedCard === 'paid') {
      matchesCard = event.vaccination?.type === 'paid';
    }

    return matchesSearch && matchesCard;
  });

  // Calculate statistics
  const totalEvents = injectionEvents.length;
  const freeEvents = injectionEvents.filter(event => event.vaccination?.type === 'free').length;
  const paidEvents = injectionEvents.filter(event => event.vaccination?.type === 'paid').length;

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        vaccinationId: values.vaccinationId.toString(),
        registrationOpenDate: values.registrationOpenDate.toISOString(),
        registrationCloseDate: values.registrationCloseDate.toISOString(),
        date: values.date.toISOString(),
        price: values.price || 0
      };

      const response = await injectionEventService.createInjectionEvent(formData);
      
      if (response.status) {
        message.success('Tạo sự kiện tiêm chủng thành công!');
        setModalVisible(false);
        form.resetFields();
        fetchInjectionEvents();
      } else {
        message.error('Có lỗi xảy ra khi tạo sự kiện!');
      }
    } catch (error) {
      console.error('Error creating injection event:', error);
      message.error('Có lỗi xảy ra khi tạo sự kiện tiêm chủng!');
    }
  };

  const handleViewDetail = (event) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên vaccine',
      dataIndex: ['vaccination', 'name'],
      key: 'vaccinationName',
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Loại',
      dataIndex: ['vaccination', 'type'],
      key: 'vaccinationType',
      width: 100,
      render: (type) => (
        <Tag color={type === 'free' ? 'green' : 'blue'}>
          {type === 'free' ? 'Miễn phí' : 'Có phí'}
        </Tag>
      )
    },
    {
      title: 'Số liều',
      dataIndex: ['vaccination', 'numberOfDoses'],
      key: 'numberOfDoses',
      width: 100,
      render: (doses) => <Tag color="purple">{doses} liều</Tag>
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <span className={price === 0 ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
          {price === 0 ? 'Miễn phí' : `${price.toLocaleString()} VNĐ`}
        </span>
      )
    },
    {
      title: 'Ngày mở đăng ký',
      dataIndex: 'registrationOpenDate',
      key: 'registrationOpenDate',
      width: 180,
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Ngày đóng đăng ký',
      dataIndex: 'registrationCloseDate',
      key: 'registrationCloseDate',
      width: 180,
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const now = moment();
        const regOpen = moment(record.registrationOpenDate);
        const regClose = moment(record.registrationCloseDate);
        const eventDate = moment(record.date);

        if (now.isBefore(regOpen)) {
          return <Tag color="orange">Chưa mở đăng ký</Tag>;
        } else if (now.isBetween(regOpen, regClose)) {
          return <Tag color="green">Đang mở đăng ký</Tag>;
        } else if (now.isAfter(regClose) && now.isBefore(eventDate)) {
          return <Tag color="blue">Đã đóng đăng ký</Tag>;
        } else {
          return <Tag color="gray">Đã hoàn thành</Tag>;
        }
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          />
          <Button
            icon={<DownloadOutlined />}
            size="small"
            type="primary"
            onClick={() => handleDownloadStudents(record)}
            loading={downloadLoading[record.id] || false} // Use event-specific loading
            title="Tải danh sách học sinh"
          />
        </Space>
      ),
    },
  ];

  const generalReport = [
    {
      title: "Tổng số sự kiện",
      value: totalEvents,
      subtitle: "sự kiện tiêm chủng",
      filterType: "all"
    },
    {
      title: "Sự kiện miễn phí",
      value: freeEvents,
      subtitle: "không tính phí",
      filterType: "free"
    },
    {
      title: "Sự kiện có phí",
      value: paidEvents,
      subtitle: "tính phí",
      filterType: "paid"
    }
  ];

  return (
    <div className="w-full h-full pt-[1%]">
      {/* Statistics Cards */}
      <div className="w-full flex flex-wrap justify-center gap-10 items-center mb-4">
        {generalReport.map((item, index) => (
          <CardData
            onClick={() => handleCardClick(item.filterType)}
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
          />
        ))}
      </div>

      {/* Filter Status */}
      {selectedCard !== 'all' && (
        <div className="mb-4">
          <Tag 
            color="blue" 
            closable 
            onClose={() => setSelectedCard('all')}
            style={{ fontSize: '14px', padding: '4px 8px' }}
          >
            Lọc: {selectedCard === 'free' ? 'Sự kiện miễn phí' : selectedCard === 'paid' ? 'Sự kiện có phí' : 'Tất cả'}
          </Tag>
        </div>
      )}

      {/* Header with Search and Add Button */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quản lý sự kiện tiêm chủng</h3>
        <Space>
          <Search
            placeholder="Tìm kiếm sự kiện tiêm chủng..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Tạo sự kiện mới
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredEvents}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sự kiện`,
        }}
        bordered
        scroll={{ x: 1400 }}
        size="small"
      />

      {/* Create/Edit Modal */}
      <Modal
        title="Tạo sự kiện tiêm chủng"
        open={modalVisible}
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
        >
          <Form.Item
            label="Vaccine"
            name="vaccinationId"
            rules={[{ required: true, message: 'Vui lòng chọn vaccine!' }]}
          >
            <Select placeholder="Chọn vaccine">
              {vaccinations.map(vaccine => (
                <Option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name} ({vaccine.type === 'free' ? 'Miễn phí' : 'Có phí'})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày mở đăng ký"
                name="registrationOpenDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày mở đăng ký!' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày mở đăng ký"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày đóng đăng ký"
                name="registrationCloseDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày đóng đăng ký!' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày đóng đăng ký"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày tiêm"
                name="date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm!' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày tiêm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập giá (0 nếu miễn phí)"
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo sự kiện
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết sự kiện tiêm chủng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedEvent && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID sự kiện">
              {selectedEvent.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên vaccine">
              {selectedEvent.vaccination?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại vaccine">
              <Tag color={selectedEvent.vaccination?.type === 'free' ? 'green' : 'blue'}>
                {selectedEvent.vaccination?.type === 'free' ? 'Miễn phí' : 'Có phí'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số liều">
              <Tag color="purple">{selectedEvent.vaccination?.numberOfDoses} liều</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả vaccine" span={2}>
              {selectedEvent.vaccination?.description}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              <span className={selectedEvent.price === 0 ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                {selectedEvent.price === 0 ? 'Miễn phí' : `${selectedEvent.price.toLocaleString()} VNĐ`}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày mở đăng ký">
              {moment(selectedEvent.registrationOpenDate).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đóng đăng ký">
              {moment(selectedEvent.registrationCloseDate).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tiêm">
              {moment(selectedEvent.date).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default InjectionEvent;