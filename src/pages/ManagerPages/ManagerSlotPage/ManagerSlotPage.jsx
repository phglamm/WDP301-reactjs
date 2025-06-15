import React, { useState, useEffect } from "react";
import { Table, Select, Button, message, Card, Space, Tag, Modal } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import assignService from "../../../services/AssignNurseRequest/AssignNurseRequest";

const { Option } = Select;

export default function ManagerSlotPage() {
  const [classes, setClasses] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

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
      message.error("Failed to fetch data");
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignNurse = async () => {
    if (!selectedNurse || selectedClasses.length === 0) {
      message.warning("Please select a nurse and at least one class");
      return;
    }

    // Find the selected nurse object
    const selectedNurseObj = nurses.find((n) => n.id === selectedNurse);

    if (!selectedNurseObj) {
      message.error("Selected nurse not found");
      return;
    }

    console.log("About to show modal..."); // Debug log

    Modal.confirm({
      title: "Confirm Assignment",
      content: `Are you sure you want to assign ${selectedNurseObj.fullName} to ${selectedClasses.length} class(es)?`,
      okText: "Yes, Assign",
      cancelText: "Cancel",
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

          message.success("Nurse assigned successfully!");

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
          message.error("Failed to assign nurse");
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
      title: "Class Name",
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
      title: "Assigned Nurse",
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
        return <span className="text-gray-400">Not assigned</span>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.assignedNurse ? (
          <Tag color="success" icon={<CheckOutlined />}>
            Assigned
          </Tag>
        ) : (
          <Tag color="warning">Pending</Tag>
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manager Slot - Nurse Assignment
          </h1>
          <p className="text-gray-600">
            Manage nurse assignments for classes with medical requests
          </p>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Nurse
              </label>
              <Select
                placeholder="Choose a nurse to assign"
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
                      <span className="text-xs text-gray-500">
                        {nurse.phone} • {nurse.email}
                      </span>
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
                Assign Nurse ({selectedClasses.length} classes)
              </Button>

              <Button onClick={fetchData} loading={loading} size="large">
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Classes with Medical Requests
            </h2>
            <p className="text-gray-600">
              Select classes to assign to the chosen nurse. Already assigned
              classes cannot be modified.
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
                `${range[0]}-${range[1]} of ${total} classes`,
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
                  Selected Classes: {selectedClasses.length}
                </h3>
                <p className="text-blue-700">
                  Classes to be assigned:{" "}
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
                Clear Selection
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
