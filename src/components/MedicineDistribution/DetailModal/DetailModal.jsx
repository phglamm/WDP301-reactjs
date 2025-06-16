
import { Modal, Descriptions, Tag, Button, Image } from 'antd';

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
      width={800}
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
          <Descriptions.Item label="Mã học sinh">
            {record.medicineRequest?.student?.studentCode}
          </Descriptions.Item>
          <Descriptions.Item label="Tên học sinh">
            {record.medicineRequest?.student?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {record.medicineRequest?.student?.address || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú thuốc" span={2}>
            {record.note || 'Không có ghi chú'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú yêu cầu" span={2}>
            {record.medicineRequest?.note || 'Không có ghi chú'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thuốc">
            <Tag color={record.status ? 'green' : 'red'}>
              {record.status ? 'Đã phát' : 'Chưa phát'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái yêu cầu">
            <Tag color={
              record.medicineRequest?.status === 'approved' ? 'green' : 
              record.medicineRequest?.status === 'rejected' ? 'red' : 'orange'
            }>
              {record.medicineRequest?.status || 'N/A'}
            </Tag>
          </Descriptions.Item>
          {record.medicineRequest?.image && (
            <Descriptions.Item label="Hình ảnh đơn thuốc" span={2}>
              <Image
                width={200}
                src={record.medicineRequest.image}
                alt="Prescription"
                style={{ borderRadius: '4px' }}
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailModal;