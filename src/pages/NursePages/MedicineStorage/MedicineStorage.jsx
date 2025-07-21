import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Input, Select, Modal, Form, InputNumber, Upload, message } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import medicineStorageService from '../../../services/Nurse/MedicineStorage/MedicineStorage'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/features/userSlice';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const MedicineStorage = () => {
    const [medicineData, setMedicineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector(selectUser);


    const columns = [
        {
            title: "Medicine ID",
            dataIndex: "id",
            key: "id",
            width: 100,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Medicine Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search medicine name"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters()} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record.name.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Manufacturer",
            dataIndex: "manufacturer",
            key: "manufacturer",
            width: 150,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            render: (text) => (
                <span className="line-clamp-2" title={text}>
                    {text || 'No description'}
                </span>
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: 100,
            sorter: (a, b) => a.quantity - b.quantity,
            render: (quantity) => {
                let color = 'green';
                if (quantity < 10) color = 'red';
                else if (quantity < 50) color = 'orange';
                
                return (
                    <Tag color={color}>
                        {quantity}
                    </Tag>
                );
            },
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 100,
            render: (type) => {
                const typeColors = {
                    'Viên': 'blue',
                    'Chai': 'green',
                    'Tuýp': 'orange',
                    'Gói': 'purple',
                    'Hộp': 'cyan'
                };
                return <Tag color={typeColors[type] || 'default'}>{type}</Tag>;
            },
            filters: [
                { text: 'Viên', value: 'Viên' },
                { text: 'Chai', value: 'Chai' },
                { text: 'Tuýp', value: 'Tuýp' },
                { text: 'Gói', value: 'Gói' },
                { text: 'Hộp', value: 'Hộp' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        // {
        //     title: 'Actions',
        //     key: 'actions',
        //     width: 150,
        //     fixed: 'right',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button
        //                 icon={<EditOutlined />}
        //                 size="small"
        //                 onClick={() => handleEdit(record)}
        //                 title="Edit Medicine"
        //             />
        //             <Button
        //                 icon={<DeleteOutlined />}
        //                 size="small"
        //                 danger
        //                 onClick={() => handleDelete(record)}
        //                 title="Delete Medicine"
        //             />
        //         </Space>
        //     ),
        // },
    ];

    const fetchMedicineData = async () => {
        try {
            setLoading(true);
            const response = await medicineStorageService.getAllMedicineStorage();
            console.log('Medicine data:', response);
            
            // Handle different response structures
            let medicineList = [];
            if (Array.isArray(response)) {
                medicineList = response;
            } else if (response && Array.isArray(response.data)) {
                medicineList = response.data;
            } else if (response && typeof response === 'object') {
                const arrayProperty = Object.values(response).find(value => Array.isArray(value));
                if (arrayProperty) {
                    medicineList = arrayProperty;
                }
            }
            
            setMedicineData(medicineList);
        } catch (error) {
            console.error("Error fetching medicine data:", error);
        } finally {
            setLoading(false);
        }
    };    const handleEdit = (medicine) => {
        console.log('Edit medicine:', medicine);
        // Add your edit logic here
        // You can show a modal or navigate to edit page
    };

    const handleDelete = (medicine) => {
        console.log('Delete medicine:', medicine);
        // Add your delete logic here
        // You might want to show a confirmation dialog
    };

    const handleAddNew = () => {
        if (user.role !== 'admin') {
            message.error('Chỉ admin mới có thể thêm thuốc mới!');
            return;
        }
        setAddModalVisible(true);
    };

    const handleImportExcel = () => {
        if (user.role !== 'admin') {
            message.error('Chỉ admin mới có thể import dữ liệu!');
            return;
        }
        setImportModalVisible(true);
    };

    // Handle medicine creation
    const handleMedicineSubmit = async (values) => {
        try {
            const medicineData = {
                name: values.name,
                manufacturer: values.manufacturer,
                description: values.description,
                quantity: values.quantity,
                type: values.type
            };

            const response = await medicineStorageService.createMedicine(medicineData);
            
            if (response.status) {
                message.success('Tạo thuốc thành công!');
                setAddModalVisible(false);
                form.resetFields();
                fetchMedicineData(); // Refresh data
            } else {
                message.error('Có lỗi xảy ra khi tạo thuốc!');
            }
        } catch (error) {
            console.error('Error creating medicine:', error);
            message.error('Có lỗi xảy ra khi tạo thuốc!');
        }
    };

    // Handle Excel import
    const handleImportSubmit = async () => {
        if (!uploadFileList.length) {
            message.error('Vui lòng chọn file Excel');
            return;
        }

        try {
            setUploadLoading(true);
            
            const formData = new FormData();
            const file = uploadFileList[0].originFileObj || uploadFileList[0];
            formData.append('file', file);

            const response = await medicineStorageService.importMedicineDataFromExcel(formData);
            
            if (response.status) {
                message.success('Import dữ liệu thành công!');
                setImportModalVisible(false);
                setUploadFileList([]);
                fetchMedicineData(); // Refresh data
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi import dữ liệu!');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi import dữ liệu!';
            message.error(errorMessage);
        } finally {
            setUploadLoading(false);
        }
    };

    // Upload props for Excel import
    const uploadProps = {
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                           file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                message.error('Chỉ có thể upload file Excel (.xlsx, .xls)!');
                return false;
            }
            setUploadFileList([file]);
            return false;
        },
        fileList: uploadFileList,
        onRemove: () => setUploadFileList([])
    };

    useEffect(() => {
        fetchMedicineData();
    }, []);

    // Filter data based on search and type filter
    const filteredData = medicineData.filter(item => {
        const matchesSearch = item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                            item.manufacturer?.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="w-full h-full pt-[2%]">
            {/* Header with controls */}
            <div className="w-full mb-4">                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Medicine Storage ({medicineData.length} items)
                    </h2>
                    <Space>
                        {user.role === 'admin' && (
                            <>
                                <Button
                                    icon={<UploadOutlined />}
                                    onClick={handleImportExcel}
                                    size="large"
                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                                >
                                    Import Medicine
                                </Button>
                                
                            </>
                        )}
                    </Space>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="flex gap-4 mb-4">
                    <Search
                        placeholder="Search medicines..."
                        allowClear
                        style={{ width: 300 }}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={(value) => setSearchText(value)}
                    />
                    <Select
                        value={filterType}
                        onChange={setFilterType}
                        style={{ width: 150 }}
                    >
                        <Option value="all">All Types</Option>
                        <Option value="Viên">Viên</Option>
                        <Option value="Chai">Chai</Option>
                        <Option value="Tuýp">Tuýp</Option>
                        <Option value="Gói">Gói</Option>
                        <Option value="Hộp">Hộp</Option>
                    </Select>
                </div>
            </div>

            {/* Medicine Table */}
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} medicines`
                }}
                bordered
                scroll={{ x: 1000 }}
                style={{ width: "100%", height: "100%" }}
                size="small"
                rowClassName={(record) => {
                    if (record.quantity < 10) return 'bg-red-50';
                    if (record.quantity < 50) return 'bg-yellow-50';
                    return '';                }}
            />

            {/* Add Medicine Modal (Admin Only) */}
            <Modal
                title="Thêm thuốc mới"
                open={addModalVisible}
                onCancel={() => {
                    setAddModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleMedicineSubmit}
                >
                    <Form.Item
                        label="Tên thuốc"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
                    >
                        <Input placeholder="Nhập tên thuốc" />
                    </Form.Item>

                    <Form.Item
                        label="Nhà sản xuất"
                        name="manufacturer"
                        rules={[{ required: true, message: 'Vui lòng nhập nhà sản xuất!' }]}
                    >
                        <Input placeholder="Nhập nhà sản xuất" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea 
                            rows={4} 
                            placeholder="Nhập mô tả về thuốc" 
                        />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber 
                                min={0} 
                                placeholder="Số lượng" 
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[{ required: true, message: 'Vui lòng chọn loại thuốc!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="Chọn loại thuốc">
                                <Option value="Viên">Viên</Option>
                                <Option value="Chai">Chai</Option>
                                <Option value="Tuýp">Tuýp</Option>
                                <Option value="Gói">Gói</Option>
                                <Option value="Hộp">Hộp</Option>
                            </Select>
                        </Form.Item>
                    </Space>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={() => {
                                setAddModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Tạo thuốc
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Import Excel Modal (Admin Only) */}
            <Modal
                title="Import dữ liệu thuốc từ Excel"
                open={importModalVisible}
                onCancel={() => {
                    setImportModalVisible(false);
                    setUploadFileList([]);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setImportModalVisible(false);
                        setUploadFileList([]);
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="import"
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={uploadLoading}
                        onClick={handleImportSubmit}
                        disabled={!uploadFileList.length}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Import Dữ Liệu
                    </Button>
                ]}
                width={600}
            >
                <div>
                    <Upload.Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                        </p>
                        <p className="ant-upload-text">
                            Kéo thả file vào đây hoặc click để chọn file
                        </p>
                        <p className="ant-upload-hint">
                            Chỉ hỗ trợ file Excel (.xlsx, .xls) chứa dữ liệu thuốc
                        </p>
                    </Upload.Dragger>
                    
                    {uploadFileList.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <h4>File đã chọn:</h4>
                            <div style={{ 
                                padding: '8px 12px', 
                                backgroundColor: '#f0f9ff', 
                                border: '1px solid #91caff',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>{uploadFileList[0].name}</span>
                                <Button 
                                    type="text" 
                                    size="small" 
                                    onClick={() => setUploadFileList([])}
                                    style={{ color: '#ff4d4f' }}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    )}

                    <div style={{ 
                        marginTop: 16, 
                        padding: '12px', 
                        backgroundColor: '#fff7e6', 
                        border: '1px solid #ffd591',
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#fa8c16' }}>Lưu ý:</h4>
                        <ul style={{ margin: 0, paddingLeft: 16, color: '#666' }}>
                            <li>File Excel phải chứa các cột: name, manufacturer, description, quantity, type</li>
                            <li>Đảm bảo định dạng file đúng theo mẫu quy định</li>
                            <li>Kiểm tra kỹ dữ liệu trước khi import</li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MedicineStorage;