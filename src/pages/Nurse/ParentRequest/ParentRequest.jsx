import { Space, Table, Tag } from "antd";
import CardData from "../../../components/CardData/CardData";
import { students } from "../Data/Data";
import { useState } from "react";

const ParentRequest = () => {
  const [selectedCardTitle, setSelectedCardTitle] = useState("Tất cả yêu cầu");

  const columns = [
    { title: "Student ID", dataIndex: "studentId", key: "studentId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
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
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>View Detail</a>
        </Space>
      ),
    },
  ];

  const generalReport = [
    {
      title: "Yêu cầu đang xử lý",
      value: 120,
      subtitle: "trong hôm nay",
    },
    {
      title: "Yêu cầu đã xử lý",
      value: 80,
      subtitle: "trong hôm nay",
    },
    {
      title: "Yêu cầu chưa xử lý",
      value: 40,
      subtitle: "trong hôm nay",
    },
    {
      title: "Lịch khám",
      value: 500,
      subtitle: "trong trường",
    },
  ];

  const handleCardClick = (title) => {
    setSelectedCardTitle(title);
  };

return (
    <div className="w-full h-full pt-[2%]">
        <div className="w-full flex flex-wrap justify-between items-center mb-4">
            {generalReport.map((item, index) => (
                <CardData
                    key={index}
                    title={item.title}
                    value={item.value}
                    subTitle={item.subtitle}
                    onClick={() => handleCardClick(item.title)}
                />
            ))}

            <div className="w-full flex flex-wrap justify-center items-center">

                <Table
                    columns={columns}
                    dataSource={students}
                    title={() => (
                        <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            padding: '8px 0'
                        }}>
                            {selectedCardTitle}
                        </div>
                    )}
                    rowKey="studentId"
                    pagination={{ pageSize: 5 }}
                    bordered
                    scroll={{ x: "max-content" }}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    </div>
);
};

export default ParentRequest;
