import React from 'react';
import { Space, Table, Tag, Button, Image } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const MedicineDistribution = ({ medicineRequests, searchText }) => {
  // Filter medicine requests based on search text
  const filteredRequests = medicineRequests.filter(request => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      request.student?.fullName?.toLowerCase().includes(searchLower) ||
      request.student?.studentCode?.toLowerCase().includes(searchLower) 
    );
  });

  const columns = [
    { 
      title: "Request ID", 
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
      title: "Parent Name", 
      dataIndex: ["parent", "fullName"], 
      key: "parentName",
      width: 150,
    },
    { 
      title: "Parent Contact", 
      dataIndex: ["parent", "phone"], 
      key: "parentPhone",
      width: 120,
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
      title: "Note", 
      dataIndex: "note", 
      key: "note",
      width: 150,
      render: (text) => (
        <span className="line-clamp-2" title={text}>
          {text || 'No note'}
        </span>
      ),
    },
    { 
      title: "Prescription Image", 
      dataIndex: "image", 
      key: "image",
      width: 120,
      render: (imageUrl) => (
        imageUrl ? (
          <Image
            width={50}
            height={50}
            src={imageUrl}
            alt="Prescription"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FmuHH4SRMQqIkTUKiBE1CogRNQqIETUKiBE1CogRNwvIHlvjz+f99O3rGlv3/nOTVy+/n+x45XLt2/fz4Cxf8Av///y9YGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FmuHH4SRMQqIkTUKiBE1CogRNQqIETUKiBE1CogRNQqIETUKiBE1C"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )
      ),
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
      width: 150,
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
            icon={<CheckOutlined />} 
            size="small" 
            type="primary"
            style={{ backgroundColor: '#52c41a' }}
            onClick={() => handleApprove(record)}
            title="Approve Request"
          />
          <Button 
            icon={<CloseOutlined />} 
            size="small" 
            danger
            onClick={() => handleReject(record)}
            title="Reject Request"
          />
        </Space>
      ),
    },
  ];

  const handleViewDetail = (medicineRequest) => {
    console.log('View detail for medicine request:', medicineRequest);
    // Add your view detail logic here
    // You can show a modal with full prescription image and details
  };

  const handleApprove = (medicineRequest) => {
    console.log('Approve medicine request:', medicineRequest);
    // Add your approve logic here
    // You might want to call an API to update the status
  };

  const handleReject = (medicineRequest) => {
    console.log('Reject medicine request:', medicineRequest);
    // Add your reject logic here
    // You might want to call an API to update the status
  };

  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">

      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} requests`
        }}
        bordered
        scroll={{ x: 1400 }}
        style={{ width: "100%", height: "100%" }}
        size="small"
      />
      
    </div>
  );
};

export default MedicineDistribution;