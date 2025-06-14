import React from "react";
import { Modal, Space, Table, Tag, Descriptions, Card } from "antd";
import { HealthProfileService } from "../../../../services/HealthProfile/HealthProfileService";

const AllStudent = ({ students, searchText, filterType }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Filter students based on search text and filter type
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchText ||
      student.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.class?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.condition?.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilter =
      !filterType || filterType === "all" || student.class === filterType;

    return matchesSearch && matchesFilter;
  });

  const columns = [
    { title: "Student ID", dataIndex: "studentCode", key: "studentId" },
    { title: "Name", dataIndex: "fullName", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, { gender }) => (
        <Tag color={gender === "male" ? "green" : "red"}>
          {gender === "male" ? "Nam" : "Nữ"}
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record)}>View Detail</a>
        </Space>
      ),
    },
  ];

  const handleViewDetail = async (student) => {
    try {
      setLoading(true);
      const healthProfiles = await HealthProfileService.getStudentHealthProfileById(student.id);
      
      // Handle different response structures
      let profiles = [];
      if (Array.isArray(healthProfiles)) {
        profiles = healthProfiles;
      } else if (healthProfiles && Array.isArray(healthProfiles.data)) {
        profiles = healthProfiles.data;
      } else if (healthProfiles && healthProfiles.data) {
        profiles = [healthProfiles.data];
      }

      // Get the latest profile by date
      if (profiles && profiles.length > 0) {
        const latestProfile = profiles.reduce((latest, current) => {
          const latestDate = new Date(latest.date);
          const currentDate = new Date(current.date);
          return currentDate > latestDate ? current : latest;
        });
        
        setSelectedStudent(latestProfile);
      } else {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error fetching student health profile:", error);
      setSelectedStudent(null);
    } finally {
      setLoading(false);
    }
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">
      <div className="w-full mb-2">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
          {searchText && ` matching "${searchText}"`}
          {filterType && filterType !== 'all' && ` in class "${filterType}"`}
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey={(record, index) => record.studentCode || record.id || index}
        pagination={{
          pageSize: 4,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
        }}
        bordered
        scroll={{ x: "max-content" }}
        style={{ width: "100%", height: "100%" }}
      />

      <Modal
        title="Student Health Profile Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        loading={loading}
      >
        {selectedStudent ? (
          <div>
            <Card title="Student Information" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Student Code">
                  {selectedStudent.student?.studentCode}
                </Descriptions.Item>
                <Descriptions.Item label="Full Name">
                  {selectedStudent.student?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Class">
                  {selectedStudent.student?.class}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  <Tag color={selectedStudent.student?.gender === 'male' ? 'blue' : 'pink'}>
                    {selectedStudent.student?.gender === 'male' ? 'Nam' : 'Nữ'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {selectedStudent.student?.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Health Profile" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Profile Date">
                  <Tag color="blue">{formatDate(selectedStudent.date)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Blood Type">
                  <Tag color="red">{selectedStudent.bloodType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Weight">
                  {selectedStudent.weight} kg
                </Descriptions.Item>
                <Descriptions.Item label="Height">
                  {selectedStudent.height} cm
                </Descriptions.Item>
                <Descriptions.Item label="Vision Score">
                  <Tag color={selectedStudent.vision >= 8 ? 'green' : selectedStudent.vision >= 5 ? 'orange' : 'red'}>
                    {selectedStudent.vision}/10
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hearing Score">
                  <Tag color={selectedStudent.hearing >= 8 ? 'green' : selectedStudent.hearing >= 5 ? 'orange' : 'red'}>
                    {selectedStudent.hearing}/10
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Allergies" span={2}>
                  <Tag color="volcano">{selectedStudent.allergies || 'None'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Additional Notes" span={2}>
                  {selectedStudent.note || 'No additional notes'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Parent/Guardian Information">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Parent Name">
                  {selectedStudent.user?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedStudent.user?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                  {selectedStudent.user?.email}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {loading ? 'Loading health profile...' : 'No health profile found for this student.'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllStudent;
