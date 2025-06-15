import React, { useState, useEffect } from 'react';
import { 
  Space, 
  Table, 
  Tag, 
  Button, 
  Image, 
  Upload, 
  message, 
  Select, 
  Modal, 
  Card,
  Row,
  Col,
  Descriptions,
  Spin
} from "antd";
import { 
  EyeOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  UploadOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import slotService from '../../../../services/SlotService/SlotService';

const { Option } = Select;
const { confirm } = Modal;

const MedicineDistribution = ({ searchText }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSession, setSelectedSession] = useState('Sáng');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [selectedSlotForCheck, setSelectedSlotForCheck] = useState(null);
  const [checkImage, setCheckImage] = useState(null);

  // Session options
  const sessionOptions = [
    { value: 'Sáng', label: 'Sáng (Morning)' },
    { value: 'Trưa', label: 'Trưa (Afternoon)' },
    { value: 'Tối', label: 'Tối (Evening)' }
  ];

  // Fetch slots data based on selected session
  const fetchSlots = async (session = selectedSession) => {
    try {
      setLoading(true);
      // URL encode the Vietnamese session name
      const encodedSession = encodeURIComponent(session);
      console.log('Fetching slots for session:', session, 'encoded:', encodedSession);
      
      const response = await slotService.getSlotTodaty(encodedSession);
      
      if (response.status && response.data) {
        // Flatten the data structure from the API response
        const allSlots = [];
        Object.keys(response.data).forEach(className => {
          response.data[className].forEach(slot => {
            allSlots.push({
              ...slot,
              className: className,
              key: `${className}-${slot.id}`
            });
          });
        });
        setSlots(allSlots);
        console.log('Loaded slots:', allSlots.length);
      } else {
        setSlots([]);
        console.log('No slots found for session:', session);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and session change
  useEffect(() => {
    fetchSlots();
  }, [selectedSession]);

  // Filter slots based on search text
  const filteredSlots = slots.filter(slot => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    const student = slot.medicineRequest?.student;
    
    return (
      student?.fullName?.toLowerCase().includes(searchLower) ||
      student?.studentCode?.toLowerCase().includes(searchLower) ||
      slot.className?.toLowerCase().includes(searchLower) ||
      slot.note?.toLowerCase().includes(searchLower)
    );
  });

  // Handle Excel file upload
  const handleExcelUpload = async (file) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await slotService.importSlots(formData);
      
      if (response.status) {
        message.success('Import dữ liệu thành công!');
        fetchSlots(); // Refresh data after import
      } else {
        message.error('Import thất bại!');
      }
      
    } catch (error) {
      console.error('Error importing Excel file:', error);
      message.error('Có lỗi xảy ra khi import dữ liệu!');
    } finally {
      setUploading(false);
    }
    
    return false; // Prevent auto upload
  };

  const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel' ||
                   file.name.endsWith('.xlsx') ||
                   file.name.endsWith('.xls');
    
    if (!isExcel) {
      message.error('Bạn chỉ có thể tải lên file Excel (.xlsx, .xls)!');
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File phải nhỏ hơn 10MB!');
      return false;
    }
    
    return handleExcelUpload(file);
  };

  // Handle check slot (mark as taken) with image
  const handleCheckSlot = async (slot, imageFile = null) => {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await slotService.checkSlot(slot.id, formData);
      
      if (response.status) {
        message.success('Đã đánh dấu thuốc đã uống!');
        fetchSlots(); // Refresh data
        setCheckModalVisible(false);
        setSelectedSlotForCheck(null);
        setCheckImage(null);
      } else {
        message.error('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error checking slot:', error);
      message.error('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleViewDetail = (slot) => {
    setSelectedRecord(slot);
    setDetailModalVisible(true);
  };

  const handleMarkAsTaken = (slot) => {
    setSelectedSlotForCheck(slot);
    setCheckModalVisible(true);
  };

  const columns = [
    { 
      title: "Lớp", 
      dataIndex: "className", 
      key: "className",
      width: 80,
      render: (className) => (
        <Tag color="blue">{className}</Tag>
      ),
    },
    { 
      title: "Mã học sinh", 
      dataIndex: ["medicineRequest", "student", "studentCode"], 
      key: "studentCode",
      width: 120,
    },
    { 
      title: "Tên học sinh", 
      dataIndex: ["medicineRequest", "student", "fullName"], 
      key: "studentName",
      width: 180,
    },
    { 
      title: "Buổi", 
      dataIndex: "session", 
      key: "session",
      width: 80,
      render: (session) => (
        <Tag color={
          session === 'Sáng' ? 'orange' : 
          session === 'Trưa' ? 'green' : 'purple'
        }>
          {session}
        </Tag>
      ),
    },
    { 
      title: "Ghi chú thuốc", 
      dataIndex: "note", 
      key: "note",
      width: 200,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text || 'Không có ghi chú'}
        </span>
      ),
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Đã uống' : 'Chưa uống'}
        </Tag>
      ),
    },
    { 
      title: "Ngày tạo", 
      dataIndex: ["medicineRequest", "date"], 
      key: "date",
      width: 150,
      render: (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
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
            icon={<CheckOutlined />} 
            size="small" 
            type="primary"
            disabled={record.status}
            onClick={() => handleMarkAsTaken(record)}
            title={record.status ? 'Đã uống' : 'Đánh dấu đã uống'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full h-[90%] flex flex-col">
      {/* Header with Controls */}
      <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Danh sách phân phối thuốc</h3>
        
        <Space>
          <Select
            value={selectedSession}
            onChange={setSelectedSession}
            style={{ width: 150 }}
            placeholder="Chọn buổi"
          >
            {sessionOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => fetchSlots()}
            loading={loading}
            title="Làm mới dữ liệu"
          >
            Làm mới
          </Button>
          
          <Upload
            beforeUpload={beforeUpload}
            showUploadList={false}
            accept=".xlsx,.xls"
          >
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              loading={uploading}
            >
              {uploading ? 'Đang import...' : 'Import Excel'}
            </Button>
          </Upload>
        </Space>
      </div>

      {/* Statistics */}
      <div className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredSlots.length}
                </div>
                <div className="text-gray-500">Tổng số</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredSlots.filter(slot => slot.status).length}
                </div>
                <div className="text-gray-500">Đã uống</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredSlots.filter(slot => !slot.status).length}
                </div>
                <div className="text-gray-500">Chưa uống</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedSession}
                </div>
                <div className="text-gray-500">Buổi hiện tại</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <div className="flex-1">
        <Table
          columns={columns}
          dataSource={filteredSlots}
          rowKey="key"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} mục`
          }}
          bordered
          scroll={{ x: 1200 }}
          style={{ width: "100%", height: "100%" }}
          size="small"
          rowClassName={(record) => 
            record.status ? 'bg-green-50' : 'bg-red-50'
          }
        />
      </div>

      {/* Check Modal */}
      <Modal
        title="Xác nhận đã uống thuốc"
        open={checkModalVisible}
        onCancel={() => {
          setCheckModalVisible(false);
          setSelectedSlotForCheck(null);
          setCheckImage(null);
        }}
        onOk={() => handleCheckSlot(selectedSlotForCheck, checkImage)}
        okText="Xác nhận"
        cancelText="Hủy"
        width={600}
      >
        {selectedSlotForCheck && (
          <div>
            <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Học sinh">
                {selectedSlotForCheck.medicineRequest?.student?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Lớp">
                {selectedSlotForCheck.className}
              </Descriptions.Item>
              <Descriptions.Item label="Buổi">
                {selectedSlotForCheck.session}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú thuốc">
                {selectedSlotForCheck.note || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>
            
            <div>
              <h4 style={{ marginBottom: 8 }}>Tải lên hình ảnh xác nhận (tùy chọn):</h4>
              <Upload
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Bạn chỉ có thể tải lên file hình ảnh!');
                    return false;
                  }
                  
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('Hình ảnh phải nhỏ hơn 5MB!');
                    return false;
                  }
                  
                  setCheckImage(file);
                  return false;
                }}
                onRemove={() => setCheckImage(null)}
                fileList={checkImage ? [checkImage] : []}
                listType="picture-card"
                accept="image/*"
              >
                {!checkImage && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
              <p style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
                Hình ảnh xác nhận học sinh đã uống thuốc (không bắt buộc)
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết phân phối thuốc"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          !selectedRecord?.status && (
            <Button 
              key="mark-taken" 
              type="primary" 
              onClick={() => {
                handleMarkAsTaken(selectedRecord);
                setDetailModalVisible(false);
              }}
            >
              Đánh dấu đã uống
            </Button>
          )
        ].filter(Boolean)}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Lớp" span={1}>
              <Tag color="blue">{selectedRecord.className}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Buổi" span={1}>
              <Tag color={
                selectedRecord.session === 'Sáng' ? 'orange' : 
                selectedRecord.session === 'Trưa' ? 'green' : 'purple'
              }>
                {selectedRecord.session}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mã học sinh">
              {selectedRecord.medicineRequest?.student?.studentCode}
            </Descriptions.Item>
            <Descriptions.Item label="Tên học sinh">
              {selectedRecord.medicineRequest?.student?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {selectedRecord.medicineRequest?.student?.address || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú thuốc" span={2}>
              {selectedRecord.note || 'Không có ghi chú'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú yêu cầu" span={2}>
              {selectedRecord.medicineRequest?.note || 'Không có ghi chú'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thuốc">
              <Tag color={selectedRecord.status ? 'green' : 'red'}>
                {selectedRecord.status ? 'Đã uống' : 'Chưa uống'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái yêu cầu">
              <Tag color={
                selectedRecord.medicineRequest?.status === 'approved' ? 'green' : 
                selectedRecord.medicineRequest?.status === 'rejected' ? 'red' : 'orange'
              }>
                {selectedRecord.medicineRequest?.status || 'N/A'}
              </Tag>
            </Descriptions.Item>
            {selectedRecord.medicineRequest?.image && (
              <Descriptions.Item label="Hình ảnh đơn thuốc" span={2}>
                <Image
                  width={200}
                  src={selectedRecord.medicineRequest.image}
                  alt="Prescription"
                  style={{ borderRadius: '4px' }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MedicineDistribution;