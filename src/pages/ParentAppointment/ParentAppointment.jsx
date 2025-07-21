import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MessageSquare, ExternalLink, CheckCircle, AlertCircle, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://wdp301-se1752-be.onrender.com/api";

const ParentAppointment = () => {
  const [appointmentTime, setAppointmentTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState(30);
  const [notification, setNotification] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy parentId từ localStorage (giả sử user object có id)
  const getParentId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "";
    try {
      const user = JSON.parse(userStr);
      return user.id || user.parentId || "";
    } catch {
      return "";
    }
  };

  const getToken = () => localStorage.getItem("access_token");  // Fetch lịch hẹn của phụ huynh
  const fetchAppointments = useCallback(async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/appointment/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const allAppointments = Array.isArray(data.data) ? data.data : [];
    
    // Filter to show only future appointments (from now onwards)
    const now = new Date();
    const futureAppointments = allAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return appointmentDate >= now;
    });
    
    // Sort by appointment time (earliest first)
    futureAppointments.sort((a, b) => {
      return new Date(a.appointmentTime) - new Date(b.appointmentTime);
    });
    
    setAppointments(futureAppointments);
  }, []);
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Tạo lịch hẹn mới
  const handleCreateAppointment = async () => {
    if (!appointmentTime || !purpose) {
      setNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    setIsLoading(true);
    const token = getToken();
    const parentId = getParentId();
    const body = {
      appointmentTime,
      purpose,
      parentId: String(parentId),
      duration: Number(duration)
    };
    
    try {
      const res = await fetch(`${API_URL}/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setNotification("Đã tạo lịch hẹn thành công!");
        setAppointmentTime("");
        setPurpose("");
        setDuration(30);
        fetchAppointments();      } else {
        setNotification("Tạo lịch hẹn thất bại!");
      }
    } catch {
      setNotification("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
    
    setTimeout(() => setNotification(""), 4000);
  };

  // Format ngày giờ
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", { 
      hour12: false,
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, text: 'Đã xác nhận' };
      case 'scheduled':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle, text: 'Đã lên lịch' };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertCircle, text: 'Chờ xác nhận' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, text: 'Đã hủy' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertCircle, text: status || 'Chưa rõ' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Đặt lịch hẹn tư vấn
          </h1>
          <p className="text-gray-600 text-lg">Kết nối trực tiếp với chuyên gia tư vấn giáo dục</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 transition-all duration-300 ${
            notification.includes('thành công') 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {notification.includes('thành công') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form tạo lịch hẹn */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tạo lịch hẹn mới</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Thời gian hẹn
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={appointmentTime}
                  onChange={e => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Mục đích tư vấn
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="Ví dụ: Tư vấn hướng nghiệp cho con..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Thời lượng
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  required
                >
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>60 phút</option>
                  <option value={90}>90 phút</option>
                </select>
              </div>

              <button
                onClick={handleCreateAppointment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Đặt lịch hẹn
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Danh sách lịch hẹn */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Lịch hẹn sắp tới</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Không có lịch hẹn sắp tới</p>
                  <p className="text-gray-400 text-sm mt-1">Hãy tạo lịch hẹn mới cho thời gian tương lai</p>
                </div>
              ) : (
                appointments.map(app => {
                  const statusInfo = getStatusInfo(app.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                            <span className="font-semibold text-gray-700">Thời gian:</span>
                          </div>
                          <span className="text-gray-900 font-medium">{formatDate(app.appointmentTime)}</span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                            <span className="font-semibold text-gray-700">Mục đích:</span>
                          </div>
                          <span className="text-gray-900 text-right max-w-xs">{app.purpose}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Thời lượng:</span>
                          </div>
                          <span className="text-gray-900">{app.duration} phút</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Trạng thái:</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.text}
                          </span>
                        </div>

                        {app.googleMeetLink && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <a 
                              href={app.googleMeetLink} 
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Tham gia cuộc họp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAppointment;