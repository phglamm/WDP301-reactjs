import React from 'react';
import { Space, Table, Tag, Button } from "antd";
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

const AccidentCase = ({ accidents, searchText }) => {
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
      title: "Accident ID", 
      dataIndex: "id", 
      key: "id",
      width: 100,
    },
    { 
      title: "Student Code", 
      dataIndex: ["student", "studentCode"], 
      key: "studentCode",
      width: 120,
    },
    { 
      title: "Student Name", 
      dataIndex: ["student", "fullName"], 
      key: "studentName",
      width: 150,
    },
    { 
      title: "Summary", 
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
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      width: 100,
      render: (type) => {
        const color = type === 'Vật lý' ? 'red' : 
                     type === 'Tinh thần' ? 'blue' : 
                     type === 'Y tế' ? 'green' : 'default';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    { 
      title: "Date", 
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
      title: "Nurse", 
      dataIndex: ["nurse", "fullName"], 
      key: "nurseName",
      width: 150,
    },
    { 
      title: "Student Address", 
      dataIndex: ["student", "address"], 
      key: "studentAddress",
      width: 200,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewDetail(record)}
            title="View Details"
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            onClick={() => handleEdit(record)}
            title="Edit Record"
          />
        </Space>
      ),
    },
  ];

  const handleViewDetail = (accident) => {
    console.log('View detail for accident:', accident);
    // Add your view detail logic here
    // You can show a modal or navigate to detail page
  };

  const handleEdit = (accident) => {
    console.log('Edit accident:', accident);
    // Add your edit logic here
  };

  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">
      <Table
        columns={columns}
        dataSource={filteredAccidents}
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} accidents`
        }}
        bordered
        scroll={{ x: 1200 }}
        style={{ width: "100%", height: "100%" }}
        size="small"
      />
    </div>
  );
};

export default AccidentCase;