import React, { useState } from "react";
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
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import AccidentService from "../../../../services/Nurse/AccidentService/AccidentService";
import medicineStorageService from "../../../../services/Nurse/MedicineStorage/MedicineStorage";

const { TextArea } = Input;
const { Option } = Select;

const AccidentCase = ({
  accidents,
  searchText,
  onAccidentReported,
  students,
  onRefresh,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [medicineModalVisible, setMedicineModalVisible] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([
    { medicineId: "", quantity: 1 },
  ]);
  const [form] = Form.useForm();
  const [medicineForm] = Form.useForm();
  // Filter accidents based on search text
  const filteredAccidents = accidents.filter((accident) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      accident.student?.fullName?.toLowerCase().includes(searchLower) ||
      accident.student?.studentCode?.toLowerCase().includes(searchLower)
    );
  });

  // Fetch medicines when component mounts
  React.useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineStorageService.getAllMedicineStorage();
      if (response?.data) {
        setMedicines(response.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      message.error("Không thể tải danh sách thuốc");
    }
  };
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
        const color =
          type === "Vật lý"
            ? "red"
            : type === "Tinh thần"
            ? "blue"
            : type === "Y tế"
            ? "green"
            : type === "Chấn thương"
            ? "volcano"
            : "default";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        return formattedDate;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          medical_room: { color: "blue", text: "Phòng Y Tế" },
          hospital: { color: "red", text: "Bệnh Viện" },
          parent_pickup: { color: "green", text: "Phụ Huynh Đón" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
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
          {text || "Không có"}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
            title="Xem Chi Tiết"
          />
        </Space>
      ),
    },
  ];
  const handleViewDetail = async (accident) => {
    try {
      console.log("View detail for accident:", accident);
      setLoading(true);
      setSelectedAccident(accident); // Set basic accident data first
      setModalVisible(true);

      // Fetch detailed accident information including medicines
      const response = await AccidentService.getAccidentById(accident.id);
      if (response && response.status && response.data) {
        setSelectedAccident(response.data);
      }
    } catch (error) {
      console.error("Error fetching accident details:", error);
      message.error("Có lỗi xảy ra khi tải chi tiết tai nạn");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Medicine Row
  const addMedicineRow = () => {
    setSelectedMedicines([
      ...selectedMedicines,
      { medicineId: "", quantity: 1 },
    ]);
  };

  // Handle Remove Medicine Row
  const removeMedicineRow = (index) => {
    if (selectedMedicines.length > 1) {
      const newMedicines = selectedMedicines.filter((_, i) => i !== index);
      setSelectedMedicines(newMedicines);
    }
  };

  // Handle Medicine Change
  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...selectedMedicines];
    newMedicines[index][field] = value;
    setSelectedMedicines(newMedicines);
  };

  // Handle Submit Medicine Assignment
  const handleSubmitMedicineAssignment = async () => {
    try {
      setLoading(true);

      // Validate that all medicines are selected and have quantities
      const validMedicines = selectedMedicines.filter(
        (med) => med.medicineId && med.quantity > 0
      );

      if (validMedicines.length === 0) {
        message.error("Vui lòng chọn ít nhất một loại thuốc");
        return;
      }

      const assignmentData = {
        accidentId: selectedAccident.id.toString(),
        medicines: validMedicines.map((med) => ({
          medicineId: med.medicineId.toString(),
          quantity: parseInt(med.quantity),
        })),
      };

      console.log("Assigning medicines:", assignmentData);

      const response = await medicineStorageService.setMedicineForAccident(
        assignmentData
      );

      if (response) {
        message.success("Thuốc đã được phân bổ thành công");
        setMedicineModalVisible(false);
        setSelectedMedicines([{ medicineId: "", quantity: 1 }]);
        medicineForm.resetFields();
        //reload accident details
        const updatedAccident = await AccidentService.getAccidentById(
          selectedAccident.id
        );
        setSelectedAccident(updatedAccident.data);

        // Callback to refresh accidents list if needed
        if (onAccidentReported) {
          onAccidentReported();
        }
      }
    } catch (error) {
      console.error("Error assigning medicines:", error);
      message.error("Có lỗi xảy ra khi phân bổ thuốc");
    } finally {
      setLoading(false);
    }
  };
  // Handle Report New Accident
  const handleReportAccident = () => {
    form.resetFields();
    setReportModalVisible(true);
  };

  // Handle Refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      message.success("Đã làm mới danh sách tai nạn");
    }
  };

  // Handle Submit Accident Report
  const handleSubmitReport = async (values) => {
    try {
      setLoading(true);
      const reportData = {
        studentCode: values.studentCode,
        summary: values.summary,
        type: values.type,
        status: values.status,
      };

      console.log("Submitting accident report:", reportData);

      const response = await AccidentService.createAccidentReport(reportData);
      if (response && response.status) {
        message.success("Báo cáo tai nạn đã được tạo thành công");
        setReportModalVisible(false);
        form.resetFields();
        onRefresh(); // Refresh the accidents list after reporting

        // Callback to refresh accidents list
        if (onAccidentReported) {
          onAccidentReported();
        }
      }
    } catch (error) {
      console.error("Error creating accident report:", error);
      message.error("Có lỗi xảy ra khi tạo báo cáo tai nạn");
    } finally {
      setLoading(false);
    }
  };

  // Handle Update Accident Status
  const handleUpdateAccidentStatus = async (accidentId, newStatus) => {
    try {
      setLoading(true);

      const response = await AccidentService.updateAccidentReport(
        accidentId,
        newStatus
      );

      if (response && response.status) {
        message.success("Trạng thái tai nạn đã được cập nhật thành công");

        // Refresh accident details
        const updatedAccident = await AccidentService.getAccidentById(
          accidentId
        );
        if (updatedAccident && updatedAccident.status && updatedAccident.data) {
          setSelectedAccident(updatedAccident.data);
        }

        // Refresh the accidents list
        if (onRefresh) {
          onRefresh();
        }

        // Callback to refresh accidents list
        if (onAccidentReported) {
          onAccidentReported();
        }
      }
    } catch (error) {
      console.error("Error updating accident status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái tai nạn");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      "Vật lý": "red",
      "Tinh thần": "blue",
      "Y tế": "green",
      "Chấn thương": "volcano",
    };
    return colors[type] || "default";
  };


  return (
    <div className="w-full h-[90%] flex flex-wrap justify-center items-center">
      {" "}
      {/* Header with Report Button */}
      <div className="w-full mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-1">Danh Sách Tai Nạn</h3>
          <p className="text-sm text-gray-600">
            Hiển thị {filteredAccidents.length} trong {accidents.length} tai nạn
            {searchText && ` phù hợp với "${searchText}"`}
          </p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size="large"
            title="Làm mới danh sách"
          >
            Làm Mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleReportAccident}
            size="large"
            danger
          >
            Báo Cáo Tai Nạn
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredAccidents}
        rowKey="id"
        pagination={{
          pageSize: 8,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong ${total} tai nạn`,
        }}
        bordered
        scroll={{ x: 1200 }}
        style={{ width: "100%", height: "100%" }}
        size="small"
      />
      {/* Report Accident Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserOutlined style={{ color: "#ff4d4f" }} />
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
        >
          {" "}
          <Form.Item
            name="studentCode"
            label="Mã Học Sinh"
            rules={[{ required: true, message: "Vui lòng chọn học sinh" }]}
          >
            <Select
              placeholder="Chọn học sinh"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
            >
              {students?.map((student) => (
                <Option key={student.studentCode} value={student.studentCode}>
                  {student.studentCode} - {student.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="summary"
            label="Tóm Tắt Tai Nạn"
            rules={[
              { required: true, message: "Vui lòng nhập tóm tắt tai nạn" },
            ]}
          >
            <TextArea
              rows={2}
              placeholder="chảy máu đầu"
              maxLength={200}
              showCount
            />
          </Form.Item>{" "}
          <Form.Item
            name="type"
            label="Loại Tai Nạn"
            rules={[{ required: true, message: "Vui lòng chọn loại tai nạn" }]}
          >
            <Select placeholder="Chọn loại tai nạn">
              <Option value="Chấn thương">Chấn thương</Option>
              <Option value="Vật lý">Vật lý</Option>
              <Option value="Tinh thần">Tinh thần</Option>
              <Option value="Y tế">Bệnh Tật</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng Thái Xử Lý"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái xử lý" },
            ]}
          >
            <Select placeholder="Chọn trạng thái xử lý">
              <Option value="medical_room">Phòng Y Tế</Option>
              <Option value="hospital">Bệnh Viện</Option>
              <Option value="parent_pickup">Phụ Huynh Đón</Option>
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setReportModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading} danger>
                Báo Cáo Tai Nạn
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>{" "}
      {/* Accident Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MedicineBoxOutlined style={{ color: "#ff4d4f" }} />
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
        ]}
        width={900}
        centered
        confirmLoading={loading}
      >
        {selectedAccident && (
          <div>
            {/* Student Information Card */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <UserOutlined style={{ color: "#1890ff" }} />
                  <span>Thông Tin Học Sinh</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Mã Học Sinh">
                  <Tag color="blue">
                    {selectedAccident.student?.studentCode}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Họ Và Tên">
                  <strong>{selectedAccident.student?.fullName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Lớp">
                  <Tag color="green">{selectedAccident.student?.class}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Giới Tính">
                  <Tag
                    color={
                      selectedAccident.student?.gender === "Nam"
                        ? "blue"
                        : "pink"
                    }
                  >
                    {selectedAccident.student?.gender}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh" span={2}>
                  {selectedAccident.student?.dob
                    ? selectedAccident.student.dob
                    : "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ" span={2}>
                  {selectedAccident.student?.address || "Không có"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {/* Accident Information Card */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FileTextOutlined style={{ color: "#ff4d4f" }} />
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CalendarOutlined />
                    {formatDate(selectedAccident.date)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  <Tag
                    color={getTypeColor(selectedAccident.type)}
                    style={{ fontSize: "12px" }}
                  >
                    {selectedAccident.type}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  <Tag
                    color={
                      selectedAccident.status === "Resolved"
                        ? "green"
                        : "orange"
                    }
                  >
                    {selectedAccident.status === "Resolved"
                      ? "Đã xử lý"
                      : "Đang xử lý"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* Status Update Section */}
              <Divider orientation="left" style={{ margin: "16px 0" }}>
                Cập Nhật Trạng Thái
              </Divider>
              <div
                style={{
                  backgroundColor: "#f0f9ff",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #91caff",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#0958d9" }}>
                    Thay đổi trạng thái xử lý:
                  </span>
                  <Space>
                    <Button
                      size="small"
                      type={
                        selectedAccident.status === "medical_room"
                          ? "primary"
                          : "default"
                      }
                      onClick={() =>
                        handleUpdateAccidentStatus(
                          selectedAccident.id,
                          "medical_room"
                        )
                      }
                      loading={loading}
                      style={{
                        backgroundColor:
                          selectedAccident.status === "medical_room"
                            ? "#1890ff"
                            : undefined,
                        borderColor: "#1890ff",
                        color:
                          selectedAccident.status === "medical_room"
                            ? "#fff"
                            : "#1890ff",
                      }}
                    >
                      Phòng Y Tế
                    </Button>
                    <Button
                      size="small"
                      type={
                        selectedAccident.status === "hospital"
                          ? "primary"
                          : "default"
                      }
                      onClick={() =>
                        handleUpdateAccidentStatus(
                          selectedAccident.id,
                          "hospital"
                        )
                      }
                      loading={loading}
                      danger={selectedAccident.status === "hospital"}
                      style={{
                        backgroundColor:
                          selectedAccident.status === "hospital"
                            ? "#ff4d4f"
                            : undefined,
                        borderColor: "#ff4d4f",
                        color:
                          selectedAccident.status === "hospital"
                            ? "#fff"
                            : "#ff4d4f",
                      }}
                    >
                      Bệnh Viện
                    </Button>
                    <Button
                      size="small"
                      type={
                        selectedAccident.status === "parent_pickup"
                          ? "primary"
                          : "default"
                      }
                      onClick={() =>
                        handleUpdateAccidentStatus(
                          selectedAccident.id,
                          "parent_pickup"
                        )
                      }
                      loading={loading}
                      style={{
                        backgroundColor:
                          selectedAccident.status === "parent_pickup"
                            ? "#52c41a"
                            : undefined,
                        borderColor: "#52c41a",
                        color:
                          selectedAccident.status === "parent_pickup"
                            ? "#fff"
                            : "#52c41a",
                      }}
                    >
                      Phụ Huynh Đón
                    </Button>
                  </Space>
                </div>
                <div
                  style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}
                >
                  <strong>Trạng thái hiện tại:</strong>{" "}
                  {(() => {
                    const statusConfig = {
                      medical_room: "Phòng Y Tế",
                      hospital: "Bệnh Viện",
                      parent_pickup: "Phụ Huynh Đón",
                    };
                    return (
                      statusConfig[selectedAccident.status] ||
                      selectedAccident.status
                    );
                  })()}
                </div>
              </div>

              <Divider orientation="left" style={{ margin: "16px 0" }}>
                Tóm Tắt
              </Divider>
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <p style={{ margin: 0, lineHeight: "1.6" }}>
                  {selectedAccident.summary || "Không có tóm tắt"}
                </p>
              </div>

              {selectedAccident.description && (
                <>
                  <Divider orientation="left" style={{ margin: "16px 0" }}>
                    Mô Tả Chi Tiết
                  </Divider>
                  <div
                    style={{
                      backgroundColor: "#fff2e8",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #ffb366",
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: "1.6" }}>
                      {selectedAccident.description}
                    </p>
                  </div>
                </>
              )}
            </Card>
            {/* Nurse Information Card */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MedicineBoxOutlined style={{ color: "#52c41a" }} />
                  <span>Y Tá Phụ Trách</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Tên Y Tá">
                  <strong>
                    {selectedAccident.nurse?.fullName || "Không có"}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="Mã Nhân Viên">
                  {selectedAccident.nurse?.id || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedAccident.nurse?.email || "Phòng Y Tế Trường"}
                </Descriptions.Item>
                <Descriptions.Item label="Liên Hệ">
                  {selectedAccident.nurse?.phone ||
                    selectedAccident.nurse?.email ||
                    "Không có"}
                </Descriptions.Item>
              </Descriptions>
            </Card>{" "}
            {/* Medicine Information Card */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MedicineBoxOutlined style={{ color: "#722ed1" }} />
                  <span>Thuốc Đã Phân Bổ</span>
                </div>
              }
              size="small"
            >
              {/* Assigned Medicines Display */}
              {selectedAccident.accidentMedicines &&
                selectedAccident.accidentMedicines.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#722ed1" }}>
                      Thuốc đã phân bổ:
                    </h4>
                    {selectedAccident.accidentMedicines.map(
                      (accidentMedicine, index) => (
                        <Card
                          key={index}
                          size="small"
                          style={{
                            marginBottom:
                              index ===
                              selectedAccident.accidentMedicines.length - 1
                                ? 0
                                : 12,
                            backgroundColor: "#f8f4ff",
                            border: "1px solid #d3adf7",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "8px",
                                }}
                              >
                                <Tag
                                  color="purple"
                                  style={{ fontSize: "12px" }}
                                >
                                  {accidentMedicine.medicine?.name}
                                </Tag>
                                <Tag color="blue" style={{ fontSize: "11px" }}>
                                  {accidentMedicine.medicine?.type}
                                </Tag>
                              </div>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                <strong>Nhà sản xuất:</strong>{" "}
                                {accidentMedicine.medicine?.manufacturer ||
                                  "Không có"}
                              </div>
                              {accidentMedicine.medicine?.description && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginTop: "4px",
                                  }}
                                >
                                  <strong>Mô tả:</strong>{" "}
                                  {accidentMedicine.medicine.description}
                                </div>
                              )}
                            </div>
                            <div
                              style={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  color: "#722ed1",
                                }}
                              >
                                {accidentMedicine.quantity}
                              </div>
                              <div style={{ fontSize: "11px", color: "#666" }}>
                                {accidentMedicine.medicine?.type || "viên"}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                    <div
                      style={{
                        marginTop: 12,
                        padding: "8px 12px",
                        backgroundColor: "#f0f9ff",
                        border: "1px solid #91caff",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#0958d9",
                      }}
                    >
                      <strong>Tổng số loại thuốc:</strong>{" "}
                      {selectedAccident.accidentMedicines.length} loại
                    </div>
                  </div>
                )}

              {/* Medicine Assignment Section */}
              <div>
                <h4 style={{ margin: "16px 0 12px 0", color: "#52c41a" }}>
                  Phân bổ thuốc mới:
                </h4>
                {selectedMedicines.map((medicine, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: 12,
                      padding: "12px",
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ flex: 2 }}>
                      <Select
                        placeholder="Chọn thuốc"
                        style={{ width: "100%" }}
                        value={medicine.medicineId}
                        onChange={(value) =>
                          handleMedicineChange(index, "medicineId", value)
                        }
                        showSearch
                        filterOption={(input, option) =>
                          option?.children
                            ?.toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {medicines.map((med) => (
                          <Option key={med.id} value={med.id}>
                            {med.name} - {med.type} ({med.availableQuantity} có
                            sẵn)
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="number"
                        placeholder="Số lượng"
                        min={1}
                        value={medicine.quantity}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        addonBefore="Số lượng"
                      />
                    </div>
                    <Space>
                      {selectedMedicines.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeMedicineRow(index)}
                          title="Xóa"
                        />
                      )}
                      {index === selectedMedicines.length - 1 && (
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={addMedicineRow}
                          size="small"
                          title="Thêm thuốc"
                        />
                      )}
                    </Space>
                  </div>
                ))}

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  <Button
                    type="primary"
                    icon={<MedicineBoxOutlined />}
                    loading={loading}
                    onClick={handleSubmitMedicineAssignment}
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                    disabled={
                      !selectedMedicines.some(
                        (med) => med.medicineId && med.quantity > 0
                      )
                    }
                  >
                    Phân Bổ Thuốc
                  </Button>
                </div>
              </div>

              {/* Empty State when no medicines assigned */}
              {(!selectedAccident.accidentMedicines ||
                selectedAccident.accidentMedicines.length === 0) && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                    backgroundColor: "#fafafa",
                    borderRadius: "6px",
                    border: "1px dashed #d9d9d9",
                    marginBottom: 16,
                  }}
                >
                  <MedicineBoxOutlined
                    style={{ fontSize: "24px", marginBottom: "8px" }}
                  />
                  <div>Chưa có thuốc nào được phân bổ</div>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
      {/* Medicine Assignment Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MedicineBoxOutlined style={{ color: "#52c41a" }} />
            <span>Phân Bổ Thuốc - {selectedAccident?.student?.fullName}</span>
          </div>
        }
        visible={medicineModalVisible}
        onCancel={() => {
          setMedicineModalVisible(false);
          setSelectedMedicines([{ medicineId: "", quantity: 1 }]);
          medicineForm.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setMedicineModalVisible(false);
              setSelectedMedicines([{ medicineId: "", quantity: 1 }]);
              medicineForm.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<MedicineBoxOutlined />}
            loading={loading}
            onClick={handleSubmitMedicineAssignment}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Phân Bổ Thuốc
          </Button>,
        ]}
        width={800}
        centered
      >
        {selectedAccident && (
          <div>
            {/* Accident Summary */}
            <Card
              size="small"
              style={{ marginBottom: 16, backgroundColor: "#f6ffed" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Tai nạn #{selectedAccident.id}</strong> -{" "}
                  {selectedAccident.type}
                </div>
                <Tag color={getTypeColor(selectedAccident.type)}>
                  {selectedAccident.type}
                </Tag>
              </div>
              <div style={{ marginTop: 8, color: "#666" }}>
                {selectedAccident.summary}
              </div>
            </Card>

            {/* Medicine Selection */}
            <Card
              title="Chọn Thuốc và Số Lượng"
              size="small"
              extra={
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addMedicineRow}
                  size="small"
                >
                  Thêm Thuốc
                </Button>
              }
            >
              {selectedMedicines.map((medicine, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom:
                      index === selectedMedicines.length - 1 ? 0 : 12,
                    padding: "12px",
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ flex: 2 }}>
                    <Select
                      placeholder="Chọn thuốc"
                      style={{ width: "100%" }}
                      value={medicine.medicineId}
                      onChange={(value) =>
                        handleMedicineChange(index, "medicineId", value)
                      }
                      showSearch
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {medicines.map((med) => (
                        <Option key={med.id} value={med.id}>
                          {med.name} - {med.type} ({med.availableQuantity} có
                          sẵn)
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Số lượng"
                      min={1}
                      value={medicine.quantity}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      addonBefore="Số Lượng"
                    />
                  </div>
                  {selectedMedicines.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeMedicineRow(index)}
                      title="Xóa"
                    />
                  )}
                </div>
              ))}

              {selectedMedicines.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                  }}
                >
                  Chưa có thuốc nào được chọn
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccidentCase;
