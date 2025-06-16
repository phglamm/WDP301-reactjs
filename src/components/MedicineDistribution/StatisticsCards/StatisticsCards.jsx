import { Card, Row, Col } from 'antd';

const StatisticsCards = ({ slots, selectedSession, activeCard, onCardClick }) => {
  const totalSlots = slots.length;
  const takenSlots = slots.filter(slot => slot.status).length;
  const notTakenSlots = slots.filter(slot => !slot.status).length;

  const getCardStyle = (cardType) => ({
    cursor: 'pointer',
    border: activeCard === cardType ? '2px solid #1890ff' : '1px solid #d9d9d9',
    backgroundColor: activeCard === cardType ? 
      (cardType === 'all' ? '#f0f8ff' : 
       cardType === 'taken' ? '#f6ffed' : '#fff2f0') : 'white'
  });

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
          <Card size="small">
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