import { Tag } from 'antd';

const RequestStatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'green', text: 'ĐÃ DUYỆT' };
      case 'rejected':
        return { color: 'red', text: 'TỪ CHỐI' };
      default:
        return { color: 'orange', text: 'CHƯA DUYỆT' };
    }
  };

  const { color, text } = getStatusConfig(status);
  
  return <Tag color={color}>{text}</Tag>;
};

export default RequestStatusTag;