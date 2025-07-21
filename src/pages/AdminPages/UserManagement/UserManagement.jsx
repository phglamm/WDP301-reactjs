import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, Select, Avatar, message, Card, Modal, Descriptions, Spin, Upload } from 'antd';
import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import UserService from '../../../services/User/UserService';
import CardData from '../../../components/CardData/CardData';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/features/userSlice';

const { Search } = Input;

const UserManagement = () => {  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);  const [uploadLoading, setUploadLoading] = useState(false);
  const user = useSelector(selectUser);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    nurses: 0,
    parents: 0,
    admins: 0
  });// Fetch all users on component mount
  const calculateStatistics = useCallback((userData) => {
    const stats = {
      totalUsers: userData.length,
      nurses: userData.filter(user => user.role === 'nurse').length,
      parents: userData.filter(user => user.role === 'parent' || user.role === 'user').length,
      admins: userData.filter(user => user.role === 'admin').length
    };
    setStatistics(stats);
  }, []);  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      
      if (response && response.status) {
        // Handle the nested structure: response.data.users
        const userData = response.data?.users || [];
        const metaData = response.data?.meta || {};
        
        setUsers(userData);
        calculateStatistics(userData);
        
        // Update pagination info from API response
        setPagination(prev => ({
          ...prev,
          total: metaData.total || userData.length,
          current: metaData.page || 1,
          pageSize: metaData.limit || 10
        }));
      } else {
        message.error('Không thể tải danh sách người dùng');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu người dùng');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [calculateStatistics]);

  const applyFilters = useCallback(() => {
    let filtered = users;

    // Apply role filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'parents') {
        filtered = filtered.filter(user => user.role === 'parent' || user.role === 'user');
      } else {
        filtered = filtered.filter(user => user.role === activeFilter);
      }
    }

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(searchText) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  }, [users, activeFilter, searchText]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Update filtered users when search text or filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCardClick = (filterType) => {
    setActiveFilter(filterType);
    setSearchText(''); // Clear search when changing filter
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };  const handleViewDetail = async (user) => {
    try {
      setUserDetailLoading(true);
      setDetailModalVisible(true);
      
      // Fetch detailed user information
      const response = await UserService.getUserById(user.id);
      
      if (response && response.status) {
        // API returns user data directly in response.data
        setSelectedUser(response.data);
      } else {
        message.error('Không thể tải thông tin chi tiết người dùng');
        setSelectedUser(user); // Fallback to basic user data
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Có lỗi xảy ra khi tải thông tin chi tiết');
      setSelectedUser(user); // Fallback to basic user data
    } finally {
      setUserDetailLoading(false);
    }  };

  // Handle import Excel
  const handleImportExcel = () => {
    if (user.role !== 'admin') {
      message.error('Chỉ admin mới có thể import dữ liệu!');
      return;
    }
    setImportModalVisible(true);
  };

  // Handle Excel import submission
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

      const response = await UserService.importUserDataFromExcel(formData);
      
      if (response.status) {
        message.success('Import dữ liệu người dùng thành công!');
        setImportModalVisible(false);
        setUploadFileList([]);
        fetchAllUsers(); // Refresh user list
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi import dữ liệu!');
      }
    } catch (error) {
      console.error('Error importing user data:', error);
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

//   const handleEdit = (user) => {
//     console.log('Edit user:', user);
//     // TODO: Implement user edit modal
//   };

//   const handleDelete = (user) => {
//     console.log('Delete user:', user);
//     // TODO: Implement user delete confirmation
//   };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'nurse':
        return 'blue';
      case 'parent':
      case 'user':
        return 'green';
      default:
        return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'nurse':
        return 'Y tá';
      case 'parent':
      case 'user':
        return 'Phụ huynh';
      default:
        return role;
    }
  };

  // Card data for filtering
  const cardData = [
    {
      title: "Tổng số người dùng",
      value: statistics.totalUsers,
      subtitle: "tất cả vai trò",
      filterType: "all"
    },
    {
      title: "Y tá",
      value: statistics.nurses,
      subtitle: "nhân viên y tế",
      filterType: "nurse"
    },
    {
      title: "Phụ huynh",
      value: statistics.parents,
      subtitle: "người dùng",
      filterType: "parents"
    },
    {
      title: "Quản trị viên",
      value: statistics.admins,
      subtitle: "admin hệ thống",
      filterType: "admin"
    }
  ];

  // Table columns
  const columns = [    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (_, record) => (
        <Avatar 
          size="large" 
          style={{ backgroundColor: '#1890ff' }}
          icon={<UserOutlined />}
        >
          {record.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <span className="text-blue-600">{email}</span>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleDisplayName(role)}
        </Tag>
      ),
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Y tá', value: 'nurse' },
        { text: 'Phụ huynh', value: 'parent' },
      ],
      onFilter: (value, record) => record.role === value || (value === 'parent' && record.role === 'user'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          />
          {/* <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            title="Xóa"
          /> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full h-full pt-[2%]">
      {/* Statistics Cards */}
      <div className="w-full flex flex-wrap justify-between items-center mb-6">
        {cardData.map((item, index) => (
          <CardData
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
            onClick={() => handleCardClick(item.filterType)}
          />
        ))}
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Search
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              allowClear
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Select
              value={activeFilter}
              onChange={setActiveFilter}
              style={{ width: 200 }}
              placeholder="Lọc theo vai trò"
            >
              <Select.Option value="all">Tất cả vai trò</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
              <Select.Option value="nurse">Y tá</Select.Option>
              <Select.Option value="parents">Phụ huynh</Select.Option>
            </Select>          </div>
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Button
                icon={<UploadOutlined />}
                onClick={handleImportExcel}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
              >
                Import Excel
              </Button>
            )}
            <div className="text-gray-500">
              Hiển thị {filteredUsers.length} / {users.length} người dùng
              {activeFilter !== 'all' && (
                <Tag color="blue" className="ml-2">
                  Lọc: {cardData.find(item => item.filterType === activeFilter)?.title}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </Card>      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey={(record) => record.id || record.email}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredUsers.length, // Use filtered data length for client-side pagination
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} người dùng`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
          bordered        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailModalVisible(false);
            setSelectedUser(null);
          }}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {userDetailLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
            <span className="ml-3">Đang tải thông tin chi tiết...</span>
          </div>
        ) : selectedUser ? (
          <div>
            {/* User Avatar and Basic Info */}
            <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <Avatar 
                size={80} 
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              >
                {selectedUser.fullName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedUser.fullName || 'Chưa có tên'}
                </h3>
                <Tag color={getRoleColor(selectedUser.role)} className="text-sm">
                  {getRoleDisplayName(selectedUser.role)}
                </Tag>
              </div>
            </div>            {/* Detailed Information */}
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="ID người dùng" span={1}>
                {selectedUser.id}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đầy đủ" span={1}>
                {selectedUser.fullName || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                <span className="text-blue-600">{selectedUser.email}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={1}>
                {selectedUser.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò" span={1}>
                <Tag color={getRoleColor(selectedUser.role)}>
                  {getRoleDisplayName(selectedUser.role)}
                </Tag>
              </Descriptions.Item>
              
              {/* Additional fields that might be available */}
              {selectedUser.createdAt && (
                <Descriptions.Item label="Ngày tạo" span={1}>
                  {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
              )}
              
              {selectedUser.updatedAt && (
                <Descriptions.Item label="Cập nhật lần cuối" span={1}>
                  {new Date(selectedUser.updatedAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
              )}
              
              {selectedUser.address && (
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedUser.address}
                </Descriptions.Item>
              )}
              
              {selectedUser.dateOfBirth && (
                <Descriptions.Item label="Ngày sinh" span={1}>
                  {new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              )}
              
              {selectedUser.gender && (
                <Descriptions.Item label="Giới tính" span={1}>
                  {selectedUser.gender === 'male' ? 'Nam' : 
                   selectedUser.gender === 'female' ? 'Nữ' : 
                   selectedUser.gender}
                </Descriptions.Item>
              )}
              
              {selectedUser.status && (
                <Descriptions.Item label="Trạng thái" span={1}>
                  <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                    {selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </Descriptions.Item>
              )}
              
              {selectedUser.lastLogin && (
                <Descriptions.Item label="Đăng nhập lần cuối" span={1}>
                  {new Date(selectedUser.lastLogin).toLocaleString('vi-VN')}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Additional Information Section */}
            {(selectedUser.notes || selectedUser.emergencyContact) && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Thông tin bổ sung</h4>
                <Descriptions bordered column={1} size="small">
                  {selectedUser.notes && (
                    <Descriptions.Item label="Ghi chú">
                      {selectedUser.notes}
                    </Descriptions.Item>
                  )}
                  {selectedUser.emergencyContact && (
                    <Descriptions.Item label="Liên hệ khẩn cấp">
                      {selectedUser.emergencyContact}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có thông tin để hiển thị</p>
          </div>        )}
      </Modal>

      {/* Import Excel Modal (Admin Only) */}
      <Modal
        title="Import dữ liệu người dùng từ Excel"
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
              Chỉ hỗ trợ file Excel (.xlsx, .xls) chứa dữ liệu người dùng
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
              <li>File Excel phải chứa các cột: fullName, email, phone, password, role</li>
              <li>Cột role chỉ nhận các giá trị: admin, nurse, parent</li>
              <li>Đảm bảo định dạng file đúng theo mẫu quy định</li>
              <li>Kiểm tra kỹ dữ liệu trước khi import</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;