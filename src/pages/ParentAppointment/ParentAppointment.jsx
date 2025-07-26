import React, { useState, useEffect } from "react";
import { Calendar, Clock, MessageSquare, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://wdp301-se1752-be.onrender.com/api";

const ParentAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const getToken = () => localStorage.getItem("access_token");

  // Fetch lịch hẹn của phụ huynh
  const fetchAppointments = async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/appointment/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAppointments(Array.isArray(data.data) ? data.data : []);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
            Lịch hẹn tư vấn
          </h1>
          <p className="text-gray-600 text-lg">Quản lý và theo dõi các cuộc hẹn tư vấn giáo dục</p>
        </div>

        {/* Danh sách lịch hẹn */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Lịch hẹn của bạn</h2>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Chưa có lịch hẹn nào</p>
                <p className="text-gray-400 text-sm mt-1">Liên hệ với chuyên gia để đặt lịch hẹn</p>
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
  );
};

export default ParentAppointment;