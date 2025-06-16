import { Modal, Descriptions, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CheckModal = ({ visible, slot, checkImage, onClose, onConfirm, onImageChange }) => {
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
    
    onImageChange(file);
    return false;
  };

  return (
    <Modal
      title="Xác nhận đã phát thuốc"
      open={visible}
      onCancel={onClose}
      onOk={() => onConfirm(slot, checkImage)}
      okText="Xác nhận"
      cancelText="Hủy"
      width={600}
    >
      {slot && (
        <div>
          <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Học sinh">
              {slot.medicineRequest?.student?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Lớp">
              {slot.className}
            </Descriptions.Item>
            <Descriptions.Item label="Buổi">
              {slot.session}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú thuốc">
              {slot.note || 'Không có ghi chú'}
            </Descriptions.Item>
          </Descriptions>
          
          <div>
            <h4 style={{ marginBottom: 8 }}>Tải lên hình ảnh xác nhận (tùy chọn):</h4>
            <Upload
              beforeUpload={beforeUpload}
              onRemove={() => onImageChange(null)}
              fileList={checkImage ? [checkImage] : []}
              listType="picture-card"
              accept="image/*"
            >
              {!checkImage && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            <p style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
              Hình ảnh xác nhận học sinh đã phát thuốc (không bắt buộc)
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CheckModal;