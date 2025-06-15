import { Modal, Form, Input, Button, Upload, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const CreateRequestModal = ({ visible, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('studentId', values.studentId);
    formData.append('note', values.note || '');
    
    if (fileList.length > 0) {
      formData.append('image', fileList[0].originFileObj);
    }

    const success = await onSubmit(formData);
    if (success) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file hình ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Hình ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <Modal
      title="Tạo yêu cầu thuốc mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <Form.Item
          label="ID của học sinh"
          name="studentId"
          rules={[
            { required: true, message: 'Vui lòng nhập ID học sinh!' }
          ]}
        >
          <Input placeholder="Nhập ID học sinh" />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="note"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Nhập ghi chú (tùy chọn)"
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
        >
          <Upload
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>
              {fileList.length === 0 ? 'Chọn tệp' : 'Thay đổi tệp'}
            </Button>
          </Upload>
          <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
            {fileList.length === 0 ? 'Không có tệp nào được chọn (Tùy chọn)' : ''}
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              Tạo yêu cầu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRequestModal;