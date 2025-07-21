import React from "react";
import {
  Modal,
  Space,
  Table,
  Tag,
  Descriptions,
  Card,
  List,
  Progress,
} from "antd";
import { HealthProfileService } from "../../../../services/Nurse/HealthProfile/HealthProfileService";
import VaccinationService from "../../../../services/Nurse/VaccinationService/VaccinationService";

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
    { title: "ID.", dataIndex: "id", key: "id" },
    { title: "Student ID", dataIndex: "studentCode", key: "studentId" },
    { title: "Name", dataIndex: "fullName", key: "name" },
    { title: "DOB", dataIndex: "dob", key: "dob" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, { gender }) => (
        <Tag color={gender === "Nam" ? "green" : "red"}>
          {gender === "Nam" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    { title: "Class", dataIndex: "class", key: "class" },
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

      // Fetch both health profile and vaccination history concurrently
      const [healthProfiles, vaccinationResponse] = await Promise.all([
        HealthProfileService.getStudentHealthProfileById(student.id),
        VaccinationService.getVaccinationByStudentId(student.id).catch(
          (error) => {
            console.error("Error fetching vaccination history:", error);
            return { status: false, data: [] };
          }
        ),
      ]);

      // Handle health profile response structures
      let profiles = [];
      if (Array.isArray(healthProfiles)) {
        profiles = healthProfiles;
      } else if (healthProfiles && Array.isArray(healthProfiles.data)) {
        profiles = healthProfiles.data;
      } else if (healthProfiles && healthProfiles.data) {
        profiles = [healthProfiles.data];
      }

      // Handle vaccination history response
      let vaccinationHistory = [];
      if (
        vaccinationResponse &&
        vaccinationResponse.status &&
        vaccinationResponse.data
      ) {
        vaccinationHistory = vaccinationResponse.data;
      }

      // Get the latest profile by date and combine with vaccination history
      if (profiles && profiles.length > 0) {
        const latestProfile = profiles.reduce((latest, current) => {
          const latestDate = new Date(latest.date);
          const currentDate = new Date(current.date);
          return currentDate > latestDate ? current : latest;
        });

        // Combine the latest profile with vaccination history
        const combinedProfile = {
          ...latestProfile,
          vaccinationHistory: vaccinationHistory,
        };

        console.log("Combined Profile:", combinedProfile);
        setSelectedStudent(combinedProfile);
      } else {
        // If no health profile exists, create a basic profile with just vaccination history
        setSelectedStudent({
          student: student, // Use the student data passed to the function
          vaccinationHistory: vaccinationHistory,
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setSelectedStudent(null);
    } finally {
      setLoading(false);
    }
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate vaccination progress percentage
  const calculateVaccinationProgress = (doses, numberOfDoses) => {
    return Math.round((doses / numberOfDoses) * 100);
  };

  // Get progress status color
  const getProgressStatus = (percentage) => {
    if (percentage === 100) return "success";
    if (percentage >= 50) return "active";
    return "exception";
  };

  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">
      <div className="w-full mb-2">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
          {searchText && ` matching "${searchText}"`}
          {filterType && filterType !== "all" && ` in class "${filterType}"`}
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
        onCancel={() => {
          setModalVisible(false);
          setSelectedStudent(null);
        }}
        footer={null}
        width={1000}
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
                  <Tag
                    color={
                      selectedStudent.student?.gender === "Nam"
                        ? "blue"
                        : "pink"
                    }
                  >
                    {selectedStudent.student?.gender === "Nam" ? "Nam" : "Nữ"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {selectedStudent.student?.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Parent/Guardian Information Card - Always show */}
            <Card title="Parent/Guardian Information" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Parent Name">
                  {selectedStudent.user?.fullName ||
                    selectedStudent.student?.parentName ||
                    "Not available"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedStudent.user?.phone ||
                    selectedStudent.student?.parentPhone ||
                    "Not available"}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                  {selectedStudent.user?.email ||
                    selectedStudent.student?.parentEmail ||
                    "Not available"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Only show Health Profile card if health data exists */}
            {selectedStudent.date && (
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
                    <Tag
                      color={
                        selectedStudent.vision >= 8
                          ? "green"
                          : selectedStudent.vision >= 5
                          ? "orange"
                          : "red"
                      }
                    >
                      {selectedStudent.vision}/10
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Hearing Score">
                    <Tag
                      color={
                        selectedStudent.hearing >= 8
                          ? "green"
                          : selectedStudent.hearing >= 5
                          ? "orange"
                          : "red"
                      }
                    >
                      {selectedStudent.hearing}/10
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Allergies" span={2}>
                    <Tag color="volcano">
                      {selectedStudent.allergies || "None"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Additional Notes" span={2}>
                    {selectedStudent.note || "No additional notes"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Vaccination History Card - now using combined data */}
            <Card title="Vaccination History" style={{ marginBottom: 16 }}>
              {selectedStudent.vaccinationHistory &&
              selectedStudent.vaccinationHistory.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={selectedStudent.vaccinationHistory}
                  renderItem={(vaccination) => {
                    const progress = calculateVaccinationProgress(
                      vaccination.doses,
                      vaccination.vaccination.numberOfDoses
                    );
                    const status = getProgressStatus(progress);

                    return (
                      <List.Item key={vaccination.id}>
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <h4 style={{ margin: 0, color: "#1890ff" }}>
                                {vaccination.vaccination.name}
                              </h4>
                              <p
                                style={{
                                  margin: 0,
                                  color: "#666",
                                  fontSize: "12px",
                                }}
                              >
                                {vaccination.vaccination.description}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <Tag
                                color={
                                  vaccination.vaccination.type === "free"
                                    ? "green"
                                    : "blue"
                                }
                              >
                                {vaccination.vaccination.type === "free"
                                  ? "Miễn phí"
                                  : "Có phí"}
                              </Tag>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: 4,
                                }}
                              >
                                <span
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  Tiến độ tiêm:
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {vaccination.doses}/
                                  {vaccination.vaccination.numberOfDoses} liều
                                </span>
                              </div>
                              <Progress
                                percent={progress}
                                status={status}
                                size="small"
                                strokeColor={
                                  progress === 100
                                    ? "#52c41a"
                                    : progress >= 50
                                    ? "#1890ff"
                                    : "#ff4d4f"
                                }
                              />
                            </div>
                            <div>
                              <Tag
                                color={
                                  progress === 100
                                    ? "success"
                                    : progress >= 50
                                    ? "processing"
                                    : "warning"
                                }
                              >
                                {progress === 100
                                  ? "Hoàn thành"
                                  : progress >= 50
                                  ? "Đang tiêm"
                                  : "Chưa hoàn thành"}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {loading
                      ? "Loading vaccination history..."
                      : "No vaccination history found for this student."}
                  </p>
                </div>
              )}
            </Card>

            {/* Only show Parent/Guardian card if user data exists */}
            {selectedStudent.user && (
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
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {loading
                ? "Loading student data..."
                : "No data found for this student."}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllStudent;
