import React from 'react';
import healthcareimg from '../../assets/healthcare.png'; 
import pro5 from '../../assets/homepage/pro5.png';
import qlythuoc from '../../assets/homepage/qlythuoc.png';
import tiemchung from '../../assets/homepage/tiemchung.png';
import lichsu from '../../assets/homepage/lichsu.png';
import baomat from '../../assets/homepage/baomat.png';
import truycap from '../../assets/homepage/truycap.png';

const features = [
  {
    img: pro5,
    title: 'Hồ Sơ Sức Khỏe Toàn Diện',
    desc: 'Lưu trữ toàn bộ lịch sử y tế, dị ứng và thông tin sức khỏe quan trọng trong một nơi an toàn và dễ dàng truy cập.',
  },
  {
    img: qlythuoc,
    title: 'Quản Lý Thuốc Tiện Lợi',
    desc: 'Theo dõi liều dùng, tần suất và nhận nhắc nhở bổ sung thuốc đúng hạn.',
  },
  {
    img: tiemchung,
    title: 'Nhắc Nhở Tiêm Chủng Chính Xác',
    desc: 'Không bỏ lỡ bất kỳ mũi tiêm nào với các cảnh báo kịp thời và theo dõi dễ dàng.',
  },
  {
    img: lichsu,
    title: 'Lịch Sử Sức Khỏe Theo Thời Gian',
    desc: 'Theo dõi quá trình phát triển sức khỏe của con bạn qua từng giai đoạn.',
  },
  {
    img: baomat,
    title: 'Bảo Mật An Toàn Tuyệt Đối',
    desc: 'Dữ liệu sức khỏe được bảo vệ bằng công nghệ bảo mật tiên tiến nhất hiện nay.',
  },
  {
    img: truycap,
    title: 'Truy Cập Mọi Lúc, Mọi Nơi',
    desc: 'Thông tin quan trọng luôn sẵn sàng trên mọi thiết bị bạn sử dụng.',
  },
];



const reasons = [
  { title: 'Giảm Áp Lực', desc: 'Tập trung mọi thông tin và lịch hẹn sức khỏe giúp bạn yên tâm hơn.' },
  { title: 'Tuân Thủ Lịch Tiêm Chủng', desc: 'Luôn theo sát và cập nhật đúng lịch tiêm và đơn thuốc.' },
  { title: 'Tăng Cường Giao Tiếp', desc: 'Chia sẻ dễ dàng thông tin sức khỏe với bác sĩ và chuyên gia.' },
  { title: 'Chủ Động Chăm Sóc Sức Khỏe', desc: 'Phân tích xu hướng sức khỏe để đưa ra quyết định hợp lý.' },
  { title: 'An Tâm Tuyệt Đối', desc: 'Mọi dữ liệu được tổ chức khoa học, luôn sẵn sàng khi bạn cần.' },
];

const Homepage = () => {
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#223A6A' }}>
      
      <section
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '120px 24px 100px',
          textAlign: 'center',
          color: 'white',
          fontWeight: '700',
          textShadow: '0 0 8px rgba(0,0,0,0.5)',
        }}
      >
        <h1 style={{ fontSize: '38px', maxWidth: '700px', margin: '0 auto' }}>
          Trao Quyền Cho Phụ Huynh – Chăm Sóc Trẻ Em Khỏe Mạnh Hơn
        </h1>
        <p style={{ fontWeight: '400', marginTop: '16px', fontSize: '18px' }}>
          Theo dõi, quản lý và bảo vệ sức khỏe con bạn một cách dễ dàng và hiệu quả.
        </p>
        <p style={{ fontWeight: '400', fontSize: '15px', marginTop: '8px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Ứng dụng Theo Dõi Sức Khỏe Học Sinh giúp đơn giản hóa việc quản lý hồ sơ y tế, thuốc men và tiêm chủng, mang lại sự an tâm tuyệt đối cho gia đình bạn.
        </p>
        <button
          style={{
            marginTop: '30px',
            backgroundColor: '#407CE2',
            color: 'white',
            border: 'none',
            padding: '14px 36px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#223A6A')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#407CE2')}
        >
          Bắt Đầu Ngay
        </button>
      </section>

      {/* Key Features */}
<section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
  <h2 style={{ fontWeight: '700', fontSize: '24px', textAlign: 'center', marginBottom: '48px', color: '#223A6A' }}>Tính Năng Nổi Bật</h2>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '32px',
    }}
  >
    {features.map(({ img, title, desc }) => (
      <div
        key={title}
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px 20px',
          textAlign: 'center',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(64, 124, 226, 0.1)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <img src={img} alt={title} style={{ width: '84px', height: '84px', objectFit: 'contain', marginBottom: '16px' }} />
        <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '12px', color: '#407CE2' }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{desc}</p>
      </div>
    ))}
  </div>
</section>

      <section
        style={{
          padding: '0 24px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '48px',
          alignItems: 'center',
          color: '#223A6A',
        }}
      >
        <div style={{ flex: '1 1 420px', minWidth: '320px' }}>
          <h2 style={{ fontWeight: '700', fontSize: '22px', marginBottom: '20px', color: '#223A6A' }}>
            Tại Sao Nên Chọn Ứng Dụng Theo Dõi Sức Khỏe Học Sinh?
          </h2>
          <p style={{ fontSize: '15px', color: '#374151', marginBottom: '32px' }}>
            Giúp bạn chủ động và tổ chức tốt hơn trong việc chăm sóc sức khỏe con yêu. Trải nghiệm sự tiện lợi với tất cả thông tin quan trọng trong tầm tay.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '20px' }}>
            {reasons.map(({ title, desc }) => (
              <div
                key={title}
                style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 6px rgba(34, 58, 106, 0.1)',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(64, 124, 226, 0.25)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(34, 58, 106, 0.1)')}
              >
                <h4 style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', color: '#407CE2' }}>{title}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 420px', minWidth: '320px' }}>
          <img
            src={healthcareimg}
            style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(34, 58, 106, 0.15)' }}
          />
        </div>
      </section>

<section
  style={{
    background: 'linear-gradient(90deg, #223A6A 0%, #407CE2 100%)',
    color: 'white',
    textAlign: 'center',
    padding: '48px 24px',
    fontWeight: '700',
  }}
>
  <h2 style={{ fontSize: '22px', marginBottom: '14px' }}>Sẵn Sàng Làm Chủ Sức Khỏe?</h2>
  <p style={{ fontWeight: '400', fontSize: '16px', marginBottom: '28px' }}>
    Tham gia cùng hàng ngàn phụ huynh đang đơn giản hóa việc quản lý sức khỏe cho con em mình mỗi ngày.
  </p>
  <button
    style={{
      backgroundColor: '#407CE2',
      color: 'white',
      border: 'none',
      padding: '14px 40px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
    }}
    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1b2a52')}
    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#407CE2')}
  >
    Tham Gia Ngay
  </button>
</section>

    </div>
  );
};

export default Homepage;
