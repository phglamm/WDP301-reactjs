import { Modal, Button, Space, Image, Tag, Descriptions } from "antd";
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
          <Descriptions bordered column={2}>
            {/* Request Information */}
            <Descriptions.Item label="ID yêu cầu" span={1}>
              {request.id}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={1}>
              {new Date(request.date).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
              <RequestStatusTag status={request.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú yêu cầu" span={1}>
              {request.note || 'Không có ghi chú'}
            </Descriptions.Item>

            {/* Student Information */}
            <Descriptions.Item label="Mã học sinh" span={1}>
              {request.student?.studentCode || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Tên học sinh" span={1}>
              {request.student?.fullName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Lớp" span={1}>
              <Tag color="blue">{request.student?.class || 'N/A'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính" span={1}>
              {request.student?.gender || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ học sinh" span={2}>
              {request.student?.address || 'N/A'}
            </Descriptions.Item>

            {/* Parent Information */}
            <Descriptions.Item label="Tên phụ huynh" span={1}>
              {request.parent?.fullName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={1}>
              {request.parent?.phone || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email phụ huynh" span={1}>
              {request.parent?.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò" span={1}>
              <Tag color="green">{request.parent?.role || 'N/A'}</Tag>
            </Descriptions.Item>

            {/* Image */}
            {request.image && (
              <Descriptions.Item label="Hình ảnh đơn thuốc" span={2}>
                <Image
                  src={request.image}
                  alt="Medicine request image"
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '200px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                  preview={{
                    mask: 'Xem ảnh lớn'
                  }}
                />
              </Descriptions.Item>
            )}

            {/* Slots Information */}
            {request.slots && request.slots.length > 0 && (
              <Descriptions.Item label="Thông tin thuốc" span={2}>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {request.slots.map((slot, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        marginBottom: '12px', 
                        padding: '12px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '6px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><strong>Buổi:</strong> {slot.session || 'N/A'}</div>
                        <div><strong>Trạng thái:</strong> 
                          <Tag color={slot.status ? 'green' : 'red'} style={{ marginLeft: '4px' }}>
                            {slot.status ? 'Đã phát' : 'Chưa phát'}
                          </Tag>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong>Ghi chú thuốc:</strong> {slot.note || 'Không có ghi chú'}
                        </div>
                        {slot.image && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <strong>Hình ảnh xác nhận:</strong>
                            <br />
                            <Image
                              src={slot.image}
                              alt={`Slot ${index + 1} confirmation`}
                              style={{ 
                                maxWidth: '100px', 
                                maxHeight: '100px',
                                marginTop: '4px',
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
            )}

            {/* Additional Information */}
            {request.createdAt && request.createdAt !== request.date && (
              <Descriptions.Item label="Ngày tạo hệ thống" span={1}>
                {new Date(request.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
            {request.updatedAt && (
              <Descriptions.Item label="Ngày cập nhật" span={1}>
                {new Date(request.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default RequestDetailModal;