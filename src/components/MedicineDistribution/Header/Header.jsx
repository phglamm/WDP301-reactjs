import { Space, Button, Upload, Select, message } from 'antd';
import { ReloadOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const sessionOptions = [
  { value: 'Sáng', label: 'Sáng (Morning)' },
  { value: 'Trưa', label: 'Trưa (Noon)' },
  { value: 'Chiều', label: 'Chiều (Afternoon)' }
];

const Header = ({ 
  selectedSession, 
  onSessionChange, 
  onRefresh, 
  onExcelUpload, 
  loading, 
  uploading 
}) => {
  const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel' ||
                   file.name.endsWith('.xlsx') ||
                   file.name.endsWith('.xls');
    
    if (!isExcel) {
      message.error('Bạn chỉ có thể tải lên file Excel (.xlsx, .xls)!');
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File phải nhỏ hơn 10MB!');
      return false;
    }
    
    return onExcelUpload(file);
  };

  return (
    <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
      <h3 className="text-lg font-semibold">Danh sách phân phối thuốc</h3>
      
      <Space>
        <Select
          value={selectedSession}
          onChange={onSessionChange}
          style={{ width: 150 }}
          placeholder="Chọn buổi"
        >
          {sessionOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        
        <Button 
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          title="Làm mới dữ liệu"
        >
          Làm mới
        </Button>
        
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept=".xlsx,.xls"
        >
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            loading={uploading}
          >
            {uploading ? 'Đang import...' : 'Import Excel'}
          </Button>
        </Upload>
      </Space>
    </div>
  );
};

export default Header;