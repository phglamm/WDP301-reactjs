import { Modal, Button, Space, Image, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import RequestStatusTag from "../RequestStatusTag/RequestStatusTag";
const RequestDetailModal = ({ 
  visible, 
  onCancel, 
  request, 
  loading, 
  onApprove, 
  onReject 
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async () => {
    setActionLoading(true);
    const success = await onApprove(request.id);
    if (success) {
      onCancel();
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    const success = await onReject(request.id);
    if (success) {
      onCancel();
    }
    setActionLoading(false);
  };

  if (!request) return null;

  const renderFooter = () => {
    if (request.status === 'pending') {
      return (
        <Space>
          <Button onClick={onCancel}>
            Đóng
          </Button>
          <Button 
            danger
            icon={<CloseOutlined />}
            onClick={handleReject}
            loading={actionLoading}
          >
            Từ chối
          </Button>
          <Button 
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleApprove}
            loading={actionLoading}
          >
            Duyệt yêu cầu
          </Button>
        </Space>
      );
    }
    
    return (
      <Button onClick={onCancel}>
        Đóng
      </Button>
    );
  };

  return (
    <Modal
      title="Chi tiết yêu cầu thuốc"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={renderFooter()}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <span>Đang tải...</span>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          {/* Image Section */}
          {request.image && (
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h4>Hình ảnh đính kèm:</h4>
              <Image
                src={request.image}
                alt="Medicine request image"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </div>
          )}

          {/* Request Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h4>Thông tin yêu cầu:</h4>
              <p><strong>ID:</strong> {request.id}</p>
              <p><strong>Ngày tạo:</strong> {new Date(request.date).toLocaleString('vi-VN')}</p>
              <p><strong>Trạng thái:</strong> 
                <span style={{ marginLeft: '8px' }}>
                  <RequestStatusTag status={request.status} />
                </span>
              </p>
              <p><strong>Ghi chú:</strong> {request.note || 'Không có ghi chú'}</p>
            </div>

            <div>
              <h4>Thông tin học sinh:</h4>
              <p><strong>Mã học sinh:</strong> {request.student?.studentCode || 'N/A'}</p>
              <p><strong>Họ tên:</strong> {request.student?.fullName || 'N/A'}</p>
              <p><strong>Lớp:</strong> {request.student?.class || 'N/A'}</p>
              <p><strong>Địa chỉ:</strong> {request.student?.address || 'N/A'}</p>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h4>Thông tin phụ huynh:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p><strong>Họ tên:</strong> {request.parent?.fullName || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {request.parent?.phone || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {request.parent?.email || 'N/A'}</p>
                <p><strong>Vai trò:</strong> {request.parent?.role || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Slots Information */}
          {request.slots && request.slots.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4>Thông tin slots:</h4>
              {request.slots.map((slot, index) => (
                <div key={index} style={{ 
                  marginBottom: '8px', 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px' 
                }}>
                  <p>Slot {index + 1}: {JSON.stringify(slot)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default RequestDetailModal;