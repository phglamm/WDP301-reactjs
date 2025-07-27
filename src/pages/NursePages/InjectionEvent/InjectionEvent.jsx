import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tag,
  Space,
  Card,
  Row,
  Col,
  Descriptions,
  InputNumber,
  Upload,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import injectionEventService from "../../../services/Nurse/InjectionEvent/InjectionEvent";
import CardData from "../../../components/CardData/CardData";
import moment from "moment";
import VaccinationService from "../../../services/Nurse/VaccinationService/VaccinationService";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

const InjectionEvent = () => {
  const [injectionEvents, setInjectionEvents] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState({}); // Change to object
  const [uploadLoading, setUploadLoading] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [postInjectionModalVisible, setPostInjectionModalVisible] =
    useState(false);  const [postInjectionDetailModalVisible, setPostInjectionDetailModalVisible] =
    useState(false);
  const [injectionRecordDetailModalVisible, setInjectionRecordDetailModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [postInjectionRecords, setPostInjectionRecords] = useState([]);
  const [selectedPostInjectionRecord, setSelectedPostInjectionRecord] =
    useState(null);
  const [selectedInjectionRecordReports, setSelectedInjectionRecordReports] = useState(null);
  const [postInjectionLoading, setPostInjectionLoading] = useState(false);
  const [injectionRecordLoading, setInjectionRecordLoading] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCard, setSelectedCard] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedVaccineType, setSelectedVaccineType] = useState(null);
  const [form] = Form.useForm();
  const [vaccineForm] = Form.useForm();
  const user = useSelector(selectUser);

  // Fetch injection events
  const fetchInjectionEvents = async () => {
    try {
      setLoading(true);
      const response = await injectionEventService.getAllInjectionEvents();
      if (response.status && response.data) {
        setInjectionEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching injection events:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu sự kiện tiêm chủng!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vaccinations for dropdown
  const fetchVaccinations = async () => {
    try {
      const response = await VaccinationService.getAllVaccinations();
      if (response.status && response.data) {
        setVaccinations(response.data);
      }
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
    }
  };

  // Download registered students list
  const handleDownloadStudents = async (event) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [event.id]: true }));
      message.loading({
        content: "Đang tải danh sách học sinh...",
        key: `download-${event.id}`,
      });

      const blob =
        await injectionEventService.downloadStudentRegisteredInjectionEvent(
          event.id
        );

      console.log("Blob received:", blob);
      console.log("Blob size:", blob.size);
      console.log("Blob type:", blob.type);

      // Check if blob is valid
      if (!blob || blob.size === 0) {
        throw new Error("Empty file received");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const eventName =
        event.vaccination?.name
          ?.replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, "_") || "vaccination_event";
      const eventDate = moment(event.date).format("YYYY-MM-DD");
      const timestamp = moment().format("HHmmss");

      link.download = `${eventName}_Event_${event.id}_${eventDate}_${timestamp}.xlsx`;

      // Set download attributes
      link.setAttribute("download", link.download);
      link.style.display = "none";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);

      message.success({
        content: "Tải xuống thành công!",
        key: `download-${event.id}`,
      });
    } catch (error) {
      console.error("Error downloading students list:", error);
      message.error({
        content: `Có lỗi xảy ra khi tải danh sách học sinh: ${error.message}`,
        key: `download-${event.id}`,
      });
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [event.id]: false }));
    }
  };

  // Handle upload result
  const handleUploadResult = (event) => {
    setSelectedEvent(event);
    setUploadFileList([]);
    setUploadModalVisible(true);
  };
  // Handle file upload for result
  const handleUploadResultFile = async () => {
    if (!uploadFileList.length) {
      message.error("Vui lòng chọn file Excel");
      return;
    }

    try {
      setUploadLoading((prev) => ({ ...prev, [selectedEvent.id]: true }));

      const formData = new FormData();
      // Make sure we're using the actual file object, not just the file info
      const file = uploadFileList[0].originFileObj || uploadFileList[0];
      formData.append("file", file);

      console.log(
        "Uploading file:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );

      const response = await injectionEventService.importInjectionEventResult(
        selectedEvent.id,
        formData
      );

      if (response.status) {
        message.success("Upload kết quả thành công!");
        setUploadModalVisible(false);
        setUploadFileList([]);
        fetchInjectionEvents();
      } else {
        message.error(response.message || "Có lỗi xảy ra khi upload kết quả!");
      }
    } catch (error) {
      console.error("Error uploading result:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi upload kết quả!";
      message.error(errorMessage);
    } finally {
      setUploadLoading((prev) => ({ ...prev, [selectedEvent.id]: false }));
    }
  };

  // Upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("Chỉ có thể upload file Excel (.xlsx, .xls)!");
        return false;
      }
      setUploadFileList([file]);
      return false;
    },
    fileList: uploadFileList,
    onRemove: () => setUploadFileList([]),
  };

  useEffect(() => {
    fetchInjectionEvents();
    fetchVaccinations();
  }, []);

  // Filter events based on search and selected card
  const filteredEvents = injectionEvents.filter((event) => {
    let matchesSearch = true;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      matchesSearch =
        event.vaccination?.name?.toLowerCase().includes(searchLower) ||
        event.vaccination?.description?.toLowerCase().includes(searchLower) ||
        event.vaccination?.type?.toLowerCase().includes(searchLower);
    }

    let matchesCard = true;
    if (selectedCard === "free") {
      matchesCard = event.vaccination?.type === "free";
    } else if (selectedCard === "paid") {
      matchesCard = event.vaccination?.type === "paid";
    }

    return matchesSearch && matchesCard;
  });

  // Calculate statistics
  const totalEvents = injectionEvents.length;
  const freeEvents = injectionEvents.filter(
    (event) => event.vaccination?.type === "free"
  ).length;
  const paidEvents = injectionEvents.filter(
    (event) => event.vaccination?.type === "paid"
  ).length;

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };
  const handleSubmit = async (values) => {
    try {
      const formData = {
        vaccinationId: values.vaccinationId.toString(),
        registrationOpenDate: values.registrationOpenDate.toISOString(),
        registrationCloseDate: values.registrationCloseDate.toISOString(),
        date: values.date.toISOString(),
        price: values.price || 0,
        grade: values.grade,
      };

      const response = await injectionEventService.createInjectionEvent(
        formData
      );
      if (response.status) {
        message.success("Tạo sự kiện tiêm chủng thành công!");
        setModalVisible(false);
        form.resetFields();
        setSelectedGrade(1);
        setSelectedVaccineType(null);
        fetchInjectionEvents();
      } else {
        message.error("Có lỗi xảy ra khi tạo sự kiện!");
      }
    } catch (error) {
      console.error("Error creating injection event:", error);
      message.error("Có lỗi xảy ra khi tạo sự kiện tiêm chủng!");
    }
  };

  // Handle view post injection reports
  const handleViewPostInjection = async (event) => {
    try {
      setPostInjectionLoading(true);
      setSelectedEvent(event);
      setPostInjectionModalVisible(true);

      const response = await injectionEventService.getAllPostInjectionRecords(
        event.id
      );
      if (response.status && response.data) {
        setPostInjectionRecords(response.data);
      }
    } catch (error) {
      console.error("Error fetching post injection records:", error);
      message.error("Có lỗi xảy ra khi tải báo cáo sau tiêm!");
    } finally {
      setPostInjectionLoading(false);
    }
  };
  // Handle view post injection record detail
  const handleViewPostInjectionDetail = (record) => {
    setSelectedPostInjectionRecord(record);
    setPostInjectionDetailModalVisible(true);
  };

  // Handle view injection record reports by injection record ID
  const handleViewInjectionRecordReports = async (injectionRecordId) => {
    try {
      setInjectionRecordLoading(true);
      setInjectionRecordDetailModalVisible(true);
      
      const response = await injectionEventService.getPostInjectionRecordById(injectionRecordId);
      
      if (response && response.status) {
        setSelectedInjectionRecordReports(response.data);
      } else {
        message.error('Không thể tải thông tin báo cáo tiêm chủng');
        setSelectedInjectionRecordReports([]);
      }
    } catch (error) {
      console.error('Error fetching injection record reports:', error);
      message.error('Có lỗi xảy ra khi tải thông tin báo cáo tiêm chủng');
      setSelectedInjectionRecordReports([]);
    } finally {
      setInjectionRecordLoading(false);
    }
  };

  const handleViewDetail = (event) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  // Handle vaccine creation
  const handleVaccineSubmit = async (values) => {
    try {
      const vaccineData = {
        name: values.name,
        description: values.description,
        type: values.type,
        numberOfDoses: values.numberOfDoses,
      };

      const response = await VaccinationService.createVaccine(vaccineData);

      if (response.status) {
        message.success("Tạo vaccine thành công!");
        setVaccineModalVisible(false);
        vaccineForm.resetFields();
        fetchVaccinations(); // Refresh vaccine list
      } else {
        message.error("Có lỗi xảy ra khi tạo vaccine!");
      }
    } catch (error) {
      console.error("Error creating vaccine:", error);
      message.error("Có lỗi xảy ra khi tạo vaccine!");
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchInjectionEvents();
    fetchVaccinations();
    message.success("Đã làm mới danh sách sự kiện tiêm chủng");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên vaccine",
      dataIndex: ["vaccination", "name"],
      key: "vaccinationName",
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Loại",
      dataIndex: ["vaccination", "type"],
      key: "vaccinationType",
      width: 100,
      render: (type) => (
        <Tag color={type === "free" ? "green" : "blue"}>
          {type === "free" ? "Miễn phí" : "Có phí"}
        </Tag>
      ),
    },
    {
      title: "Số liều",
      dataIndex: ["vaccination", "numberOfDoses"],
      key: "numberOfDoses",
      width: 100,
      render: (doses) => <Tag color="purple">{doses} liều</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <span
          className={
            price === 0
              ? "text-green-600 font-medium"
              : "text-blue-600 font-medium"
          }
        >
          {price === 0 ? "Miễn phí" : `${price.toLocaleString()} VNĐ`}
        </span>
      ),
    },
    {
      title: "Khối lớp",
      dataIndex: "grade",
      key: "grade",
      width: 100,
      render: (grade) => <Tag color="cyan">Lớp {grade}</Tag>,
    },
    {
      title: "Ngày mở đăng ký",
      dataIndex: "registrationOpenDate",
      key: "registrationOpenDate",
      width: 180,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày đóng đăng ký",
      dataIndex: "registrationCloseDate",
      key: "registrationCloseDate",
      width: 180,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày tiêm",
      dataIndex: "date",
      key: "date",
      width: 180,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => {
        const now = moment();
        const regOpen = moment(record.registrationOpenDate);
        const regClose = moment(record.registrationCloseDate);
        const eventDate = moment(record.date);

        if (now.isBefore(regOpen)) {
          return <Tag color="orange">Chưa mở đăng ký</Tag>;
        } else if (now.isBetween(regOpen, regClose)) {
          return <Tag color="green">Đang mở đăng ký</Tag>;
        } else if (now.isAfter(regClose) && now.isBefore(eventDate)) {
          return <Tag color="blue">Đã đóng đăng ký</Tag>;
        } else {
          return <Tag color="gray">Đã hoàn thành</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          />
          <Button
            icon={<DownloadOutlined />}
            size="small"
            type="primary"
            onClick={() => handleDownloadStudents(record)}
            loading={downloadLoading[record.id] || false} // Use event-specific loading
            title="Tải danh sách học sinh"
          />
          <Button
            icon={<UploadOutlined />}
            size="small"
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "white",
            }}
            onClick={() => handleUploadResult(record)}
            title="Upload kết quả"
          />
          <Button
            icon={<FileTextOutlined />}
            size="small"
            style={{
              backgroundColor: "#722ed1",
              borderColor: "#722ed1",
              color: "white",
            }}
            onClick={() => handleViewPostInjection(record)}
            title="Xem báo cáo sau tiêm"
          />
        </Space>
      ),
    },
  ];

  const generalReport = [
    {
      title: "Tổng số sự kiện",
      value: totalEvents,
      subtitle: "sự kiện tiêm chủng",
      filterType: "all",
    },
    {
      title: "Sự kiện miễn phí",
      value: freeEvents,
      subtitle: "không tính phí",
      filterType: "free",
    },
    {
      title: "Sự kiện có phí",
      value: paidEvents,
      subtitle: "tính phí",
      filterType: "paid",
    },
  ];

  return (
    <div className="w-full h-full pt-[1%]">
      {/* Statistics Cards */}
      <div className="w-full flex flex-wrap justify-center gap-10 items-center mb-4">
        {generalReport.map((item, index) => (
          <CardData
            onClick={() => handleCardClick(item.filterType)}
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
          />
        ))}
      </div>
      {/* Filter Status */}
      {selectedCard !== "all" && (
        <div className="mb-4">
          <Tag
            color="blue"
            closable
            onClose={() => setSelectedCard("all")}
            style={{ fontSize: "14px", padding: "4px 8px" }}
          >
            Lọc:{" "}
            {selectedCard === "free"
              ? "Sự kiện miễn phí"
              : selectedCard === "paid"
              ? "Sự kiện có phí"
              : "Tất cả"}
          </Tag>
        </div>
      )}{" "}
      {/* Header with Search and Add Button */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quản lý sự kiện tiêm chủng</h3>
        <Space>
          <Search
            placeholder="Tìm kiếm sự kiện tiêm chủng..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />{" "}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            title="Làm mới danh sách"
          >
            Làm Mới
          </Button>
          {user.role === "admin" && (
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setVaccineModalVisible(true)}
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                color: "white",
              }}
            >
              Thêm vaccine
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Tạo sự kiện mới
          </Button>
        </Space>
      </div>
      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredEvents}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sự kiện`,
        }}
        bordered
        scroll={{ x: 1400 }}
        size="small"
      />
      {/* Create/Edit Modal */}
      <Modal
        title="Tạo sự kiện tiêm chủng"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedGrade(1);
          setSelectedVaccineType(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {" "}
          <Form.Item
            label="Vaccine"
            name="vaccinationId"
            rules={[{ required: true, message: "Vui lòng chọn vaccine!" }]}
          >
            <Select
              placeholder="Chọn vaccine"
              onChange={(value) => {
                const selectedVaccine = vaccinations.find(
                  (v) => v.id === value
                );
                setSelectedVaccineType(selectedVaccine?.type);
                if (selectedVaccine?.type === "free") {
                  form.setFieldsValue({ price: 0 });
                }
              }}
            >
              {vaccinations.map((vaccine) => (
                <Option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name} (
                  {vaccine.type === "free" ? "Miễn phí" : "Có phí"})
                </Option>
              ))}
            </Select>
          </Form.Item>{" "}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày mở đăng ký"
                name="registrationOpenDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày mở đăng ký!" },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày mở đăng ký"
                  disabledDate={(current) => {
                    // Disable dates before today
                    return current && current < moment().startOf("day");
                  }}
                  disabledTime={(current) => {
                    // If selecting today, disable past hours
                    if (
                      current &&
                      current.format("YYYY-MM-DD") ===
                        moment().format("YYYY-MM-DD")
                    ) {
                      const now = moment();
                      return {
                        disabledHours: () =>
                          Array.from({ length: now.hour() }, (_, i) => i),
                        disabledMinutes: (selectedHour) => {
                          if (selectedHour === now.hour()) {
                            return Array.from(
                              { length: now.minute() },
                              (_, i) => i
                            );
                          }
                          return [];
                        },
                      };
                    }
                    return {};
                  }}
                  onChange={() => {
                    // Reset close date when open date changes
                    const openDate = form.getFieldValue("registrationOpenDate");
                    const closeDate = form.getFieldValue(
                      "registrationCloseDate"
                    );
                    if (openDate && closeDate && closeDate.isBefore(openDate)) {
                      form.setFieldsValue({ registrationCloseDate: null });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày đóng đăng ký"
                name="registrationCloseDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày đóng đăng ký!",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày đóng đăng ký"
                  disabledDate={(current) => {
                    const openDate = form.getFieldValue("registrationOpenDate");
                    if (!openDate) {
                      // If no open date selected, disable all past dates
                      return current && current < moment().startOf("day");
                    }
                    // Disable dates before registration open date + 1 day
                    return (
                      current &&
                      current < openDate.clone().add(1, "day").startOf("day")
                    );
                  }}
                  disabledTime={(current) => {
                    const openDate = form.getFieldValue("registrationOpenDate");
                    if (!current || !openDate) return {};

                    // If selecting exactly 1 day after open date
                    const oneDayAfterOpen = openDate.clone().add(1, "day");
                    if (
                      current.format("YYYY-MM-DD") ===
                      oneDayAfterOpen.format("YYYY-MM-DD")
                    ) {
                      const openHour = openDate.hour();
                      const openMinute = openDate.minute();
                      return {
                        disabledHours: () =>
                          Array.from({ length: openHour }, (_, i) => i),
                        disabledMinutes: (selectedHour) => {
                          if (selectedHour === openHour) {
                            return Array.from(
                              { length: openMinute + 1 },
                              (_, i) => i
                            );
                          }
                          return [];
                        },
                      };
                    }
                    return {};
                  }}
                  onChange={() => {
                    // Reset injection date when close date changes
                    const closeDate = form.getFieldValue(
                      "registrationCloseDate"
                    );
                    const injectionDate = form.getFieldValue("date");
                    if (
                      closeDate &&
                      injectionDate &&
                      injectionDate.isBefore(closeDate)
                    ) {
                      form.setFieldsValue({ date: null });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Ngày tiêm"
                name="date"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày tiêm!" },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày tiêm"
                  disabledDate={(current) => {
                    const closeDate = form.getFieldValue(
                      "registrationCloseDate"
                    );
                    if (!closeDate) {
                      // If no close date selected, disable all past dates
                      return current && current < moment().startOf("day");
                    }
                    // Disable dates before or on registration close date (must be at least 1 day after)
                    return (
                      current &&
                      current <= closeDate.clone().add(1, "day").startOf("day")
                    );
                  }}
                  disabledTime={() => {
                    // Always restrict injection time to 8:00-17:00 (working hours)
                    const disabledHours = [];
                    for (let i = 0; i < 8; i++) {
                      disabledHours.push(i); // 0-7 (before 8:00)
                    }
                    for (let i = 18; i < 24; i++) {
                      disabledHours.push(i); // 18-23 (after 17:59)
                    }

                    // For injection date, we only enforce working hours (8:00-17:00)
                    // Since date validation already ensures injection is at least 1 day after close date,
                    // all working hours are available on any valid injection date
                    return {
                      disabledHours: () => disabledHours,
                      disabledMinutes: () => [],
                    };
                  }}
                />
              </Form.Item>
            </Col>{" "}
            <Col span={12}>
              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={
                    selectedVaccineType === "free"
                      ? "Vaccine miễn phí"
                      : "Nhập giá (0 nếu miễn phí)"
                  }
                  min={0}
                  disabled={selectedVaccineType === "free"}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>{" "}
          <Form.Item
            label="Khối lớp"
            name="grade"
            rules={[{ required: true, message: "Vui lòng chọn khối lớp!" }]}
            initialValue={1}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5].map((grade) => (
                <Button
                  key={grade}
                  type={selectedGrade === grade ? "primary" : "default"}
                  size="large"
                  style={{
                    minWidth: "60px",
                    height: "40px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    backgroundColor:
                      selectedGrade === grade ? "#1890ff" : "#fff",
                    borderColor:
                      selectedGrade === grade ? "#1890ff" : "#d9d9d9",
                    color: selectedGrade === grade ? "#fff" : "#666",
                  }}
                  onClick={() => {
                    setSelectedGrade(grade);
                    form.setFieldsValue({ grade });
                  }}
                >
                  Lớp {grade}
                </Button>
              ))}
            </div>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              {" "}
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setSelectedGrade(1);
                  setSelectedVaccineType(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo sự kiện
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Detail Modal */}
      <Modal
        title="Chi tiết sự kiện tiêm chủng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedEvent && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID sự kiện">
              {selectedEvent.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên vaccine">
              {selectedEvent.vaccination?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại vaccine">
              <Tag
                color={
                  selectedEvent.vaccination?.type === "free" ? "green" : "blue"
                }
              >
                {selectedEvent.vaccination?.type === "free"
                  ? "Miễn phí"
                  : "Có phí"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số liều">
              <Tag color="purple">
                {selectedEvent.vaccination?.numberOfDoses} liều
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả vaccine" span={2}>
              {selectedEvent.vaccination?.description}
            </Descriptions.Item>{" "}
            <Descriptions.Item label="Giá">
              <span
                className={
                  selectedEvent.price === 0
                    ? "text-green-600 font-medium"
                    : "text-blue-600 font-medium"
                }
              >
                {selectedEvent.price === 0
                  ? "Miễn phí"
                  : `${selectedEvent.price.toLocaleString()} VNĐ`}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Khối lớp">
              <Tag color="cyan">Lớp {selectedEvent.grade}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày mở đăng ký">
              {moment(selectedEvent.registrationOpenDate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đóng đăng ký">
              {moment(selectedEvent.registrationCloseDate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tiêm">
              {moment(selectedEvent.date).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>{" "}
          </Descriptions>
        )}
      </Modal>
      {/* Create Vaccine Modal (Admin Only) */}
      <Modal
        title="Tạo vaccine mới"
        open={vaccineModalVisible}
        onCancel={() => {
          setVaccineModalVisible(false);
          vaccineForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={vaccineForm}
          layout="vertical"
          onFinish={handleVaccineSubmit}
        >
          <Form.Item
            label="Tên vaccine"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên vaccine!" }]}
          >
            <Input placeholder="Nhập tên vaccine" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả vaccine!" },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả về vaccine" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại vaccine"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại vaccine!" },
                ]}
              >
                <Select placeholder="Chọn loại vaccine">
                  <Option value="free">Miễn phí</Option>
                  <Option value="paid">Có phí</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số liều"
                name="numberOfDoses"
                rules={[{ required: true, message: "Vui lòng nhập số liều!" }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="Số liều"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setVaccineModalVisible(false);
                  vaccineForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo vaccine
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Upload Result Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UploadOutlined style={{ color: "#52c41a" }} />
            <span>Upload Kết Quả Tiêm Chủng</span>
          </div>
        }
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setUploadFileList([]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setUploadModalVisible(false);
              setUploadFileList([]);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="upload"
            type="primary"
            icon={<UploadOutlined />}
            loading={uploadLoading[selectedEvent?.id] || false}
            onClick={handleUploadResultFile}
            disabled={!uploadFileList.length}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Upload Kết Quả
          </Button>,
        ]}
        width={600}
      >
        {selectedEvent && (
          <div>
            {/* Event Summary */}
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
                  <strong>Sự kiện: {selectedEvent.vaccination?.name}</strong>
                </div>
                <Tag
                  color={
                    selectedEvent.vaccination?.type === "free"
                      ? "green"
                      : "blue"
                  }
                >
                  {selectedEvent.vaccination?.type === "free"
                    ? "Miễn phí"
                    : "Có phí"}
                </Tag>
              </div>
              <div style={{ marginTop: 8, color: "#666" }}>
                Ngày tiêm:{" "}
                {selectedEvent.date
                  ? moment(selectedEvent.date).format("DD/MM/YYYY HH:mm")
                  : "N/A"}
              </div>
            </Card>

            {/* File Upload */}
            <Card title="Chọn File Kết Quả" size="small">
              <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined
                    style={{ fontSize: "48px", color: "#52c41a" }}
                  />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc click để chọn file
                </p>
                <p className="ant-upload-hint">
                  Chỉ hỗ trợ file Excel (.xlsx, .xls) chứa kết quả tiêm chủng
                </p>
              </Upload.Dragger>

              {uploadFileList.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4>File đã chọn:</h4>
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #91caff",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{uploadFileList[0].name}</span>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => setUploadFileList([])}
                      style={{ color: "#ff4d4f" }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <div
              style={{
                marginTop: 16,
                padding: "12px",
                backgroundColor: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: "6px",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: "#fa8c16" }}>Lưu ý:</h4>
              <ul style={{ margin: 0, paddingLeft: 16, color: "#666" }}>
                <li>
                  File Excel phải chứa kết quả tiêm chủng cho các học sinh đã
                  đăng ký
                </li>
                <li>Đảm bảo định dạng file đúng theo mẫu quy định</li>
                <li>Kiểm tra kỹ dữ liệu trước khi upload</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
      {/* Post Injection Reports Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileTextOutlined style={{ color: "#722ed1" }} />
            <span>Báo Cáo Sau Tiêm - {selectedEvent?.vaccination?.name}</span>
          </div>
        }
        open={postInjectionModalVisible}
        onCancel={() => {
          setPostInjectionModalVisible(false);
          setPostInjectionRecords([]);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => setPostInjectionModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
        centered
      >
        {selectedEvent && (
          <div>
            {/* Statistics Cards */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <Card
                size="small"
                style={{
                  flex: 1,
                  minWidth: "200px",
                  backgroundColor: "#f6ffed",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {postInjectionRecords.length}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    Tổng báo cáo sau tiêm
                  </div>
                </div>
              </Card>

              <Card
                size="small"
                style={{
                  flex: 1,
                  minWidth: "200px",
                  backgroundColor: "#fff7e6",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#fa8c16",
                    }}
                  >
                    {
                      postInjectionRecords.filter(
                        (r) =>
                          r.severityLevel === "medium" ||
                          r.severityLevel === "high"
                      ).length
                    }
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    Cần theo dõi
                  </div>
                </div>
              </Card>

              <Card
                size="small"
                style={{
                  flex: 1,
                  minWidth: "200px",
                  backgroundColor: "#fff2f0",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ff4d4f",
                    }}
                  >
                    {
                      postInjectionRecords.filter(
                        (r) => r.severityLevel === "high"
                      ).length
                    }
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    Mức độ nặng
                  </div>
                </div>
              </Card>
            </div>{" "}
            {/* Post Injection Records Table */}
            <Table
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  width: 80,
                  render: (id) => <Tag color="purple">#{id}</Tag>,
                },
                {
                  title: "ID Bản ghi tiêm",
                  dataIndex: ["injectionRecord", "id"],
                  key: "injectionRecordId",
                  width: 130,
                  render: (id) => <Tag color="blue">#{id}</Tag>,
                },
                {
                  title: "Mức độ nghiêm trọng",
                  dataIndex: "severityLevel",
                  key: "severityLevel",
                  width: 150,
                  render: (level) => {
                    const config = {
                      low: { color: "green", text: "Nhẹ" },
                      medium: { color: "orange", text: "Vừa" },
                      high: { color: "red", text: "Nặng" },
                    };
                    const { color, text } = config[level] || {
                      color: "default",
                      text: level,
                    };
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: "Tên học sinh",
                  dataIndex: ["injectionRecord", "student", "fullName"],
                  key: "parentName",
                  width: 200,
                  render: (name) => (
                    <span style={{ fontWeight: "medium" }}>{name}</span>
                  ),
                },
                {
                  title: "Lớp",
                  dataIndex: ["injectionRecord", "student", "class"],
                  key: "parentPhone",
                  width: 130,
                  render: (phone) => (
                    <span style={{ color: "#1890ff" }}>{phone}</span>
                  ),
                },
                {
                  title: "Nhiệt độ",
                  dataIndex: "temperature",
                  key: "temperature",
                  width: 100,
                  render: (temp) => (
                    <span
                      style={{
                        color: parseFloat(temp) > 38 ? "#ff4d4f" : "#52c41a",
                        fontWeight: "bold",
                      }}
                    >
                      {temp}°C
                    </span>
                  ),
                },
                {
                  title: "Thời gian sau tiêm",
                  dataIndex: "hoursPostInjection",
                  key: "hoursPostInjection",
                  width: 150,
                  render: (hours) => <Tag color="cyan">{hours} giờ</Tag>,
                },
                {
                  title: "Ngày báo cáo",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  width: 150,
                  render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
                },                {
                  title: "Thao tác",
                  key: "actions",
                  width: 120,
                  render: (_, record) => (
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      type="primary"
                      onClick={() => handleViewInjectionRecordReports(record.injectionRecord?.id)}
                      title="Xem báo cáo tiêm chủng"
                    />
                  ),
                },
              ]}
              dataSource={postInjectionRecords}
              rowKey="id"
              loading={postInjectionLoading}
              pagination={{
                pageSize: 8,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} báo cáo`,
              }}
              scroll={{ x: 900 }}
              size="small"
            />
          </div>
        )}
      </Modal>
      {/* Post Injection Record Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <span>Chi Tiết Báo Cáo Sau Tiêm</span>
          </div>
        }
        open={postInjectionDetailModalVisible}
        onCancel={() => {
          setPostInjectionDetailModalVisible(false);
          setSelectedPostInjectionRecord(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => setPostInjectionDetailModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
        width={800}
        centered
      >
        {selectedPostInjectionRecord && (
          <div>
            {" "}
            {/* Parent Information */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <UserOutlined style={{ color: "#1890ff" }} />
                  <span>Thông Tin Phụ Huynh Báo Cáo</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="ID Phụ huynh">
                  <Tag color="blue">
                    {selectedPostInjectionRecord.createdBy?.id}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                  <strong>
                    {selectedPostInjectionRecord.createdBy?.fullName}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <span style={{ color: "#1890ff" }}>
                    {selectedPostInjectionRecord.createdBy?.email}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedPostInjectionRecord.createdBy?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò" span={2}>
                  <Tag color="green">
                    {selectedPostInjectionRecord.createdBy?.role === "parent"
                      ? "Phụ huynh"
                      : selectedPostInjectionRecord.createdBy?.role}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {/* Post Injection Report Information */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FileTextOutlined style={{ color: "#ff4d4f" }} />
                  <span>Thông Tin Báo Cáo Sau Tiêm</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Mức độ nghiêm trọng">
                  {(() => {
                    const config = {
                      low: { color: "green", text: "Nhẹ" },
                      medium: { color: "orange", text: "Vừa" },
                      high: { color: "red", text: "Nặng" },
                    };
                    const { color, text } = config[
                      selectedPostInjectionRecord.severityLevel
                    ] || {
                      color: "default",
                      text: selectedPostInjectionRecord.severityLevel,
                    };
                    return <Tag color={color}>{text}</Tag>;
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Nhiệt độ">
                  <span
                    style={{
                      color:
                        parseFloat(selectedPostInjectionRecord.temperature) > 38
                          ? "#ff4d4f"
                          : "#52c41a",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {selectedPostInjectionRecord.temperature}°C
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian sau tiêm">
                  <Tag color="blue">
                    {selectedPostInjectionRecord.hoursPostInjection} giờ
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày báo cáo">
                  {moment(selectedPostInjectionRecord.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả triệu chứng" span={2}>
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    {selectedPostInjectionRecord.description ||
                      "Không có mô tả"}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>{" "}
            {/* Injection Record Information */}
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MedicineBoxOutlined style={{ color: "#52c41a" }} />
                  <span>Thông Tin Tiêm Chủng</span>
                </div>
              }
              size="small"
            >
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="ID bản ghi tiêm">
                  <Tag color="purple">
                    {selectedPostInjectionRecord.injectionRecord?.id}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký">
                  {moment(
                    selectedPostInjectionRecord.injectionRecord
                      ?.registrationDate
                  ).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái tiêm">
                  <Tag
                    color={
                      selectedPostInjectionRecord.injectionRecord
                        ?.injectionStatus === "completed"
                        ? "green"
                        : "orange"
                    }
                  >
                    {selectedPostInjectionRecord.injectionRecord
                      ?.injectionStatus === "completed"
                      ? "Đã hoàn thành"
                      : "Chưa hoàn thành"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đủ điều kiện tiêm">
                  <Tag
                    color={
                      selectedPostInjectionRecord.injectionRecord
                        ?.eligibleForInjection
                        ? "green"
                        : "red"
                    }
                  >
                    {selectedPostInjectionRecord.injectionRecord
                      ?.eligibleForInjection
                      ? "Đủ điều kiện"
                      : "Không đủ điều kiện"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nhiệt độ trước tiêm">
                  <span
                    style={{
                      color:
                        parseFloat(
                          selectedPostInjectionRecord.injectionRecord
                            ?.preInjectionTemperature
                        ) > 37.5
                          ? "#ff4d4f"
                          : "#52c41a",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      selectedPostInjectionRecord.injectionRecord
                        ?.preInjectionTemperature
                    }
                    °C
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Nhiệt độ sau tiêm">
                  <span
                    style={{
                      color:
                        parseFloat(
                          selectedPostInjectionRecord.injectionRecord
                            ?.postInjectionTemperature
                        ) > 37.5
                          ? "#ff4d4f"
                          : "#52c41a",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      selectedPostInjectionRecord.injectionRecord
                        ?.postInjectionTemperature
                    }
                    °C
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí tiêm">
                  <Tag color="blue">
                    {selectedPostInjectionRecord.injectionRecord
                      ?.injectionSite || "Không có thông tin"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tình trạng sức khỏe">
                  <Tag color="cyan">
                    {selectedPostInjectionRecord.injectionRecord
                      ?.healthStatus === "normal"
                      ? "Bình thường"
                      : selectedPostInjectionRecord.injectionRecord
                          ?.healthStatus || "Không có thông tin"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Có bệnh lý trước đó">
                  <Tag
                    color={
                      selectedPostInjectionRecord.injectionRecord
                        ?.hasPreExistingConditions
                        ? "orange"
                        : "green"
                    }
                  >
                    {selectedPostInjectionRecord.injectionRecord
                      ?.hasPreExistingConditions
                      ? "Có"
                      : "Không"}
                  </Tag>
                </Descriptions.Item>
                {selectedPostInjectionRecord.injectionRecord
                  ?.hasPreExistingConditions &&
                  selectedPostInjectionRecord.injectionRecord
                    ?.preExistingConditions && (
                    <Descriptions.Item label="Bệnh lý trước đó" span={2}>
                      <div
                        style={{
                          backgroundColor: "#fff7e6",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #ffd591",
                        }}
                      >
                        {
                          selectedPostInjectionRecord.injectionRecord
                            .preExistingConditions
                        }
                      </div>
                    </Descriptions.Item>
                  )}
                {selectedPostInjectionRecord.injectionRecord
                  ?.preInjectionHealthNotes && (
                  <Descriptions.Item
                    label="Ghi chú sức khỏe trước tiêm"
                    span={2}
                  >
                    <div
                      style={{
                        backgroundColor: "#f0f9ff",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #91caff",
                      }}
                    >
                      {
                        selectedPostInjectionRecord.injectionRecord
                          .preInjectionHealthNotes
                      }
                    </div>
                  </Descriptions.Item>
                )}
                {selectedPostInjectionRecord.injectionRecord?.sideEffects && (
                  <Descriptions.Item label="Tác dụng phụ" span={2}>
                    <div
                      style={{
                        backgroundColor: "#fff2e8",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ffb366",
                      }}
                    >
                      {selectedPostInjectionRecord.injectionRecord.sideEffects}
                    </div>
                  </Descriptions.Item>
                )}
                {selectedPostInjectionRecord.injectionRecord?.notes && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    <div
                      style={{
                        backgroundColor: "#f6ffed",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #b7eb8f",
                      }}
                    >
                      {selectedPostInjectionRecord.injectionRecord.notes}
                    </div>
                  </Descriptions.Item>
                )}
                {selectedPostInjectionRecord.injectionRecord
                  ?.deferralReason && (
                  <Descriptions.Item label="Lý do hoãn tiêm" span={2}>
                    <div
                      style={{
                        backgroundColor: "#fff1f0",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ffccc7",
                      }}
                    >
                      {
                        selectedPostInjectionRecord.injectionRecord
                          .deferralReason
                      }
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>          </div>
        )}
      </Modal>

      {/* Injection Record Reports Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MedicineBoxOutlined style={{ color: "#52c41a" }} />
            <span>Báo Cáo Tiêm Chủng</span>
          </div>
        }
        open={injectionRecordDetailModalVisible}
        onCancel={() => {
          setInjectionRecordDetailModalVisible(false);
          setSelectedInjectionRecordReports(null);
        }}
        footer={[
          <Button
            key="createAppointment"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              // Handle create appointment logic here
              message.info("Chức năng tạo lịch hẹn sẽ được phát triển sau.");
            }}
          >
            Tạo Lịch Hẹn
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setInjectionRecordDetailModalVisible(false);
              setSelectedInjectionRecordReports(null);
            }}
          >
            Đóng
          </Button>
        ]}
        width={1000}
        centered
      >
        {injectionRecordLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
            <span className="ml-3">Đang tải báo cáo tiêm chủng...</span>
          </div>
        ) : selectedInjectionRecordReports && selectedInjectionRecordReports.length > 0 ? (
          <div>
            {/* Reports List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {selectedInjectionRecordReports.map((report) => (
                <Card
                  key={report.id}
                  size="small"
                  style={{
                    border: `2px solid ${
                      report.severityLevel === "high"
                        ? "#ff4d4f"
                        : report.severityLevel === "medium"
                        ? "#fa8c16"
                        : "#52c41a"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <strong>Báo cáo #{report.id}</strong>
                      <div style={{ color: "#666", fontSize: "12px" }}>
                        {moment(report.createdAt).format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <Tag
                        color={
                          report.severityLevel === "high"
                            ? "red"
                            : report.severityLevel === "medium"
                            ? "orange"
                            : "green"
                        }
                      >
                        {report.severityLevel === "high"
                          ? "Nghiêm trọng"
                          : report.severityLevel === "medium"
                          ? "Trung bình"
                          : "Nhẹ"}
                      </Tag>
                      <Tag color="blue">{report.hoursPostInjection} giờ sau tiêm</Tag>
                    </div>
                  </div>

                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Nhiệt độ">
                      <span
                        style={{
                          color: parseFloat(report.temperature) > 38 ? "#ff4d4f" : "#52c41a",
                          fontWeight: "bold",
                        }}
                      >
                        {report.temperature}°C
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phụ huynh báo cáo">
                      <div>
                        <strong>{report.createdBy?.fullName}</strong>
                        <br />
                        <span style={{ color: "#1890ff" }}>{report.createdBy?.phone}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả triệu chứng" span={2}>
                      <div
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        {report.description || "Không có mô tả"}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>

                  {/* Injection Record Information */}
                  {report.injectionRecord && (
                    <div style={{ marginTop: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#52c41a" }}>
                        Thông tin bản ghi tiêm #{report.injectionRecord.id}
                      </h4>
                      <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Ngày đăng ký">
                          {moment(report.injectionRecord.registrationDate).format("DD/MM/YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                          <Tag
                            color={
                              report.injectionRecord.injectionStatus === "completed" ? "green" : "orange"
                            }
                          >
                            {report.injectionRecord.injectionStatus === "completed"
                              ? "Đã hoàn thành"
                              : "Chưa hoàn thành"}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhiệt độ trước tiêm">
                          {report.injectionRecord.preInjectionTemperature}°C
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhiệt độ sau tiêm">
                          {report.injectionRecord.postInjectionTemperature}°C
                        </Descriptions.Item>
                        <Descriptions.Item label="Vị trí tiêm">
                          {report.injectionRecord.injectionSite}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tình trạng sức khỏe">
                          <Tag color="cyan">
                            {report.injectionRecord.healthStatus === "normal"
                              ? "Bình thường"
                              : report.injectionRecord.healthStatus}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có báo cáo tiêm chủng nào</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InjectionEvent;
