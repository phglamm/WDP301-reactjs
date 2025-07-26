import React from 'react';
import healthcareimg from '../../assets/healthcare.png'; 
import pro5 from '../../assets/homepage/pro5.png';
import qlythuoc from '../../assets/homepage/qlythuoc.png';
import tiemchung from '../../assets/homepage/tiemchung.png';
import lichsu from '../../assets/homepage/lichsu.png';
import baomat from '../../assets/homepage/baomat.png';
import truycap from '../../assets/homepage/truycap.png';
import Footer from '../../components/Footer/Footer';

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

const Homepage = ({ isLoggedIn = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section - Chỉ hiển thị khi chưa đăng nhập */}
      {!isLoggedIn && (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background with overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#223A6A] via-[#407CE2] to-[#5B9BD5] opacity-95"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <span className="text-white/90 text-sm font-medium">✨ Ứng dụng chăm sóc sức khỏe #1 cho gia đình</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Trao Quyền Cho 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Phụ Huynh
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
                Chăm Sóc Trẻ Em Khỏe Mạnh Hơn
              </p>
              
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Theo dõi, quản lý và bảo vệ sức khỏe con bạn một cách dễ dàng và hiệu quả với công nghệ hiện đại nhất.
              </p>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-[#223A6A] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <span className="flex items-center gap-2">
                  Bắt Đầu Ngay
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button className="text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Xem Demo
              </button>
            </div> */}
            
            <div className="mt-12 flex items-center justify-center gap-8 text-white/70">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm">Gia đình tin tùng</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm">Độ tin cậy</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className={`py-20 px-6 bg-white ${isLoggedIn ? 'pt-32' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#223A6A] mb-6">
              Tính Năng 
              <span className="text-[#407CE2]"> Nổi Bật</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng được thiết kế đặc biệt để hỗ trợ phụ huynh chăm sóc sức khỏe con em một cách tốt nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-8 border border-blue-100 hover:border-[#407CE2]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#407CE2] to-[#223A6A] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img src={feature.img} alt={feature.title} className="w-10 h-10 object-contain" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#223A6A] mb-4 group-hover:text-[#407CE2] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-[#407CE2] font-semibold text-sm hover:underline">
                    Tìm hiểu thêm →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-[#407CE2]/10 text-[#407CE2] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ⭐ Tại sao chọn chúng tôi?
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#223A6A] mb-6 leading-tight">
                Ứng Dụng Theo Dõi Sức Khỏe 
                <span className="text-[#407CE2]"> Học Sinh</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Giúp bạn chủ động và tổ chức tốt hơn trong việc chăm sóc sức khỏe con yêu. 
                Trải nghiệm sự tiện lợi với tất cả thông tin quan trọng trong tầm tay.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {reasons.map((reason, index) => (
                  <div
                    key={reason.title}
                    className="bg-white rounded-2xl p-6 border border-blue-100 hover:border-[#407CE2]/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#407CE2] to-[#223A6A] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#223A6A] mb-2 group-hover:text-[#407CE2] transition-colors">
                          {reason.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {reason.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src={healthcareimg}
                  alt="Healthcare App"
                  className="w-full rounded-3xl shadow-2xl object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#407CE2]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#223A6A]/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Chỉ hiển thị khi chưa đăng nhập */}
      {!isLoggedIn && (
        <section className="py-20 px-6 bg-gradient-to-r from-[#223A6A] to-[#407CE2] relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn Sàng Làm Chủ 
              <span className="block text-yellow-300">Sức Khỏe?</span>
            </h2>
            
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn phụ huynh đang đơn giản hóa việc quản lý sức khỏe 
              cho con em mình mỗi ngày.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="group bg-white text-[#223A6A] px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <span className="flex items-center gap-2">
                  Tham Gia Ngay
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button className="text-white border-2 border-white/30 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Liên Hệ Tư Vấn
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span>4.9/5 từ 1,200+ đánh giá</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div>✅ Miễn phí 30 ngày đầu</div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div>🔒 Bảo mật tuyệt đối</div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#223A6A] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Ứng Dụng Theo Dõi Sức Khỏe</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Đồng hành cùng gia đình Việt trong việc chăm sóc và bảo vệ sức khỏe con em.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span>f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span>📱</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span>📧</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Theo dõi sức khỏe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý thuốc</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lịch tiêm chủng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Báo cáo sức khỏe</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2024 Ứng Dụng Theo Dõi Sức Khỏe Học Sinh. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;