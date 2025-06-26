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
      width={900}
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
              <Descriptions.Item label="Thông tin phân phối thuốc" span={2}>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {request.slots.map((slot, index) => (
                    <div 
                      key={slot.id || index} 
                      style={{ 
                        marginBottom: '16px', 
                        padding: '16px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      {/* Slot Header */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #dee2e6'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                            Buổi {slot.session || 'N/A'}
                          </Tag>
                          <Tag color={slot.status ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                            {slot.status ? 'Đã phát' : 'Chưa phát'}
                          </Tag>
                        </div>
                        <span style={{ fontSize: '12px', color: '#6c757d' }}>
                          ID: {slot.id}
                        </span>
                      </div>

                      {/* Medicines List */}
                      {slot.medicines && slot.medicines.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ 
                            fontWeight: 'bold', 
                            marginBottom: '8px',
                            color: '#495057'
                          }}>
                            Danh sách thuốc:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {slot.medicines.map((medicine, medIndex) => (
                              <div 
                                key={medicine.id || medIndex}
                                style={{
                                  padding: '8px 12px',
                                  backgroundColor: 'white',
                                  borderRadius: '6px',
                                  border: '1px solid #e9ecef',
                                  display: 'grid',
                                  gridTemplateColumns: '2fr 3fr 1fr',
                                  gap: '12px',
                                  alignItems: 'center'
                                }}
                              >
                                <div>
                                  <strong style={{ color: '#007bff' }}>
                                    {medicine.name}
                                  </strong>
                                </div>
                                <div style={{ fontSize: '13px', color: '#6c757d' }}>
                                  {medicine.description || 'Không có hướng dẫn'}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                  <Tag color="purple">
                                    SL: {medicine.quantity}
                                  </Tag>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Slot Notes */}
                      {slot.note && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong>Ghi chú buổi uống:</strong> 
                          <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
                            {slot.note}
                          </span>
                        </div>
                      )}

                      {/* Confirmation Image */}
                      {slot.image && (
                        <div>
                          <strong>Hình ảnh xác nhận:</strong>
                          <br />
                          <Image
                            src={slot.image}
                            alt={`Xác nhận buổi ${slot.session}`}
                            style={{ 
                              maxWidth: '120px', 
                              maxHeight: '120px',
                              marginTop: '8px',
                              borderRadius: '6px',
                              border: '2px solid #28a745'
                            }}
                            preview={{
                              mask: 'Xem ảnh'
                            }}
                          />
                        </div>
                      )}
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