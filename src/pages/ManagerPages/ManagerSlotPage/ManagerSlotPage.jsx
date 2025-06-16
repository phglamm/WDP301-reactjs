import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Select,
  Button,
  message,
  Card,
  Space,
  Tag,
  Modal,
  Upload,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CheckOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import assignService from "../../../services/AssignNurseRequest/AssignNurseRequest";

const { Option } = Select;
const { Dragger } = Upload;

export default function ManagerSlotPage() {
  const [classes, setClasses] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes and nurses simultaneously
      const [classesResponse, nursesResponse] = await Promise.all([
        assignService.fetchClassesWithMedicalRequests(),
        assignService.fetchNurses(),
      ]);

      // Mock data based on your API structure
      // Replace this with actual API response handling
      const mappedClasses = classesResponse.data.map((className, index) => ({
        id: index + 1, // Generate unique ID
        className: className,
      }));

      setClasses(mappedClasses || []);
      setNurses(nursesResponse.data || []);
    } catch (error) {
      message.error("Không thể tải dữ liệu");
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls");

    if (!isExcel) {
      message.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return false;
    }

    // Validate file size (e.g., max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Kích thước file phải nhỏ hơn 10MB");
      return false;
    }

    setSelectedFile(file);
    return false; // Prevent auto upload
  };

  const importFile = async () => {
    if (!selectedFile) {
      message.warning("Vui lòng chọn file Excel trước");
      return;
    }

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await assignService.importFile(formData);
      console.log(response);
      message.success("Nhập file thành công!");

      // Refresh data after successful import
      await fetchData();

      // Close modal and reset file selection
      setIsImportModalVisible(false);
      setSelectedFile(null);
    } catch (error) {
      message.error("Nhập file thất bại");
      console.error("Import file error:", error);
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportModalOpen = () => {
    setIsImportModalVisible(true);
    setSelectedFile(null);
  };

  const handleImportModalClose = () => {
    setIsImportModalVisible(false);
    setSelectedFile(null);
  };

  const handleAssignNurse = async () => {
    if (!selectedNurse || selectedClasses.length === 0) {
      message.warning("Vui lòng chọn y tá và ít nhất một lớp học");
      return;
    }

    // Find the selected nurse object
    const selectedNurseObj = nurses.find((n) => n.id === selectedNurse);

    if (!selectedNurseObj) {
      message.error("Không tìm thấy y tá đã chọn");
      return;
    }

    console.log("About to show modal..."); // Debug log

    Modal.confirm({
      title: "Xác nhận phân công",
      content: `Bạn có chắc chắn muốn phân công ${selectedNurseObj.fullName} cho ${selectedClasses.length} lớp học?`,
      okText: "Có, Phân công",
      cancelText: "Hủy",
      onOk: async () => {
        console.log("Modal OK clicked"); // Debug log
        setAssignLoading(true);
        try {
          const selectedClassNames = selectedClasses.map(
            (id) => classes.find((c) => c.id === id)?.className
          );

          const requestData = {
            classes: [...selectedClassNames],
            nurseId: selectedNurse, // selectedNurse is already the ID
          };

          console.log("Request Data:", requestData);
          await assignService.assignNurseToClasses(requestData);

          message.success("Phân công y tá thành công!");

          // Update local state
          setClasses((prevClasses) =>
            prevClasses.map((cls) => {
              if (selectedClasses.includes(cls.id)) {
                return {
                  ...cls,
                  assignedNurse: selectedNurseObj.fullName,
                };
              }
              return cls;
            })
          );

          // Reset selections
          setSelectedClasses([]);
          setSelectedNurse(null);
        } catch (error) {
          message.error("Phân công y tá thất bại");
          console.error("Assignment error:", error);
        } finally {
          setAssignLoading(false);
        }
      },
      onCancel: () => {
        console.log("Modal cancelled"); // Debug log
      },
    });
  };

  const columns = [
    {
      title: "Tên Lớp",
      dataIndex: "className",
      key: "className",
      render: (text) => (
        <Space>
          <Tag color="blue" icon={<MedicineBoxOutlined />}>
            {text}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Y Tá Được Phân Công",
      dataIndex: "assignedNurse",
      key: "assignedNurse",
      render: (nurseId) => {
        if (nurseId) {
          return (
            <Tag color="green" icon={<UserOutlined />}>
              {nurseId}
            </Tag>
          );
        }
        return <span className="text-gray-400">Chưa phân công</span>;
      },
    },
    {
      title: "Trạng Thái",
      key: "status",
      render: (_, record) =>
        record.assignedNurse ? (
          <Tag color="success" icon={<CheckOutlined />}>
            Đã phân công
          </Tag>
        ) : (
          <Tag color="warning">Chờ xử lý</Tag>
        ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedClasses,
    onChange: (selectedRowKeys) => {
      setSelectedClasses(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: !!record.assignedNurse, // Disable if already assigned
    }),
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls",
    beforeUpload: handleFileSelect,
    fileList: selectedFile ? [selectedFile] : [],
    onRemove: () => {
      setSelectedFile(null);
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản Lý Ca Phát thuốc - Phân Công Y Tá
          </h1>
          <p className="text-gray-600">
            Quản lý việc phân công y tá cho các lớp học có yêu cầu y tế
          </p>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Y Tá
              </label>
              <Select
                placeholder="Chọn y tá để phân công"
                value={selectedNurse}
                onChange={setSelectedNurse}
                className="w-full"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.props.children[0].props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {nurses.map((nurse) => (
                  <Option key={nurse.id} value={nurse.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{nurse.fullName}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                type="primary"
                onClick={handleAssignNurse}
                loading={assignLoading}
                disabled={!selectedNurse || selectedClasses.length === 0}
                size="large"
                icon={<UserOutlined />}
              >
                Phân Công Y Tá ({selectedClasses.length} lớp)
              </Button>

              <Button onClick={fetchData} loading={loading} size="large">
                Làm Mới
              </Button>

              <Button
                onClick={handleImportModalOpen}
                loading={importLoading}
                size="large"
                icon={<UploadOutlined />}
              >
                Nhập Ca Trực Cho Y Tá
              </Button>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Các Lớp Có Yêu Cầu Y Tế
            </h2>
            <p className="text-gray-600">
              Chọn các lớp để phân công cho y tá đã chọn. Các lớp đã được phân
              công không thể thay đổi.
            </p>
          </div>

          <Table
            columns={columns}
            dataSource={classes}
            loading={loading}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trong ${total} lớp`,
            }}
            className="rounded-lg"
            scroll={{ x: 800 }}
          />
        </Card>

        {selectedClasses.length > 0 && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Lớp Đã Chọn: {selectedClasses.length}
                </h3>
                <p className="text-blue-700">
                  Các lớp sẽ được phân công:{" "}
                  {selectedClasses
                    .map((id) => classes.find((c) => c.id === id)?.className)
                    .join(", ")}
                </p>
              </div>
              <Button
                type="link"
                onClick={() => setSelectedClasses([])}
                className="text-blue-600"
              >
                Xóa Lựa Chọn
              </Button>
            </div>
          </Card>
        )}

        {/* Import File Modal */}
        <Modal
          title="Nhập Dữ Liệu Ca Trực Y Tá"
          open={isImportModalVisible}
          onCancel={handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={handleImportModalClose}>
              Hủy
            </Button>,
            <Button
              key="import"
              type="primary"
              loading={importLoading}
              onClick={importFile}
              disabled={!selectedFile}
              icon={<UploadOutlined />}
            >
              Nhập File
            </Button>,
          ]}
          width={600}
        >
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Tải lên file Excel (.xlsx hoặc .xls) chứa dữ liệu ca trực y tá.
              File nên có định dạng phù hợp cho việc phân công y tá.
            </p>

            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo file Excel vào đây để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ file .xlsx và .xls. Kích thước tối đa: 10MB
              </p>
            </Dragger>

            {selectedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800">
                  <strong>File đã chọn:</strong> {selectedFile.name}
                </p>
                <p className="text-green-600 text-sm">
                  Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
