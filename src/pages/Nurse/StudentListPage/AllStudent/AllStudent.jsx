import Title from "antd/es/skeleton/Title";
import React from "react";
import { Space, Table, Tag } from "antd";
const AllStudent = ({ students }) => {
  const columns = [
    { title: "Student ID", dataIndex: "studentCode", key: "studentId" },
    { title: "Name", dataIndex: "fullName", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, { gender }) => (
        <Tag color={gender === 'male' ? "green" : "red"}>
          {gender === 'male' ? "Nam" : "Nu"}
        </Tag>
      ),
    },
    { title: "Condition", dataIndex: "condition", key: "condition" },
    { title: "Class", dataIndex: "class", key: "class" },
    
    {
      title: "Store Medicine",
      dataIndex: "isStoreMedicine",
      key: "isStoreMedicine",
      render: (_, { isStoreMedicine }) => (
        <Tag color={isStoreMedicine ? "green" : "red"}>
          {isStoreMedicine ? "YES" : "NO"}
        </Tag>
      ),
    },
    {
      title: "Injured",
      dataIndex: "isInjured",
      key: "isInjured",
      render: (_, { isInjured }) => (
        <Tag color={isInjured ? "red" : "green"}>
          {isInjured ? "YES" : "NO"}
        </Tag>
      ),
    },
     {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>View Detail</a>
      </Space>
    ),
  },
  ];
  
  return (
    <div className="w-full h-[90%]flex flex-wrap justify-center items-center">
      <Table
        columns={columns}
        dataSource={students}
        rowKey="studentId"
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: "max-content" }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default AllStudent;
