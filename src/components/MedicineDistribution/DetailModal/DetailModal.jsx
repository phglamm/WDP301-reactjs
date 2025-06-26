import { Modal, Descriptions, Tag, Button, Image, Divider } from 'antd';

const DetailModal = ({ visible, record, onClose, onMarkAsTaken }) => {
  return (
    <Modal
      title="Chi tiết phân phối thuốc"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        !record?.status && (
          <Button 
            key="mark-taken" 
            type="primary" 
            onClick={() => onMarkAsTaken(record)}
          >
            Đánh dấu đã phát
          </Button>
        )
      ].filter(Boolean)}
      width={900}
    >
      {record && (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Lớp" span={1}>
            <Tag color="blue">{record.className}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Buổi" span={1}>
            <Tag color={
              record.session === 'Sáng' ? 'orange' : 
              record.session === 'Trưa' ? 'green' : 'purple'
            }>
              {record.session}
            </Tag>
          </Descriptions.Item>
          
          {/* Student Information */}
          <Descriptions.Item label="Mã học sinh">
            {record.medicineRequest?.student?.studentCode}
          </Descriptions.Item>
          <Descriptions.Item label="Tên học sinh">
            {record.medicineRequest?.student?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {record.medicineRequest?.student?.gender || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {record.medicineRequest?.student?.dob || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {record.medicineRequest?.student?.address || 'N/A'}
          </Descriptions.Item>

          {/* Medicine Information */}
          <Descriptions.Item label="Danh sách thuốc" span={2}>
            {record.medicines && record.medicines.length > 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                padding: '8px 0'
              }}>
                {record.medicines.map((medicine, index) => (
                  <div 
                    key={medicine.id || index}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 3fr 1fr',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ color: '#007bff', fontSize: '14px' }}>
                          {medicine.name}
                        </strong>
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#6c757d',
                        fontStyle: 'italic'
                      }}>
                        {medicine.description || 'Không có hướng dẫn sử dụng'}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Tag color="purple" style={{ margin: 0 }}>
                          SL: {medicine.quantity}
                        </Tag>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Medicine Summary */}
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#e8f4fd',
                  borderRadius: '6px',
                  border: '1px solid #91d5ff'
                }}>
                  <span style={{ fontSize: '12px', color: '#0050b3' }}>
                    <strong>Tổng cộng:</strong> {record.medicines.length} loại thuốc, 
                    {' '}{record.medicines.reduce((total, med) => total + med.quantity, 0)} viên/gói
                  </span>
                </div>
              </div>
            ) : (
              <span style={{ color: '#999', fontStyle: 'italic' }}>
                Không có thông tin thuốc
              </span>
            )}
          </Descriptions.Item>

          {/* Notes */}
          <Descriptions.Item label="Ghi chú buổi uống" span={1}>
            {record.note || 'Không có ghi chú'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú yêu cầu" span={1}>
            {record.medicineRequest?.note || 'Không có ghi chú'}
          </Descriptions.Item>

          {/* Status Information */}
          <Descriptions.Item label="Trạng thái phát thuốc">
            <Tag color={record.status ? 'green' : 'red'}>
              {record.status ? 'Đã phát' : 'Chưa phát'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái yêu cầu">
            <Tag color={
              record.medicineRequest?.status === 'approved' ? 'green' : 
              record.medicineRequest?.status === 'rejected' ? 'red' : 'orange'
            }>
              {record.medicineRequest?.status === 'approved' ? 'Đã duyệt' :
               record.medicineRequest?.status === 'rejected' ? 'Đã từ chối' :
               record.medicineRequest?.status === 'pending' ? 'Chờ duyệt' : 'N/A'}
            </Tag>
          </Descriptions.Item>

          {/* Request Date */}
          <Descriptions.Item label="Ngày tạo yêu cầu" span={2}>
            {record.medicineRequest?.date ? 
              new Date(record.medicineRequest.date).toLocaleString('vi-VN') : 'N/A'
            }
          </Descriptions.Item>

          {/* Images */}
          {record.medicineRequest?.image && (
            <Descriptions.Item label="Hình ảnh đơn thuốc" span={2}>
              <Image
                width={200}
                src={record.medicineRequest.image}
                alt="Prescription"
                style={{ borderRadius: '4px' }}
                preview={{
                  mask: 'Xem ảnh lớn'
                }}
              />
            </Descriptions.Item>
          )}

          {record.image && (
            <Descriptions.Item label="Hình ảnh xác nhận phát thuốc" span={2}>
              <Image
                width={200}
                src={record.image}
                alt="Distribution confirmation"
                style={{ 
                  borderRadius: '4px',
                  border: '2px solid #52c41a'
                }}
                preview={{
                  mask: 'Xem ảnh lớn'
                }}
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailModal;