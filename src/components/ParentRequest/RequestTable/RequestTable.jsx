import { Table, Button, Space, Input } from "antd";
import { SearchOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import RequestStatusTag from "../RequestStatusTag/RequestStatusTag";

const RequestTable = ({ 
  data, 
  title, 
  searchTerm, 
  onSearch, 
  onCreateClick, 
  onDetailClick,
  loading 
}) => {
  const columns = [
    { 
      title: "Student Code", 
      dataIndex: ["student", "studentCode"], 
      key: "studentCode",
      render: (text, record) => record.student?.studentCode || "N/A"
    },
    { 
      title: "Student Name", 
      dataIndex: ["student", "fullName"], 
      key: "fullName",
      render: (text, record) => record.student?.fullName || "N/A"
    },
    { 
      title: "Class", 
      dataIndex: ["student", "class"], 
      key: "class",
      filters: data.map(item => ({
        text: item.student?.class || "N/A",
        value: item.student?.class || "N/A"
      })),
      onFilter: (value, record) => record.student?.class === value,

      render: (text, record) => record.student?.class || "N/A"
    },
    { 
      title: "Parent Name", 
      dataIndex: ["parent", "fullName"], 
      key: "parentName",
      render: (text, record) => record.parent?.fullName || "N/A"
    },
    { 
      title: "Date", 
      dataIndex: "date", 
      key: "date",
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    { 
      title: "Note", 
      dataIndex: "note", 
      key: "note",
      ellipsis: true,
      render: (note) => note || 'Không có ghi chú'
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value,
      showSorter: (a, b) => a.status.localeCompare(b.status),
      sorter: (a, b) => a.status.localeCompare(b.status),
      
      render: (status) => <RequestStatusTag status={status} />
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => onDetailClick(record)}
            size="small"
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      title={() => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 0'
        }}>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold'
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Input
              placeholder="Tìm kiếm theo tên, mã học sinh, lớp, ghi chú..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: 350 }}
              allowClear
            />
            {/* <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onCreateClick}
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              Tạo yêu cầu
            </Button> */}
          </div>
        </div>
      )}
      rowKey="id"
      pagination={{ 
        pageSize: 5,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} kết quả`,
      }}
      bordered
      scroll={{ x: "max-content" }}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default RequestTable;