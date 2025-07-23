import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Check, Clock, AlertCircle, User, Stethoscope } from 'lucide-react';
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
    const res = await fetch(`${API_URL}/injection-event/available`);
    const data = await res.json();
    setInjectionEvents(Array.isArray(data.data) ? data.data : []);
  };

  const fetchRegisteredVaccines = async (studentId) => {
    const res = await fetch(`${API_URL}/vaccination/student/${studentId}`);
    const data = await res.json();
    setRegisteredVaccines(Array.isArray(data.data) ? data.data : []);
  };

  // Fetch registered events using injection-record API
  const fetchRegisteredEvents = async (studentId) => {
    const res = await fetch(`${API_URL}/injection-record/student/${studentId}`);
    const data = await res.json();
    setRegisteredEvents(Array.isArray(data.data) ? data.data : []);
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
    } else {
      setCompletedVaccines([]);
      setRegisteredVaccines([]);
      setRegisteredEvents([]);
    }
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

  // Filter available events - only show events that student hasn't registered for
  const getAvailableEvents = () => {
    if (!selectedStudent || !injectionEvents.length) return [];
    
    return injectionEvents.filter(event => {
      // Check if student has already registered for this event
      const isAlreadyRegistered = registeredEvents.some(registeredEvent => 
        String(registeredEvent.injectionEventId) === String(event.id) ||
        String(registeredEvent.id) === String(event.id)
      );
      return !isAlreadyRegistered;
    });
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
              <h2 className="text-xl font-bold text-blue-900 mb-4">Đăng ký tiêm chủng cho học sinh</h2>
              {selectedStudent ? (
                <>
                  {getAvailableEvents().length === 0 ? (
                    <div className="text-gray-500">Hiện không có sự kiện tiêm chủng nào đang mở đăng ký hoặc học sinh đã đăng ký tất cả các sự kiện.</div>
                  ) : (
                    <div className="space-y-4">
                      {getAvailableEvents().map(event => (
                        <div key={event.id} className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all duration-200">
                          <div>
                            <h3 className="font-medium text-blue-800">{event.vaccination?.name ? event.vaccination.name : (event.name ? event.name : 'Sự kiện tiêm chủng')}</h3>
                            <div className="text-gray-600 text-sm">{event.description}</div>
                            <div className="text-gray-500 text-xs">Thời gian: {event.date ? formatDate(event.date) : ''}</div>
                          </div>
                          <button
                            className="mt-2 md:mt-0 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold shadow"
                            onClick={() => { setSelectedEvent(event); setShowRegisterModal(true); }}
                          >
                            Đăng ký
                          </button>
                        </div>
                      ))}
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
                  {registeredEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          {event.injectionEvent?.vaccination?.name || event.injectionEvent?.name || 'Sự kiện tiêm chủng'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {event.injectionEvent?.description || ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          Thời gian: {event.injectionEvent?.date ? formatDate(event.injectionEvent.date) : ''}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Đã đăng ký</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal xác nhận đăng ký */}
        <Modal
          open={showRegisterModal}
          onCancel={() => setShowRegisterModal(false)}
          onOk={async () => {
            if (!selectedStudent || !selectedEvent) return;
            setShowRegisterModal(false);
            const token = localStorage.getItem('access_token');
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
            if (res.ok) {
              setNotification('Đăng ký tiêm chủng thành công!');
              // Refresh the registered events list
              fetchRegisteredEvents(selectedStudent);
            } else if (res.status === 400) {
              setNotification('Đã đăng kí tiêm chủng cho học sinh');
            } else {
              setNotification('Đăng ký tiêm chủng thất bại!');
            }
            setTimeout(() => setNotification(''), 4000);
          }}
          okText="Xác nhận"
          cancelText="Hủy"
          title="Xác nhận đăng ký tiêm chủng"
        >
          <div>Bạn có chắc chắn muốn đăng ký sự kiện tiêm chủng này cho học sinh đã chọn?</div>
          <div className="mt-2 font-semibold text-blue-700">{selectedEvent?.vaccination?.name || selectedEvent?.name}</div>
        </Modal>
      </div>
    </div>
  );
};

export default VaccineReminder;