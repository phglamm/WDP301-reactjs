import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://wdp301-se1752-be.onrender.com/api";

const ParentAppointment = () => {
  const [appointmentTime, setAppointmentTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState(30);
  const [notification, setNotification] = useState("");
  const [appointments, setAppointments] = useState([]);

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

  // Tạo lịch hẹn mới
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!appointmentTime || !purpose) {
      setNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const token = getToken();
    const parentId = getParentId();
    const body = {
      appointmentTime,
      purpose,
      parentId: String(parentId),
      duration: Number(duration)
    };
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
      fetchAppointments();
    } else {
      setNotification("Tạo lịch hẹn thất bại!");
    }
    setTimeout(() => setNotification(""), 4000);
  };

  // Format ngày giờ
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", { hour12: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Đặt lịch hẹn tư vấn riêng</h1>
        {notification && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 font-medium">{notification}</div>
        )}
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Thời gian hẹn</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={appointmentTime}
              onChange={e => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Mục đích tư vấn</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Nhập mục đích tư vấn"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Thời lượng (phút)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={duration}
              min={10}
              max={120}
              onChange={e => setDuration(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Đặt lịch hẹn
          </button>
        </form>
      </div>

      {/* Danh sách lịch hẹn */}
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Lịch hẹn của bạn</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">Chưa có lịch hẹn nào.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map(app => (
              <li key={app.id} className="border rounded-lg p-4 flex flex-col gap-1">
                <div>
                  <span className="font-semibold text-blue-700">Thời gian:</span> {formatDate(app.appointmentTime)}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Mục đích:</span> {app.purpose}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Thời lượng:</span> {app.duration} phút
                </div>
                {app.googleMeetLink && (
                  <div>
                    <span className="font-semibold text-blue-700">Link tư vấn:</span>{" "}
                    <a href={app.googleMeetLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                      {app.googleMeetLink}
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-blue-700">Trạng thái:</span> {app.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ParentAppointment;