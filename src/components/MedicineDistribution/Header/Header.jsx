import { Space, Button, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const sessionOptions = [
  { value: "Sáng", label: "Sáng" },
  { value: "Trưa", label: "Trưa" },
  { value: "Chiều", label: "Chiều" },
];

const Header = ({
  selectedSession,
  onSessionChange,
  loading,
  timeInfo,
  resetToAutoSelection,
}) => {

  return (
    <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
      <h3 className="text-lg font-semibold">Danh sách phân phối thuốc</h3>

      <Space>
        <span className="text-black flex gap-2 items-center">
          <p>Thời gian hiện tại: </p>
          <p className="font-semibold"> {timeInfo.time}</p>
          <p>-</p>
          <p className="font-semibold">{timeInfo.session}</p>
        </span>
        <Select
          value={selectedSession}
          onChange={onSessionChange}
          style={{ width: 150 }}
          placeholder="Chọn buổi"
        >
          {sessionOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={resetToAutoSelection}
          loading={loading}
          title="Làm mới dữ liệu"
          type="primary"
        >
          Làm mới
        </Button>

      </Space>
    </div>
  );
};

export default Header;
