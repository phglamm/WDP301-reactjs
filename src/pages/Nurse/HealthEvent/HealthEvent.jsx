import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, Upload, message, Space, Card } from 'antd';
import { PlusOutlined, UploadOutlined, FileExcelOutlined, EyeOutlined } from '@ant-design/icons';
import HealthEventService from '../../../services/Nurse/HealthEvent/HealthEvent';
import CardData from '../../../components/CardData/CardData';
import dayjs from 'dayjs';

const { TextArea } = Input;

const HealthEvent = () => {
  const [healthEvents, setHealthEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Fetch health events on component mount
  useEffect(() => {
    fetchHealthEvents();
  }, []);

  const fetchHealthEvents = async () => {
    try {
      setLoading(true);
      const response = await HealthEventService.getAllHealthEvents();
      if (response.status) {
        setHealthEvents(response.data);
      }
    } catch (error) {
      message.error('Không thể tải danh sách sự kiện khám sức khỏe');
      console.error('Error fetching health events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHealthEvent = async (values) => {
    try {
      const formData = {
        name: values.name,
        description: values.description,
        date: values.date.toISOString()
      };

      const response = await HealthEventService.createHealthEvent(formData);
      if (response) {
        message.success('Tạo sự kiện khám sức khỏe thành công!');
        setCreateModalVisible(false);
        createForm.resetFields();
        fetchHealthEvents(); // Refresh the list
      }
    } catch (error) {
      message.error('Không thể tạo sự kiện khám sức khỏe');
      console.error('Error creating health event:', error);
    }
  };
  const handleImportResult = async (file) => {
    try {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        message.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        return false;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        return false;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Show loading message
      const hide = message.loading('Đang import file...', 0);
      
      try {
        const response = await HealthEventService.importHealthEventResult(formData);
        hide();
        
        if (response && response.status) {
          message.success('Import kết quả khám sức khỏe thành công!');
          setImportModalVisible(false);
          fetchHealthEvents(); // Refresh the list
        } else {
          message.error(response?.message || 'Import thất bại');
        }
      } catch (importError) {
        hide();
        console.error('Import error details:', importError);
        
        // Handle specific error cases
        if (importError.response?.status === 400) {
          message.error('File không hợp lệ hoặc format không đúng');
        } else if (importError.response?.status === 413) {
          message.error('File quá lớn');
        } else {
          message.error('Không thể import kết quả khám sức khỏe');
        }
      }
      
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý file');
      console.error('Error handling file:', error);
      return false;
    }
  };

  const showEventDetail = (record) => {
    setSelectedEvent(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => showEventDetail(record)}
          className="p-0 h-auto text-left"
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showEventDetail(record)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];
  const eventsThisMonth = healthEvents.filter(event => 
    dayjs(event.date).month() === dayjs().month() && 
    dayjs(event.date).year() === dayjs().year()
  ).length;


  const upcomingEvents = healthEvents.filter(event => 
    dayjs(event.date).isAfter(dayjs())
  ).length;

  return (
    <div className="p-6 min-h-screen">

      {/* Statistics Cards */}
      <div className="flex justify-center gap-4 mb-6">
        <CardData
          title="Tổng số sự kiện"
          value={healthEvents.length}
          subTitle="Tất cả sự kiện khám sức khỏe"
        />
        <CardData
          title="Sự kiện trong tháng"
          value={eventsThisMonth}
          subTitle={`Tháng ${dayjs().format('MM/YYYY')}`}
        />

        <CardData
          title="Sự kiện sắp tới"
          value={upcomingEvents}
          subTitle="Chưa diễn ra"
        />
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-end gap-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          size="large"
        >
          Tạo sự kiện khám sức khỏe
        </Button>
        <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={() => setImportModalVisible(true)}
          size="large"
        >
          Import kết quả khám
        </Button>
      </div>

      {/* Health Events Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={healthEvents}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} sự kiện`,
          }}
          className="w-full"
        />
      </Card>

      {/* Create Health Event Modal */}
      <Modal
        title="Tạo sự kiện khám sức khỏe mới"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateHealthEvent}
          requiredMark={false}
        >
          <Form.Item
            label="Tên sự kiện"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sự kiện!' },
              { min: 3, message: 'Tên sự kiện phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input 
              placeholder="VD: Khám sức khỏe đợt 1 2025" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' },
              { min: 5, message: 'Mô tả phải có ít nhất 5 ký tự!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả chi tiết về sự kiện khám sức khỏe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Ngày giờ khám"
            name="date"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày giờ khám!' }
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày giờ khám"
              className="w-full"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button 
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo sự kiện
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Import Result Modal */}
      <Modal
        title="Import kết quả khám sức khỏe"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className="text-center py-8">
          <FileExcelOutlined className="text-6xl text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-4">Tải lên file Excel kết quả khám</h3>
          <p className="text-gray-600 mb-6">
            Chọn file Excel chứa kết quả khám sức khỏe để import vào hệ thống
          </p>
          
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleImportResult}
            showUploadList={false}
            maxCount={1}
          >
            <Button 
              type="primary" 
              icon={<UploadOutlined />} 
              size="large"
              className="px-8"
            >
              Chọn file Excel
            </Button>
          </Upload>
          
          <p className="text-sm text-gray-500 mt-4">
            Chỉ hỗ trợ file .xlsx và .xls
          </p>
        </div>
      </Modal>

      {/* Event Detail Modal */}
      <Modal
        title="Chi tiết sự kiện khám sức khỏe"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên sự kiện:
              </label>
              <p className="text-gray-900">{selectedEvent.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mô tả:
              </label>
              <p className="text-gray-900">{selectedEvent.description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ngày giờ khám:
              </label>
              <p className="text-gray-900">
                {dayjs(selectedEvent.date).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ID sự kiện:
              </label>
              <p className="text-gray-900">#{selectedEvent.id}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HealthEvent;
