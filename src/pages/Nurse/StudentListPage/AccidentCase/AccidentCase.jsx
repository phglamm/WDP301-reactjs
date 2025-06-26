import React, { useState } from 'react';
import { 
  Space, 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Descriptions, 
  Card, 
  Divider, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message 
} from "antd";
import { 
  EyeOutlined, 
  EditOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  PlusOutlined,
  
} from '@ant-design/icons';
import AccidentService from '../../../../services/Nurse/AccidentService/AccidentService';

const { TextArea } = Input;
const { Option } = Select;

const AccidentCase = ({ accidents, searchText, onAccidentReported, students }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Filter accidents based on search text
  const filteredAccidents = accidents.filter(accident => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      accident.student?.fullName?.toLowerCase().includes(searchLower) ||
      accident.student?.studentCode?.toLowerCase().includes(searchLower) 
    );
  });

  const columns = [
    { 
      title: "Mã Tai Nạn", 
      dataIndex: "id", 
      key: "id",
      width: 100,
    },
    { 
      title: "Mã Học Sinh", 
      dataIndex: ["student", "studentCode"], 
      key: "studentCode",
      width: 120,
    },
    { 
      title: "Tên Học Sinh", 
      dataIndex: ["student", "fullName"], 
      key: "studentName",
      width: 150,
    },
    { 
      title: "Tóm Tắt", 
      dataIndex: "summary", 
      key: "summary",
      width: 150,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text}
        </span>
      ),
    },
    { 
      title: "Loại", 
      dataIndex: "type", 
      key: "type",
      width: 100,
      render: (type) => {
        const color = type === 'Vật lý' ? 'red' : 
                     type === 'Tinh thần' ? 'blue' : 
                     type === 'Y tế' ? 'green' :
                     type === 'Chấn thương' ? 'volcano' : 'default';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    { 
      title: "Ngày", 
      dataIndex: "date", 
      key: "date",
      width: 150,
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        return formattedDate;
      },
    },
    { 
      title: "Y Tá", 
      dataIndex: ["nurse", "fullName"], 
      key: "nurseName",
      width: 150,
    },
    { 
      title: "Địa Chỉ Học Sinh", 
      dataIndex: ["student", "address"], 
      key: "studentAddress",
      width: 200,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text || 'Không có'}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewDetail(record)}
            title="Xem Chi Tiết"
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            onClick={() => handleEdit(record)}
            title="Chỉnh Sửa"
          />
        </Space>
      ),
    },
  ];

  const handleViewDetail = (accident) => {
    console.log('View detail for accident:', accident);
    setSelectedAccident(accident);
    setModalVisible(true);
  };

  const handleEdit = (accident) => {
    console.log('Edit accident:', accident);
    // Add your edit logic here
  };

  // Handle Report New Accident
  const handleReportAccident = () => {
    form.resetFields();
    setReportModalVisible(true);
  };

  // Handle Submit Accident Report
  const handleSubmitReport = async (values) => {
    try {
      setLoading(true);
      
      const reportData = {
        studentCode: values.studentCode,
        summary: values.summary,
        type: values.type,
        severity: values.severity || 'Vừa',
      };

      console.log('Submitting accident report:', reportData);
      
      const response = await AccidentService.createAccidentReport(reportData);
      
      if (response && response.status) {
        message.success('Báo cáo tai nạn đã được tạo thành công');
        setReportModalVisible(false);
        form.resetFields();
        
        // Callback to refresh accidents list
        if (onAccidentReported) {
          onAccidentReported();
        }
      }
    } catch (error) {
      console.error('Error creating accident report:', error);
      message.error('Có lỗi xảy ra khi tạo báo cáo tai nạn');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      'Vật lý': 'red',
      'Tinh thần': 'blue', 
      'Y tế': 'green',
      'Chấn thương': 'volcano'
    };
    return colors[type] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Nhẹ': 'green',
      'Vừa': 'orange',
      'Nặng': 'red',
      'Nghiêm trọng': 'volcano'
    };
    return colors[severity] || 'default';
  };

  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">
      {/* Header with Report Button */}
      <div className="w-full mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-1">Danh Sách Tai Nạn</h3>
          <p className="text-sm text-gray-600">
            Hiển thị {filteredAccidents.length} trong {accidents.length} tai nạn
            {searchText && ` phù hợp với "${searchText}"`}
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleReportAccident}
          size="large"
          danger
        >
          Báo Cáo Tai Nạn
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAccidents}
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} trong ${total} tai nạn`
        }}
        bordered
        scroll={{ x: 1200 }}
        style={{ width: "100%", height: "100%" }}
        size="small"
      />

      {/* Report Accident Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined style={{ color: '#ff4d4f' }} />
            <span>Báo Cáo Tai Nạn Mới</span>
          </div>
        }
        visible={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitReport}
          style={{ marginTop: 16 }}
        >          <Form.Item
            name="studentCode"
            label="Mã Học Sinh"
            rules={[{ required: true, message: 'Vui lòng chọn học sinh' }]}
          >
            <Select 
              placeholder="Chọn học sinh"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {students?.map(student => (
                <Option key={student.studentCode} value={student.studentCode}>
                  {student.studentCode} - {student.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="summary"
            label="Tóm Tắt Tai Nạn"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt tai nạn' }]}
          >
            <TextArea 
              rows={2} 
              placeholder="chảy máu đầu"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại Tai Nạn"
            rules={[{ required: true, message: 'Vui lòng chọn loại tai nạn' }]}
          >
            <Select placeholder="Chọn loại tai nạn">
              <Option value="Chấn thương">Chấn thương</Option>
              <Option value="Vật lý">Vật lý</Option>
              <Option value="Tinh thần">Tinh thần</Option>
              <Option value="Y tế">Y tế</Option>
            </Select>
          </Form.Item>


          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setReportModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} danger>
                Báo Cáo Tai Nạn
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Accident Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MedicineBoxOutlined style={{ color: '#ff4d4f' }} />
            <span>Chi Tiết Tai Nạn: {selectedAccident?.student?.fullName}</span>
          </div>
        }
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedAccident(null);
        }}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              handleEdit(selectedAccident);
              setModalVisible(false);
            }}
          >
            Chỉnh Sửa
          </Button>
        ]}
        width={900}
        centered
      >
        {selectedAccident && (
          <div>
            {/* Student Information Card */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined style={{ color: '#1890ff' }} />
                  <span>Thông Tin Học Sinh</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Mã Học Sinh">
                  <Tag color="blue">{selectedAccident.student?.studentCode}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Họ Và Tên">
                  <strong>{selectedAccident.student?.fullName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Lớp">
                  <Tag color="green">{selectedAccident.student?.class}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Giới Tính">
                  <Tag color={selectedAccident.student?.gender === 'Nam' ? 'blue' : 'pink'}>
                    {selectedAccident.student?.gender}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh" span={2}>
                  {selectedAccident.student?.dob ? 
                    new Date(selectedAccident.student.dob).toLocaleDateString('vi-VN') : 
                    'Không có'
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ" span={2}>
                  {selectedAccident.student?.address || 'Không có'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Accident Information Card */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileTextOutlined style={{ color: '#ff4d4f' }} />
                  <span>Thông Tin Tai Nạn</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Mã Tai Nạn">
                  <Tag color="volcano">#{selectedAccident.id}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày & Giờ">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarOutlined />
                    {formatDate(selectedAccident.date)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  <Tag color={getTypeColor(selectedAccident.type)} style={{ fontSize: '12px' }}>
                    {selectedAccident.type}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Mức Độ">
                  <Tag color={getSeverityColor(selectedAccident.severity)} style={{ fontSize: '12px' }}>
                    {selectedAccident.severity || 'Chưa xác định'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Địa Điểm">
                  {selectedAccident.location || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  <Tag color={selectedAccident.status === 'Resolved' ? 'green' : 'orange'}>
                    {selectedAccident.status === 'Resolved' ? 'Đã xử lý' : 'Đang xử lý'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left" style={{ margin: '16px 0' }}>Tóm Tắt</Divider>
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #d9d9d9'
              }}>
                <p style={{ margin: 0, lineHeight: '1.6' }}>
                  {selectedAccident.summary || 'Không có tóm tắt'}
                </p>
              </div>

              {selectedAccident.description && (
                <>
                  <Divider orientation="left" style={{ margin: '16px 0' }}>Mô Tả Chi Tiết</Divider>
                  <div style={{ 
                    backgroundColor: '#fff2e8', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #ffb366'
                  }}>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>
                      {selectedAccident.description}
                    </p>
                  </div>
                </>
              )}

              {selectedAccident.treatment && (
                <>
                  <Divider orientation="left" style={{ margin: '16px 0' }}>Phương Pháp Điều Trị</Divider>
                  <div style={{ 
                    backgroundColor: '#f6ffed', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #b7eb8f'
                  }}>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>
                      {selectedAccident.treatment}
                    </p>
                  </div>
                </>
              )}
            </Card>

            {/* Nurse Information Card */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MedicineBoxOutlined style={{ color: '#52c41a' }} />
                  <span>Y Tá Phụ Trách</span>
                </div>
              }
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Tên Y Tá">
                  <strong>{selectedAccident.nurse?.fullName || 'Không có'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Mã Nhân Viên">
                  {selectedAccident.nurse?.employeeId || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Phòng Ban">
                  {selectedAccident.nurse?.department || 'Phòng Y Tế Trường'}
                </Descriptions.Item>
                <Descriptions.Item label="Liên Hệ">
                  {selectedAccident.nurse?.phone || selectedAccident.nurse?.email || 'Không có'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccidentCase;