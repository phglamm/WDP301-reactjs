import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';

const MedicineTable = ({ slots, loading, onViewDetail, onMarkAsTaken }) => {
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
          {status ? 'Đã phát' : 'Chưa phát'}
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
            onClick={() => onViewDetail(record)}
            title="Xem chi tiết"
          />
          <Button 
            icon={<CheckOutlined />} 
            size="small" 
            type="primary"
            disabled={record.status}
            onClick={() => onMarkAsTaken(record)}
            title={record.status ? 'Đã phát' : 'Đánh dấu đã phát'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex-1">
      <Table
        columns={columns}
        dataSource={slots}
        rowKey="key"
        loading={loading}
        pagination={{ 
          pageSize: 4,
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
  );
};

export default MedicineTable;