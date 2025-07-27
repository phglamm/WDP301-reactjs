import React, { useState, useEffect } from "react";
import {
  Plus,
  User,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
  History,
  Calendar,
  Clock,
} from "lucide-react";

const DrugInfo = () => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [note, setNote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'history'
  const [medicineHistory, setMedicineHistory] = useState([]);

  // State cho thuốc theo từng buổi
  const [medicineSlots, setMedicineSlots] = useState({
    'Sáng': [{ name: '', description: '', quantity: 1 }],
    'Trưa': [{ name: '', description: '', quantity: 1 }],
    'Chiều': [{ name: '', description: '', quantity: 1 }]
  });

  // Get API base URL from environment
  const getAPIBaseURL = () => {
    return (
      import.meta.env.VITE_API_URL || "https://wdp301-se1752-be.onrender.com"
    );
  };

  // Get token from localStorage (restore original functionality)
  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // Get user info from localStorage (restore original functionality)
  const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Fetch students list and medicine history on component mount
  useEffect(() => {
    fetchStudents();
    if (activeTab === 'history') {
      fetchMedicineHistory();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();

      if (!token) {
        showNotification("error", "Vui lòng đăng nhập lại");
        return;
      }

      const response = await fetch(`${apiUrl}/student/parent`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Students API data:", data);
        
        // Parse data from API response structure shown in image
        if (data.code === 200 && data.status === true && data.data) {
          setStudents(Array.isArray(data.data) ? data.data : []);
          setSelectedStudent(data.data[0]?.id || ""); // Automatically select first student if available
        } else {
          setStudents([]);
          showNotification("error", "Không có dữ liệu học sinh");
        }
      } else if (response.status === 401) {
        showNotification(
          "error",
          "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
        );
      } else {
        showNotification("error", "Không thể tải danh sách học sinh");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification("error", "Lỗi kết nối khi tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicineHistory = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();

      if (!token) {
        showNotification("error", "Vui lòng đăng nhập lại");
        return;
      }

      const response = await fetch(`${apiUrl}/medicine-request/parent`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Medicine history API data:", data);
        
        if (data.code === 200 && data.status === true && data.data) {
          setMedicineHistory(Array.isArray(data.data) ? data.data : []);
        } else {
          setMedicineHistory([]);
        }
      } else if (response.status === 401) {
        showNotification(
          "error",
          "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
        );
      } else {
        showNotification("error", "Không thể tải lịch sử gửi thuốc");
      }
    } catch (error) {
      console.error("Error fetching medicine history:", error);
      showNotification("error", "Lỗi kết nối khi tải lịch sử gửi thuốc");
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file) => {
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();
      
      if (!token) {
        throw new Error("No token available");
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${apiUrl}/medicine-request/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 201 && data.status === true) {
          return data.data.imageUrl || data.data.url; // Return the image URL from response
        }
      }
      
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      try {
        setLoading(true);
        const url = await uploadImageToServer(file);
        setImageUrl(url);
        showNotification('success', 'Upload ảnh thành công');
      } catch (err) {
        showNotification('error', 'Upload ảnh thất bại');
        setImageUrl('');
      } finally {
        setLoading(false);
      }
    }
  };

  // Thêm thuốc cho buổi cụ thể
  const addMedicineToSlot = (slot) => {
    setMedicineSlots(prev => ({
      ...prev,
      [slot]: [...prev[slot], { name: '', description: '', quantity: 1 }]
    }));
  };

  // Xóa thuốc khỏi buổi cụ thể
  const removeMedicineFromSlot = (slot, index) => {
    setMedicineSlots(prev => ({
      ...prev,
      [slot]: prev[slot].filter((_, i) => i !== index)
    }));
  };

  // Cập nhật thông tin thuốc
  const updateMedicine = (slot, index, field, value) => {
    setMedicineSlots(prev => ({
      ...prev,
      [slot]: prev[slot].map((medicine, i) => 
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  const handleSendMedicineRequest = async () => {
    if (!selectedStudent) {
      showNotification("error", "Vui lòng chọn học sinh");
      return;
    }
    if (!imageUrl) {
      showNotification("error", "Vui lòng tải lên hoá đơn thuốc");
      return;
    }

    // Kiểm tra xem có ít nhất một thuốc được điền thông tin
    const hasValidMedicine = Object.entries(medicineSlots).some(([slot, medicines]) => 
      medicines.some(medicine => medicine.name.trim() !== '')
    );

    if (!hasValidMedicine) {
      showNotification("error", "Vui lòng nhập thông tin ít nhất một loại thuốc");
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();

      if (!token) {
        showNotification("error", "Vui lòng đăng nhập lại");
        return;
      }

      // Tạo slots chỉ với những thuốc có tên
      const slots = Object.entries(medicineSlots)
        .map(([session, medicines]) => ({
          session,
          medicines: medicines.filter(medicine => medicine.name.trim() !== '')
            .map(medicine => ({
              name: medicine.name,
              description: medicine.description,
              quantity: Number(medicine.quantity)
            }))
        }))
        .filter(slot => slot.medicines.length > 0);

      const body = {
        studentId: String(selectedStudent),
        note,
        imageUrl,
        slots
      };

      console.log('Sending medicine request:', body);

      const response = await fetch(`${apiUrl}/medicine-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.code === 201 && data.status === true) {
          showNotification("success", "Tạo yêu cầu gửi thuốc thành công");
          // Reset form
          setSelectedImage(null);
          setImagePreview(null);
          setImageUrl('');
          setNote('');
          setMedicineSlots({
            'Sáng': [{ name: '', description: '', quantity: 1 }],
            'Trưa': [{ name: '', description: '', quantity: 1 }],
            'Chiều': [{ name: '', description: '', quantity: 1 }]
          });
          const fileInput = document.getElementById("imageInput");
          if (fileInput) fileInput.value = "";
        } else {
          showNotification("error", data.message || "Có lỗi xảy ra khi tạo yêu cầu");
        }
      } else if (response.status === 400) {
        // Student already has medicine request today
        showNotification("error", "Học sinh đã được gửi thuốc hôm nay");
      } else if (response.status === 401) {
        showNotification("error", "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      } else {
        showNotification("error", data.message || "Lỗi khi tạo yêu cầu gửi thuốc");
      }
    } catch (error) {
      console.error("Error creating medicine request:", error);
      showNotification("error", "Lỗi kết nối khi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageUrl('');
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Notification - Adjusted position */}
        {notification.show && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            style={{ marginTop: '4rem' }}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #223A6A 0%, #407CE2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Quản Lý Thông Tin Thuốc
          </h1>
          <p className="text-gray-600 text-lg">
            Gửi yêu cầu thuốc cho con em bằng hình ảnh
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'create'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                Tạo yêu cầu gửi thuốc
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <History className="w-5 h-5" />
                Lịch sử gửi thuốc
              </div>
            </button>
          </div>
        </div>

        {/* Create Medicine Request Tab */}
        {activeTab === 'create' && (
          <>
            {/* Student Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: "#223A6A" }}
                >
                  <User className="w-5 h-5" style={{ color: "#407CE2" }} />
                  Chọn học sinh
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Đang tải danh sách học sinh...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => handleStudentSelect(student.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          selectedStudent === student.id
                            ? "shadow-lg"
                            : "border-gray-200 hover:border-opacity-50"
                        }`}
                        style={{
                          borderColor:
                            selectedStudent === student.id ? "#407CE2" : undefined,
                          backgroundColor:
                            selectedStudent === student.id ? "#f0f6ff" : undefined,
                          borderWidth:
                            selectedStudent === student.id ? "2px" : "1px",
                        }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #407CE2 0%, #223A6A 100%)",
                            }}
                          >
                            <span className="text-2xl">
                              {student.avatar || "👦"}
                            </span>
                          </div>
                          <div className="font-medium" style={{ color: "#223A6A" }}>
                            {student.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.age && `${student.age} tuổi`}
                            {student.class && ` - ${student.class}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Medicine Request Form */}
            {selectedStudent && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center mb-6">
                  <Camera className="w-6 h-6 mr-2" style={{ color: "#407CE2" }} />
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#223A6A" }}
                  >
                    Gửi Yêu Cầu Thuốc Bằng Hình Ảnh
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "#223A6A" }}
                    >
                      Tải lên hoá đơn thuốc
                    </label>

                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="imageInput"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Nhấp để tải lên</span>{" "}
                            hoặc kéo thả
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="imageInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-xs max-h-48 rounded-lg shadow-lg"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Tệp: {selectedImage?.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Medicine Slots */}
                  {['Sáng', 'Trưa', 'Chiều'].map((slot) => (
                    <div key={slot} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: "#223A6A" }}>
                        Buổi {slot}
                      </h3>
                      
                      {medicineSlots[slot].map((medicine, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#223A6A" }}>
                              Tên thuốc
                            </label>
                            <input
                              className="w-full border rounded-lg px-3 py-2"
                              value={medicine.name}
                              onChange={e => updateMedicine(slot, index, 'name', e.target.value)}
                              placeholder="Nhập tên thuốc"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#223A6A" }}>
                              Mô tả
                            </label>
                            <input
                              className="w-full border rounded-lg px-3 py-2"
                              value={medicine.description}
                              onChange={e => updateMedicine(slot, index, 'description', e.target.value)}
                              placeholder="Mô tả thuốc"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#223A6A" }}>
                              Số lượng
                            </label>
                            <input
                              className="w-full border rounded-lg px-3 py-2"
                              type="number"
                              min={1}
                              value={medicine.quantity}
                              onChange={e => updateMedicine(slot, index, 'quantity', e.target.value)}
                            />
                          </div>
                          <div className="flex items-end">
                            {medicineSlots[slot].length > 1 && (
                              <button
                                onClick={() => removeMedicineFromSlot(slot, index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => addMedicineToSlot(slot)}
                        className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm thuốc cho buổi {slot}
                      </button>
                    </div>
                  ))}

                  {/* General Note */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#223A6A" }}>
                      Ghi chú chung
                    </label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Ghi chú cho nhà trường"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendMedicineRequest}
                      disabled={loading || !imageUrl}
                      className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                        loading || !imageUrl
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                      }`}
                      style={{
                        backgroundColor:
                          loading || !imageUrl ? undefined : "#407CE2",
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Gửi Yêu Cầu
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Student Info */}
            {selectedStudent && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#223A6A" }}
                >
                  Thông tin học sinh đã chọn
                </h3>
                {(() => {
                  const student = students.find((s) => s.id === selectedStudent);
                  return student ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #407CE2 0%, #223A6A 100%)",
                        }}
                      >
                        <span className="text-2xl">{student.avatar || "👦"}</span>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#223A6A" }}>
                          {student.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.age && `${student.age} tuổi`}
                          {student.class && ` - ${student.class}`}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </>
        )}

        {/* Medicine History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <History className="w-6 h-6 mr-2" style={{ color: "#407CE2" }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: "#223A6A" }}
              >
                Lịch Sử Gửi Thuốc
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  Đang tải lịch sử gửi thuốc...
                </p>
              </div>
            ) : medicineHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có lịch sử gửi thuốc</p>
                <p className="text-gray-400 text-sm">Tạo yêu cầu gửi thuốc đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicineHistory.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #407CE2 0%, #223A6A 100%)",
                          }}
                        >
                          <span className="text-lg text-white">
                            {request.student?.avatar || "👦"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg" style={{ color: "#223A6A" }}>
                            {request.student?.fullName || "Không có tên"}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(request.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              ID: {request.id}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </div>
                    </div>

                    {/* Medicine Image */}
                    {request.image && (
                      <div className="mb-4">
                        <img
                          src={request.image}
                          alt="Hóa đơn thuốc"
                          className="max-w-xs max-h-32 rounded-lg shadow-sm object-cover"
                        />
                      </div>
                    )}

                    {/* Note */}
                    {request.note && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</p>
                        <p className="text-sm text-gray-600">{request.note}</p>
                      </div>
                    )}

                    {/* Medicine Slots - if available in API response */}
                    {request.slots && request.slots.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Thuốc theo buổi:</p>
                        {request.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="bg-blue-50 rounded-lg p-3">
                            <h5 className="font-medium text-blue-800 mb-2">Buổi {slot.session}</h5>
                            {slot.medicines && slot.medicines.map((medicine, medIndex) => (
                              <div key={medIndex} className="text-sm text-blue-700 mb-1">
                                • {medicine.name} 
                                {medicine.description && ` - ${medicine.description}`}
                                {medicine.quantity && ` (${medicine.quantity})`}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugInfo;