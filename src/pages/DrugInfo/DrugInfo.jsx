import React, { useState, useEffect } from 'react';
import { Plus, User, Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DrugInfo = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Get API base URL from environment
  const getAPIBaseURL = () => {
    return import.meta.env.VITE_API_URL || 'https://wdp301-se1752-be.onrender.com/api';
  };

  // Get token from localStorage (from userSlice)
  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // Fetch students list on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();
      
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập lại');
        return;
      }

      const response = await fetch(`${apiUrl}/student/parent`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Students API data:', data);
        setStudents(Array.isArray(data.data) ? data.data : []);
      } else if (response.status === 401) {
        showNotification('error', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      } else {
        showNotification('error', 'Không thể tải danh sách học sinh');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showNotification('error', 'Lỗi kết nối khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMedicineRequest = async () => {
    if (!selectedStudent) {
      showNotification('error', 'Vui lòng chọn học sinh');
      return;
    }

    if (!selectedImage) {
      showNotification('error', 'Vui lòng chọn hình ảnh thuốc');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const apiUrl = getAPIBaseURL();
      
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập lại');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('studentId', selectedStudent);

      const response = await fetch(`${apiUrl}/medicine-request/image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showNotification('success', 'Tạo yêu cầu gửi thuốc thành công');
        setSelectedImage(null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('imageInput');
        if (fileInput) fileInput.value = '';
      } else if (response.status === 401) {
        showNotification('error', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification('error', errorData.message || 'Không thể tạo yêu cầu gửi thuốc');
      }
    } catch (error) {
      console.error('Error sending medicine request:', error);
      showNotification('error', 'Lỗi kết nối khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #223A6A 0%, #407CE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Quản Lý Thông Tin Thuốc
          </h1>
          <p className="text-gray-600 text-lg">Gửi yêu cầu thuốc cho con em bằng hình ảnh</p>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#223A6A' }}>
              <User className="w-5 h-5" style={{ color: '#407CE2' }} />
              Chọn học sinh
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách học sinh...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {students.map(student => (
                  <div 
                    key={student.id}
                    onClick={() => handleStudentSelect(student.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      selectedStudent === student.id 
                        ? 'shadow-lg' 
                        : 'border-gray-200 hover:border-opacity-50'
                    }`}
                    style={{
                      borderColor: selectedStudent === student.id ? '#407CE2' : undefined,
                      backgroundColor: selectedStudent === student.id ? '#f0f6ff' : undefined,
                      borderWidth: selectedStudent === student.id ? '2px' : '1px'
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{
                        background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                      }}>
                        <span className="text-2xl">{student.avatar || '👦'}</span>
                      </div>
                      <div className="font-medium" style={{ color: '#223A6A' }}>{student.fullName}</div>
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
              <Camera className="w-6 h-6 mr-2" style={{ color: '#407CE2' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#223A6A' }}>
                Gửi Yêu Cầu Thuốc Bằng Hình Ảnh
              </h2>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#223A6A' }}>
                  Chọn hình ảnh thuốc
                </label>
                
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="imageInput" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
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

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSendMedicineRequest}
                  disabled={loading || !selectedImage}
                  className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    loading || !selectedImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                  style={{ 
                    backgroundColor: loading || !selectedImage ? undefined : '#407CE2',
                    transform: loading || !selectedImage ? 'none' : 'translateY(0)',
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
                      Gửi Yêu Cầu Thuốc
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#223A6A' }}>
              Thông tin học sinh đã chọn
            </h3>
            {(() => {
              const student = students.find(s => s.id === selectedStudent);
              return student ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #407CE2 0%, #223A6A 100%)'
                  }}>
                    <span className="text-2xl">{student.avatar || '👦'}</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#223A6A' }}>{student.fullName}</p>
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
      </div>
    </div>
  );
};

export default DrugInfo;