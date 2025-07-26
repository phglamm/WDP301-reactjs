import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Check, Clock, AlertCircle, User, Stethoscope, DollarSign } from 'lucide-react';
import { Modal } from 'antd';

const VaccineReminder = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [schoolVaccines, setSchoolVaccines] = useState([]);
  const [completedVaccines, setCompletedVaccines] = useState([]);
  const [form, setForm] = useState({ vaccinationId: '', doses: 1 });
  const [notification, setNotification] = useState('');
  const [injectionEvents, setInjectionEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [registeredVaccines, setRegisteredVaccines] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

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

  // Function to get vaccine type display
  const getVaccineTypeDisplay = (vaccination) => {
    if (!vaccination) return { label: 'Chưa xác định', color: 'gray', icon: '❓' };
    
    const type = vaccination.type?.toLowerCase();
    switch (type) {
      case 'free':
        return { 
          label: 'Miễn phí', 
          color: 'green', 
          icon: '🆓',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'paid':
        return { 
          label: 'Trả phí', 
          color: 'orange', 
          icon: '💰',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200'
        };
      default:
        return { 
          label: 'Chưa xác định', 
          color: 'gray', 
          icon: '❓',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Function to format price display
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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

  // Fetch injection events
  const fetchInjectionEvents = async () => {
    try {
      console.log('Fetching injection events...');
      const res = await fetch(`${API_URL}/injection-event/available`);
      const data = await res.json();
      console.log('Injection events API response:', data);
      
      const events = Array.isArray(data.data) ? data.data : [];
      setInjectionEvents(events);
      console.log('Set injection events:', events);
      return events;
    } catch (error) {
      console.error('Error fetching injection events:', error);
      setInjectionEvents([]);
      return [];
    }
  };

  const fetchRegisteredVaccines = async (studentId) => {
    try {
      console.log('Fetching registered vaccines for student:', studentId);
      const res = await fetch(`${API_URL}/vaccination/student/${studentId}`);
      const data = await res.json();
      console.log('Registered vaccines API response:', data);
      
      const vaccines = Array.isArray(data.data) ? data.data : [];
      setRegisteredVaccines(vaccines);
      return vaccines;
    } catch (error) {
      console.error('Error fetching registered vaccines:', error);
      setRegisteredVaccines([]);
      return [];
    }
  };

  // Fetch registered events using injection-record API
  const fetchRegisteredEvents = async (studentId) => {
    try {
      console.log('Fetching registered events for student:', studentId);
      const res = await fetch(`${API_URL}/injection-record/student/${studentId}`);
      const data = await res.json();
      console.log('Registered events API response:', data);
      
      const events = Array.isArray(data.data) ? data.data : [];
      setRegisteredEvents(events);
      console.log('Set registered events:', events);
      return events;
    } catch (error) {
      console.error('Error fetching registered events:', error);
      setRegisteredEvents([]);
      return [];
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSchoolVaccines();
    fetchInjectionEvents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentVaccines(selectedStudent);
      fetchRegisteredVaccines(selectedStudent);
      fetchRegisteredEvents(selectedStudent);
      
      // Debug log to help identify data structure
      console.log('Selected student:', selectedStudent);
    } else {
      setCompletedVaccines([]);
      setRegisteredVaccines([]);
      setRegisteredEvents([]);
    }
  }, [selectedStudent]);

  // Debug effect to log data changes
  useEffect(() => {
    if (selectedStudent && registeredEvents.length > 0) {
      console.log('Registered Events Structure:', registeredEvents);
      console.log('Injection Events Structure:', injectionEvents);
    }
  }, [registeredEvents, injectionEvents, selectedStudent]);

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

  // Filter available events - exclude events for vaccines that student has already completed
  const getAvailableEvents = () => {
    if (!selectedStudent || !injectionEvents.length) return [];
    
    console.log('=== FILTERING AVAILABLE EVENTS ===');
    console.log('Injection Events:', injectionEvents);
    console.log('Registered Events:', registeredEvents);
    console.log('Completed Vaccines:', completedVaccines);
    
    const availableEvents = injectionEvents.filter(event => {
      console.log(`\n--- Checking Event ID: ${event.id} ---`);
      console.log('Event details:', event);
      
      // Check if student has already registered for this event
      const isAlreadyRegistered = registeredEvents.some(registeredEvent => {
        console.log('Comparing with registered event:', registeredEvent);
        
        // Multiple ways to check registration
        const matches = [
          String(registeredEvent.injectionEventId) === String(event.id),
          String(registeredEvent.id) === String(event.id),
          registeredEvent.injectionEvent && String(registeredEvent.injectionEvent.id) === String(event.id),
          // Check by vaccination name as fallback
          (registeredEvent.injectionEvent?.vaccination?.name || registeredEvent.injectionEvent?.name) === 
          (event.vaccination?.name || event.name)
        ];
        
        const isMatch = matches.some(match => match);
        console.log('Registration matches:', matches, '-> isMatch:', isMatch);
        return isMatch;
      });
      
      // Check if student has already completed this vaccine
      const hasCompletedVaccine = completedVaccines.some(completedVaccine => {
        const eventVaccinationId = event.vaccination?.id || event.vaccinationId;
        const completedVaccinationId = completedVaccine.vaccination?.id;
        const match = String(eventVaccinationId) === String(completedVaccinationId);
        console.log('Vaccine completion check:', { eventVaccinationId, completedVaccinationId, match });
        return match;
      });
      
      const shouldShow = !isAlreadyRegistered && !hasCompletedVaccine;
      console.log(`Event ${event.id} - Registered: ${isAlreadyRegistered}, Completed: ${hasCompletedVaccine}, Show: ${shouldShow}`);
      
      return shouldShow;
    });
    
    console.log('Available events after filtering:', availableEvents.length);
    return availableEvents;
  };

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

        {/* Khai báo vaccine đã tiêm ngoài + Đăng ký tiêm chủng cho học sinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Khai báo vaccine đã tiêm ngoài */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-1">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Khai báo vaccine đã tiêm ngoài</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                type="number"
                min={1}
                value={form.doses}
                onChange={e => setForm(f => ({ ...f, doses: e.target.value }))}
                placeholder="Số mũi"
                required
              />
              <button
                type="button"
                onClick={async () => {
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
                  if (res.ok) {
                    setNotification('Khai báo thành công!');
                    fetchStudentVaccines(selectedStudent);
                  } else {
                    setNotification('Vaccine đã được khai báo');
                  }
                  setTimeout(() => setNotification(''), 4000);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
              >
                Khai báo
              </button>
            </div>
          </div>

          {/* Đăng ký tiêm chủng cho học sinh + Đã đăng ký tiêm chủng */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">Đăng ký tiêm chủng cho học sinh</h2>
                {selectedStudent && (
                  <button
                    onClick={async () => {
                      console.log('Force refreshing data...');
                      await Promise.all([
                        fetchRegisteredEvents(selectedStudent),
                        fetchStudentVaccines(selectedStudent),
                        fetchRegisteredVaccines(selectedStudent),
                        fetchInjectionEvents()
                      ]);
                      setNotification('Đã làm mới dữ liệu!');
                      setTimeout(() => setNotification(''), 2000);
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition text-sm"
                  >
                    🔄 Làm mới
                  </button>
                )}
              </div>
              {selectedStudent ? (
                <>
                  {getAvailableEvents().length === 0 ? (
                    <div className="text-gray-500">
                      {completedVaccines.length > 0 
                        ? "Học sinh đã hoàn thành tất cả các vaccine có sẵn hoặc đã đăng ký tất cả các sự kiện."
                        : "Hiện không có sự kiện tiêm chủng nào đang mở đăng ký."
                      }
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getAvailableEvents().map(event => {
                        const typeInfo = getVaccineTypeDisplay(event.vaccination);
                        return (
                          <div key={event.id} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all duration-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-medium text-blue-800">
                                    {event.vaccination?.name ? event.vaccination.name : (event.name ? event.name : 'Sự kiện tiêm chủng')}
                                  </h3>
                                  
                                  {/* Vaccine type badge */}
                                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${typeInfo.bgColor} ${typeInfo.textColor} ${typeInfo.borderColor}`}>
                                    <span>{typeInfo.icon}</span>
                                    <span>{typeInfo.label}</span>
                                  </div>
                                </div>
                                
                                <div className="text-gray-600 text-sm mb-1">{event.description}</div>
                                <div className="text-gray-500 text-xs mb-1">Thời gian: {event.date ? formatDate(event.date) : ''}</div>
                                
                                {/* Price information */}
                                {event.vaccination?.type === 'paid' && event.price && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <DollarSign className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-700 font-semibold text-sm">
                                      Phí: {formatPrice(event.price)}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="text-gray-400 text-xs mt-1">ID: {event.id}</div>
                                
                                {event.vaccination?.type === 'free' && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700 font-semibold text-sm">
                                      Miễn phí tiêm chủng
                                    </span>
                                  </div>
                                )}
                                
                                {/* Additional info for paid vaccines */}
                                {/* {event.vaccination?.type === 'paid' && (
                                  <div className="flex items-center gap-2 mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-700 text-sm font-medium">
                                      Vui lòng liên hệ nhà trường để đăng ký vaccine trả phí
                                    </span>
                                  </div>
                                )} */}
                              </div>
                              
                              {event.vaccination?.type === 'paid' ? (
                                <button
                                  className="mt-3 md:mt-0 md:ml-4 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed font-semibold shadow flex items-center gap-2 opacity-60"
                                  disabled
                                  title="Tính năng đăng ký vaccine trả phí đang được phát triển"
                                >
                                  <Clock className="w-4 h-4" />
                                  Sẽ cập nhật sau
                                </button>
                              ) : (
                                <button
                                  className="mt-3 md:mt-0 md:ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold shadow flex items-center gap-2"
                                  onClick={() => { setSelectedEvent(event); setShowRegisterModal(true); }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Đăng ký
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500">Vui lòng chọn học sinh để đăng ký tiêm chủng.</div>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">Đã đăng ký tiêm chủng</h2>
                {selectedStudent && registeredEvents.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Tổng cộng: {registeredEvents.length} vaccine
                    </div>
                  </div>
                )}
              </div>
              {!selectedStudent ? (
                <div className="text-gray-500">Vui lòng chọn học sinh để xem danh sách đã đăng ký.</div>
              ) : registeredEvents.length === 0 ? (
                <div className="text-gray-500">Chưa đăng ký sự kiện tiêm chủng nào.</div>
              ) : (
                <div className="space-y-3">
                  {registeredEvents.map(event => {
                    const typeInfo = getVaccineTypeDisplay(event.injectionEvent?.vaccination);
                    return (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-blue-800">
                              {event.injectionEvent?.vaccination?.name || event.injectionEvent?.name || 'Sự kiện tiêm chủng'}
                            </h3>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${typeInfo.bgColor} ${typeInfo.textColor} ${typeInfo.borderColor}`}>
                              <span>{typeInfo.icon}</span>
                              <span>{typeInfo.label}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.injectionEvent?.description || ''}
                          </p>
                          <p className="text-sm text-gray-500">
                            Thời gian: {event.injectionEvent?.date ? formatDate(event.injectionEvent.date) : ''}
                          </p>
                          {event.injectionEvent?.vaccination?.type === 'paid' && event.injectionEvent?.price && (
                            <p className="text-sm text-orange-700 font-medium">
                              Phí: {formatPrice(event.injectionEvent.price)}
                            </p>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Đã đăng ký</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hiển thị danh sách vaccine đã hoàn thành */}
        {selectedStudent && completedVaccines.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-900">Vaccine đã hoàn thành</h2>
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Đã hoàn thành: {completedVaccines.length} vaccine
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedVaccines.map(vaccine => {
                const typeInfo = getVaccineTypeDisplay(vaccine.vaccination);
                return (
                  <div key={vaccine.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-green-800">{vaccine.vaccination?.name}</h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${typeInfo.bgColor} ${typeInfo.textColor} ${typeInfo.borderColor}`}>
                            <span>{typeInfo.icon}</span>
                            <span>{typeInfo.label}</span>
                          </div>
                        </div>
                        <p className="text-sm text-green-600">{vaccine.vaccination?.description}</p>
                        <p className="text-xs text-gray-500">Số mũi: {vaccine.doses}</p>
                      </div>
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal xác nhận đăng ký */}
        <Modal
          open={showRegisterModal}
          onCancel={() => setShowRegisterModal(false)}
          onOk={async () => {
            if (!selectedStudent || !selectedEvent) return;
            
            try {
              setShowRegisterModal(false);
              setNotification('Đang xử lý đăng ký...');
              
              const token = localStorage.getItem('access_token');
              console.log('Registering with data:', {
                studentId: String(selectedStudent),
                injectionEventId: String(selectedEvent.id)
              });
              
              const res = await fetch(`${API_URL}/injection-event/register`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  studentId: String(selectedStudent),
                  injectionEventId: String(selectedEvent.id)
                })
              });

              const responseData = await res.json().catch(() => ({}));
              console.log('Registration API response:', {
                status: res.status,
                ok: res.ok,
                data: responseData
              });

              if (res.ok) {
                setNotification('Đăng ký tiêm chủng thành công!');
                
                // Add a small delay to ensure server has processed the registration
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Force refresh all data with proper async handling
                console.log('Refreshing data after successful registration...');
                await Promise.all([
                  fetchRegisteredEvents(selectedStudent),
                  fetchStudentVaccines(selectedStudent),
                  fetchRegisteredVaccines(selectedStudent),
                  fetchInjectionEvents()
                ]);
                
                console.log('All data refreshed successfully');
                
                // Force component re-render by updating a dummy state
                setSelectedEvent(null);
                
              } else if (res.status === 400) {
                const errorMessage = responseData.message || 'Đã đăng ký tiêm chủng cho học sinh này rồi';
                setNotification(errorMessage);
                console.log('Registration failed - already registered:', errorMessage);
              } else if (res.status === 409) {
                setNotification('Học sinh đã đăng ký sự kiện này rồi');
              } else {
                const errorMessage = responseData.message || 'Đăng ký tiêm chủng thất bại!';
                setNotification(errorMessage);
                console.error('Registration failed:', res.status, responseData);
              }
            } catch (error) {
              console.error('Registration error:', error);
              setNotification('Có lỗi xảy ra khi đăng ký! Vui lòng thử lại.');
            }
            
            setTimeout(() => setNotification(''), 4000);
          }}
          okText="Xác nhận đăng ký"
          cancelText="Hủy"
          title="Xác nhận đăng ký tiêm chủng"
          okButtonProps={{ loading: false }}
        >
          <div className="space-y-4">
            <p>Bạn có chắc chắn muốn đăng ký sự kiện tiêm chủng này cho học sinh đã chọn?</p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold text-blue-800">
                  {selectedEvent?.vaccination?.name || selectedEvent?.name || 'Sự kiện tiêm chủng'}
                </div>
                {selectedEvent?.vaccination && (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getVaccineTypeDisplay(selectedEvent.vaccination).bgColor} ${getVaccineTypeDisplay(selectedEvent.vaccination).textColor} ${getVaccineTypeDisplay(selectedEvent.vaccination).borderColor}`}>
                    <span>{getVaccineTypeDisplay(selectedEvent.vaccination).icon}</span>
                    <span>{getVaccineTypeDisplay(selectedEvent.vaccination).label}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-blue-600 mb-2">
                {selectedEvent?.description}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Thời gian: {selectedEvent?.date ? formatDate(selectedEvent.date) : 'Chưa xác định'}
              </div>
              
              {/* Price information in modal */}
              {selectedEvent?.vaccination?.type === 'paid' && selectedEvent?.price && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-700 font-semibold text-sm">
                    Phí tiêm chủng: {formatPrice(selectedEvent.price)}
                  </span>
                </div>
              )}
              
              {selectedEvent?.vaccination?.type === 'free' && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200 mb-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-semibold text-sm">
                    Tiêm chủng miễn phí
                  </span>
                </div>
              )}
              
              <div className="text-xs text-gray-400">
                ID sự kiện: {selectedEvent?.id}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="font-medium text-green-800">
                Học sinh: {students.find(s => s.id == selectedStudent)?.fullName}
              </div>
              <div className="text-sm text-green-600">
                Lớp: {students.find(s => s.id == selectedStudent)?.class}
              </div>
            </div>
            
            {selectedEvent?.vaccination?.type === 'paid' && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div className="font-medium text-yellow-800">Lưu ý quan trọng</div>
                </div>
                <div className="text-sm text-yellow-700">
                  Đây là vaccine trả phí. Vui lòng chuẩn bị thanh toán khi đến tiêm chủng.
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default VaccineReminder;