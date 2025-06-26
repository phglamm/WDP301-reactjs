import { Card, Row, Col } from 'antd';

const StatisticsCards = ({ slots, selectedSession, activeCard, onCardClick }) => {
  const totalSlots = slots.length;
  const takenSlots = slots.filter(slot => slot.status).length;
  const notTakenSlots = slots.filter(slot => !slot.status).length;

  const getCardStyle = (cardType) => {
    const isActive = activeCard === cardType;
    
    switch (cardType) {
      case 'all':
        return {
          cursor: 'pointer',
          border: isActive ? '2px solid #1890ff' : '1px solid #d9d9d9',
          backgroundColor: isActive ? '#f0f8ff' : 'white',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        };
      case 'taken':
        return {
          cursor: 'pointer',
          border: isActive ? '2px solid #52c41a' : '1px solid #d9d9d9',
          backgroundColor: isActive ? '#f6ffed' : 'white',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        };
      case 'not-taken':
        return {
          cursor: 'pointer',
          border: isActive ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
          backgroundColor: isActive ? '#fff2f0' : 'white',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        };
      default:
        return {
          border: '1px solid #d9d9d9',
          backgroundColor: 'white',
          borderRadius: '8px'
        };
    }
  };

  return (
    <div className="mb-4">
      <Row gutter={16}>
        <Col span={6}>
          <Card 
            size="small" 
            hoverable
            onClick={() => onCardClick('all')}
            style={getCardStyle('all')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalSlots}
              </div>
              <div className="text-gray-500">Tổng số</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            size="small" 
            hoverable
            onClick={() => onCardClick('taken')}
            style={getCardStyle('taken')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {takenSlots}
              </div>
              <div className="text-gray-500">Đã phát</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            size="small" 
            hoverable
            onClick={() => onCardClick('not-taken')}
            style={getCardStyle('not-taken')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {notTakenSlots}
              </div>
              <div className="text-gray-500">Chưa phát</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            size="small"
            style={getCardStyle('current')}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {selectedSession}
              </div>
              <div className="text-gray-500">Buổi hiện tại</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCards;