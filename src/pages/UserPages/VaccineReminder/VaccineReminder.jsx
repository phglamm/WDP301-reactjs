import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Check, Clock, AlertCircle, User, Stethoscope } from 'lucide-react';

const VaccineReminder = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [schoolVaccines, setSchoolVaccines] = useState([]);
  const [completedVaccines, setCompletedVaccines] = useState([]);
  const [form, setForm] = useState({ vaccinationId: '', doses: 1 });
  const [notification, setNotification] = useState('');


  // Tạo calendar cho tháng hiện tại
  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Thêm các ngày trống ở đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayStatus = (day) => {
    if (!day) return '';
    const today = new Date();
    const currentDay = new Date(today.getFullYear(), today.getMonth(), day);
    
    // Kiểm tra xem có vaccine nào trong ngày này không
    const hasVaccine = schoolVaccines.some(vaccine => {
      const vaccineDate = new Date(vaccine.date);
      return vaccineDate.toDateString() === currentDay.toDateString();
    });
    
    if (hasVaccine) return 'has-vaccine';
    if (currentDay.toDateString() === today.toDateString()) return 'today';
    return '';
  };

  // Tính toán thống kê
  // const overdueCount = upcomingVaccines.filter(v => v.overdue).length;
  // const upcomingCount = upcomingVaccines.filter(v => !v.overdue).length;
  // const completedCount = completedVaccines.length;

  const API_URL = import.meta.env.VITE_API_URL || 'https://wdp301-se1752-be.onrender.com/api';

  const fetchStudents = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/student/parent`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStudents(Array.isArray(data.data) ? data.data : []);
  };

  const fetchSchoolVaccines = async () => {
    const res = await fetch(`${API_URL}/vaccination`);
    const data = await res.json();
    setSchoolVaccines(Array.isArray(data.data) ? data.data : []);
  };

  const fetchStudentVaccines = async (studentId) => {
    const res = await fetch(`${API_URL}/vaccination/student/${studentId}`);
    const data = await res.json();
    setCompletedVaccines(Array.isArray(data.data) ? data.data : []);
  };

  useEffect(() => {
    fetchStudents();
    fetchSchoolVaccines();
  }, []);

  useEffect(() => {
    if (selectedStudent) fetchStudentVaccines(selectedStudent);
    else setCompletedVaccines([]);
  }, [selectedStudent]);

  const submitExternalVaccine = async (studentId, vaccinationId, doses) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/vaccination/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ studentId, vaccinationId, doses })
    });
    // Xử lý response...
  };

  const upcomingVaccines = schoolVaccines;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        {notification && (
          <div className="fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg bg-green-500 text-white">
            {notification}
          </div>
        )}
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#223A6A'}}>
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Theo dõi Tiêm chủng</h1>
                <p className="text-gray-600">Quản lý lịch tiêm vaccine cho con em</p>
              </div>
            </div>
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
              style={{backgroundColor: '#407CE2'}}
            >
              <Plus className="w-5 h-5" />
              <span>Thêm lịch mới</span>
            </button>
          </div>
        </div>

        {/* Student Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#223A6A' }}>
              <User className="w-5 h-5" style={{ color: '#407CE2' }} />
              Chọn học sinh
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Tất cả option */}
              <div 
                onClick={() => setSelectedStudent('')}
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
                  onClick={() => {
                    setSelectedStudent(student.id);
                    fetchStudentVaccines(student.id);
                  }}
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cần tiêm</p>
                <p className="text-3xl font-bold text-orange-500">{/*overdueCount*/}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sắp tới (30 ngày)</p>
                <p className="text-3xl font-bold" style={{color: '#407CE2'}}>{upcomingVaccines.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#407CE2', opacity: 0.1}}>
                <Clock className="w-6 h-6" style={{color: '#407CE2'}} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đã hoàn thành</p>
                <p className="text-3xl font-bold text-green-500">{completedVaccines.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Reminders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Vaccine nhà trường hỗ trợ</h2>
                {selectedStudent !== 'all' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Của:</span>
                    <span className="font-medium text-blue-600">
                      {students.find(s => s.id === selectedStudent)?.name}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {upcomingVaccines.map(vaccine => (
                  <div key={vaccine.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        vaccine.overdue ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <User className={`w-6 h-6 ${vaccine.overdue ? 'text-red-500' : 'text-blue-500'}`} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800">{vaccine.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedStudent === 'all' 
                            ? `Học sinh: ${vaccine.patient}` 
                            : `Loại vaccine: ${vaccine.name.split('(')[0].trim()}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">Ngày: {formatDate(vaccine.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vaccine.overdue 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {vaccine.overdue ? 'Quá hạn' : 'Sắp tới'}
                      </span>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button 
                        className="px-3 py-1 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
                        style={{backgroundColor: vaccine.overdue ? '#EF4444' : '#407CE2'}}
                      >
                        {vaccine.overdue ? 'Đặt lịch ngay' : 'Hoàn thành'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Vaccinations */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Đã tiêm chủng</h2>
                {selectedStudent !== 'all' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Của:</span>
                    <span className="font-medium text-green-600">
                      {students.find(s => s.id === selectedStudent)?.name}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {completedVaccines.map(vaccine => (
                  <div key={vaccine.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {vaccine.vaccination && vaccine.vaccination.name
                            ? vaccine.vaccination.name
                            : 'Không rõ tên vaccine'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vaccine.vaccination && vaccine.vaccination.description
                            ? vaccine.vaccination.description
                            : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          Số mũi đã tiêm: {vaccine.doses}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                        Hoàn thành
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Khai báo vaccine đã tiêm ngoài</h2>
          <form
            className="flex flex-col md:flex-row gap-4 items-center"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedStudent || !form.vaccinationId) {
                setNotification('Vui lòng chọn học sinh và vaccine!');
                return;
              }
              const token = localStorage.getItem('access_token');
              const res = await fetch(`${API_URL}/vaccination/student`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  studentId: String(selectedStudent),
                  vaccinationId: String(form.vaccinationId),
                  doses: Number(form.doses)
                })
              });
              const result = await res.json().catch(() => ({}));
              console.log('Khai báo response:', result);
              if (res.ok) {
                setNotification('Khai báo thành công!');
                fetchStudentVaccines(selectedStudent);
              } else {
                setNotification('Khai báo thất bại!');
              }
              setTimeout(() => setNotification(''), 4000);
            }}
          >
            <select
              className="border rounded-lg px-3 py-2"
              value={form.vaccinationId}
              onChange={e => setForm(f => ({ ...f, vaccinationId: e.target.value }))}
              required
            >
              <option value="">Chọn vaccine</option>
              {schoolVaccines.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <input
              className="border rounded-lg px-3 py-2"
              type="number"
              min={1}
              value={form.doses}
              onChange={e => setForm(f => ({ ...f, doses: e.target.value }))}
              placeholder="Số mũi"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Khai báo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VaccineReminder;