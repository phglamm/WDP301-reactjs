import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import medicineStorageService from '../../../services/MedicineStorage/MedicineStorage'

const { Search } = Input;
const { Option } = Select;

const MedicineStorage = () => {
    const [medicineData, setMedicineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all');

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
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        title="Edit Medicine"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => handleDelete(record)}
                        title="Delete Medicine"
                    />
                </Space>
            ),
        },
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
    };

    const handleEdit = (medicine) => {
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
        console.log('Add new medicine');
        // Add your add new medicine logic here
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
            <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Medicine Storage ({medicineData.length} items)
                    </h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddNew}
                        size="large"
                    >
                        Add New Medicine
                    </Button>
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
                    return '';
                }}
            />
        </div>
    );
};

export default MedicineStorage;