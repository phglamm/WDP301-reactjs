import React, { useState } from 'react';
import { Calendar, Plus, Edit, Check, Clock, AlertCircle, User, Stethoscope } from 'lucide-react';

const VaccineReminder = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('all');
  
  // Dữ liệu học sinh
  const students = [
    { id: 'sophie', name: 'Sophie Miller', age: 8, class: 'Lớp 3A', avatar: '👧' },
    { id: 'john', name: 'John Smith', age: 6, class: 'Lớp 1B', avatar: '👦' }
  ];
  
  // Dữ liệu mẫu cho lịch tiêm chủng
  const allUpcomingVaccines = [
    {
      id: 1,
      name: 'DTaP (Mũi 5)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-11-15',
      status: 'upcoming',
      overdue: false
    },
    {
      id: 2,
      name: 'Polio (Mũi 4)',
      patient: 'John Smith',
      studentId: 'john',
      date: '2024-10-01',
      status: 'overdue',
      overdue: true
    },
    {
      id: 3,
      name: 'Varicella (Mũi 2)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-12-05',
      status: 'upcoming',
      overdue: false
    },
    {
      id: 4,
      name: 'Cúm (Hàng năm)',
      patient: 'John Smith',
      studentId: 'john',
      date: '2024-10-25',
      status: 'upcoming',
      overdue: false
    },
    {
      id: 5,
      name: 'HPV (Mũi 1)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-11-01',
      status: 'upcoming',
      overdue: false
    },
    {
      id: 6,
      name: 'Tdap (Tăng cường)',
      patient: 'John Smith',
      studentId: 'john',
      date: '2024-09-05',
      status: 'overdue',
      overdue: true
    },
    {
      id: 7,
      name: 'Viêm gan B (Mũi 3)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-12-10',
      status: 'upcoming',
      overdue: false
    }
  ];

  const allCompletedVaccines = [
    {
      id: 1,
      name: 'MMR (Mũi 2)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-08-20',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Viêm gan A (Mũi 2)',
      patient: 'John Smith',
      studentId: 'john',
      date: '2024-08-10',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Meningococcal (Mũi 1)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-07-18',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Polio (Mũi 3)',
      patient: 'John Smith',
      studentId: 'john',
      date: '2024-08-15',
      status: 'completed'
    },
    {
      id: 5,
      name: 'Pneumococcal (Mũi 4)',
      patient: 'Sophie Miller',
      studentId: 'sophie',
      date: '2024-10-10',
      status: 'completed'
    }
  ];

  // Lọc dữ liệu theo học sinh được chọn
  const upcomingVaccines = selectedStudent === 'all' 
    ? allUpcomingVaccines 
    : allUpcomingVaccines.filter(vaccine => vaccine.studentId === selectedStudent);
    
  const completedVaccines = selectedStudent === 'all' 
    ? allCompletedVaccines 
    : allCompletedVaccines.filter(vaccine => vaccine.studentId === selectedStudent);

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
    const hasVaccine = upcomingVaccines.some(vaccine => {
      const vaccineDate = new Date(vaccine.date);
      return vaccineDate.toDateString() === currentDay.toDateString();
    });
    
    if (hasVaccine) return 'has-vaccine';
    if (currentDay.toDateString() === today.toDateString()) return 'today';
    return '';
  };

  // Tính toán thống kê
  const overdueCount = upcomingVaccines.filter(v => v.overdue).length;
  const upcomingCount = upcomingVaccines.filter(v => !v.overdue).length;
  const completedCount = completedVaccines.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <User className="w-5 h-5" style={{color: '#223A6A'}} />
            <h2 className="text-lg font-semibold text-gray-800">Chọn học sinh</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStudent('all')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                selectedStudent === 'all' 
                  ? 'text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedStudent === 'all' ? {backgroundColor: '#223A6A'} : {}}
            >
              <span className="text-xl">👨‍👩‍👧‍👦</span>
              <div className="text-left">
                <p className="font-medium">Tất cả</p>
                <p className="text-xs opacity-75">Xem tổng quan</p>
              </div>
            </button>
            
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  selectedStudent === student.id 
                    ? 'text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedStudent === student.id ? {backgroundColor: '#407CE2'} : {}}
              >
                <span className="text-xl">{student.avatar}</span>
                <div className="text-left">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs opacity-75">{student.age} tuổi - {student.class}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cần tiêm</p>
                <p className="text-3xl font-bold text-orange-500">{overdueCount}</p>
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
                <p className="text-3xl font-bold" style={{color: '#407CE2'}}>{upcomingCount}</p>
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
                <p className="text-3xl font-bold text-green-500">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5" style={{color: '#223A6A'}} />
                <h2 className="text-xl font-bold text-gray-800">Lịch tiêm chủng</h2>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Tháng 6, 2025</h3>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((day, index) => (
                  <div 
                    key={index} 
                    className={`
                      h-10 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all
                      ${!day ? 'invisible' : ''}
                      ${getDayStatus(day) === 'today' ? 'bg-blue-500 text-white font-bold' : ''}
                      ${getDayStatus(day) === 'has-vaccine' ? 'bg-red-100 text-red-600 font-medium' : ''}
                      ${getDayStatus(day) === '' ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {completedVaccines.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-gray-500">
                    {selectedStudent === 'all' 
                      ? 'Chưa có vaccine nào được hoàn thành' 
                      : `${students.find(s => s.id === selectedStudent)?.name} chưa hoàn thành vaccine nào`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Lịch tiêm sắp tới</h2>
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
                        <h3 className="font-medium text-gray-800">{vaccine.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedStudent === 'all' 
                            ? `Học sinh: ${vaccine.patient}` 
                            : `Loại vaccine: ${vaccine.name.split('(')[0].trim()}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">Đã tiêm: {formatDate(vaccine.date)}</p>
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
      </div>
    </div>
  );
};

export default VaccineReminder;