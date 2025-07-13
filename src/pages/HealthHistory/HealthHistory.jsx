import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Stethoscope, Syringe, Thermometer, ChevronDown, ChevronRight, Eye, User } from 'lucide-react';

const HealthHistory = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historyType, setHistoryType] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [healthHistory, setHealthHistory] = useState([]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('access_token');
    const apiUrl = import.meta.env.VITE_API_URL || 'https://wdp301-se1752-be.onrender.com/api';
    const res = await fetch(`${apiUrl}/student/parent`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStudents(Array.isArray(data.data) ? data.data : []);
  };

  const fetchAccidents = async (studentId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://wdp301-se1752-be.onrender.com/api';
    const res = await fetch(`${apiUrl}/accident/${studentId}`);
    const data = await res.json();
    // Nếu data.data là mảng, set luôn, nếu là object thì cho vào mảng
    if (Array.isArray(data.data)) setHealthHistory(data.data);
    else if (data.data) setHealthHistory([data.data]);
    else setHealthHistory([]);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) fetchAccidents(selectedStudent);
    else setHealthHistory([]);
  }, [selectedStudent]);

  // Dữ liệu mẫu cho các học sinh
  // const students = [
  //   { id: 1, name: 'Nguyễn Minh An', class: 'Lớp 10A1', age: '16 tuổi', avatar: '👦' },
  //   { id: 2, name: 'Trần Thị Bình', class: 'Lớp 8B2', age: '14 tuổi', avatar: '👧' },
  // ];

  // Dữ liệu mẫu lịch sử sức khỏe
  // const healthHistory = [
  //   {
  //     id: 1,
  //     date: '2024-05-10',
  //     type: 'Khám sức khỏe định kỳ',
  //     category: 'Khám bệnh',
  //     description: 'Khám sức khỏe định kỳ hoàn tất. Tất cả chỉ số sinh hiệu bình thường. Đã thảo luận về thói quen ăn uống lành mạnh.',
  //     icon: Stethoscope,
  //     color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  //   },
  //   {
  //     id: 2,
  //     date: '2024-04-25',
  //     type: 'Tiêm phòng cúm',
  //     category: 'Tiêm chủng',
  //     description: 'Đã tiêm vắc-xin cúm mùa. Không có phản ứng phụ. Khuyến cáo theo dõi trong 24h.',
  //     icon: Syringe,
  //     color: 'bg-blue-50 border-blue-200'
  //   },
  //   {
  //     id: 3,
  //     date: '2024-03-15',
  //     type: 'Cảm lạnh thông thường',
  //     category: 'Ốm đau',
  //     description: 'Các triệu chứng bao gồm đau họng, ho và sốt nhẹ. Đã kê đơn thuốc và khuyến cáo nghỉ ngơi.',
  //     icon: Thermometer,
  //     color: 'bg-red-50 text-red-600 border-red-200'
  //   },
  //   {
  //     id: 4,
  //     date: '2024-02-20',
  //     type: 'Khám mắt định kỳ',
  //     category: 'Khám bệnh',
  //     description: 'Kiểm tra thị lực định kỳ. Thị lực ổn định, không cần thay đổi kính. Khuyến cáo hạn chế sử dụng thiết bị điện tử.',
  //     icon: Eye,
  //     color: 'bg-purple-50 text-purple-600 border-purple-200'
  //   }
  // ];

  const historyTypes = [
    'Tất cả',
    'Khám bệnh',
    'Tiêm chủng',
    'Ốm đau',
    'Khám chuyên khoa'
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleApplyFilters = () => {
    console.log('Áp dụng bộ lọc:', { selectedStudent, startDate, endDate, historyType, searchKeywords });
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #223A6A 0%, #407CE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Lịch Sử Sức Khỏe
          </h1>
          <p className="text-gray-600 text-lg">Theo dõi và quản lý lịch sử khám chữa bệnh của học sinh</p>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#223A6A' }}>
              <User className="w-5 h-5" style={{ color: '#407CE2' }} />
              Chọn học sinh
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Tất cả option */}
              <div 
                onClick={() => handleStudentSelect('')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  selectedStudent === '' 
                    ? 'shadow-lg' 
                    : 'border-gray-200 hover:border-opacity-50'
                }`}
                style={{
                  borderColor: selectedStudent === '' ? '#407CE2' : undefined,
                  backgroundColor: selectedStudent === '' ? '#f0f6ff' : undefined,
                  borderWidth: selectedStudent === '' ? '2px' : '1px'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{
                    background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                  }}>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="font-medium" style={{ color: '#223A6A' }}>Tất cả</div>
                  <div className="text-sm text-gray-500">Xem tổng quan</div>
                </div>
              </div>

              {/* Student options */}
              {students.map(student => (
                <div 
                  key={student.id}
                  onClick={() => handleStudentSelect(student.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedStudent == student.id 
                      ? 'shadow-lg' 
                      : 'border-gray-200 hover:border-opacity-50'
                  }`}
                  style={{
                    borderColor: selectedStudent == student.id ? '#407CE2' : undefined,
                    backgroundColor: selectedStudent == student.id ? '#f0f6ff' : undefined,
                    borderWidth: selectedStudent == student.id ? '2px' : '1px'
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{
                      background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                    }}>
                      <span className="text-2xl">{student.avatar}</span>
                    </div>
                    <div className="font-medium" style={{ color: '#223A6A' }}>{student.fullName}</div>
                    <div className="text-sm text-gray-500">{student.age} - {student.class}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#223A6A' }}>Bộ Lọc Tìm Kiếm</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ 
                  background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                }}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {showFilters && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#223A6A' }}>
                      Khoảng thời gian
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ 
                          focusRingColor: '#407CE2',
                          focusBorderColor: '#407CE2'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#407CE2';
                          e.target.style.boxShadow = `0 0 0 2px rgba(64, 124, 226, 0.2)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Từ ngày"
                      />
                      <span className="self-center font-medium" style={{ color: '#407CE2' }}>—</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#407CE2';
                          e.target.style.boxShadow = `0 0 0 2px rgba(64, 124, 226, 0.2)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Đến ngày"
                      />
                    </div>
                  </div>

                  {/* History Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#223A6A' }}>
                      Loại lịch sử
                    </label>
                    <select
                      value={historyType}
                      onChange={(e) => setHistoryType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#407CE2';
                        e.target.style.boxShadow = `0 0 0 2px rgba(64, 124, 226, 0.2)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Tất cả loại</option>
                      {historyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Keywords */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#223A6A' }}>
                      Từ khóa tìm kiếm
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#407CE2' }} />
                      <input
                        type="text"
                        value={searchKeywords}
                        onChange={(e) => setSearchKeywords(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#407CE2';
                          e.target.style.boxShadow = `0 0 0 2px rgba(64, 124, 226, 0.2)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="vd: đau đầu, tiêm phòng"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-2 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{ 
                      background: 'linear-gradient(135deg, #223A6A 0%, #407CE2 100%)'
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    Áp Dụng Bộ Lọc
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Health History List */}
          <div className="p-6">
            <div className="space-y-4">
              {healthHistory.map((accident) => (
                <div key={accident.id} className="border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-opacity-50 transform hover:-translate-y-1" 
                       style={{ 
                         background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                         borderColor: '#e5e7eb'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.borderColor = '#407CE2';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.borderColor = '#e5e7eb';
                       }}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center border-2 shadow-sm bg-red-50 border-red-200">
                          <Thermometer className="w-7 h-7" style={{ color: '#407CE2' }} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold" style={{ color: '#223A6A' }}>
                            {accident.summary || 'Sự cố'}
                          </h3>
                          <span className="text-sm text-gray-500 font-medium">
                            {accident.date ? formatDate(accident.date) : ''}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{accident.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty State */}
            {healthHistory.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                  background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                }}>
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#223A6A' }}>Chưa có lịch sử sức khỏe</h3>
                <p className="text-gray-600">Lịch sử khám chữa bệnh sẽ được hiển thị tại đây khi có dữ liệu.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthHistory;