import React, { useState, useEffect } from 'react';
import { User, Weight, Ruler, Droplet, Eye, Activity, FileText, Plus, History, AlertTriangle, CheckCircle } from 'lucide-react';

const HealthProfile = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [healthHistory, setHealthHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    bloodType: 'A',
    vision: '',
    spine: '',
    allergies: '',
    notes: ''
  });

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAxMjM0NTY3ODkiLCJzdWIiOjksInJvbGUiOiJwYXJlbnQiLCJpYXQiOjE3NDk5MDg3NDMsImV4cCI6MTc1MjUwMDc0M30.vlDuauC_BDM4B1WQjyTY4UQrHTlD6lxIioTpRAr3GK8";

  // Fetch danh sách học sinh khi component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://wdp301-se1752-be.onrender.com/student/parent', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Students data:', data.data); // Debug log
        // Đảm bảo data là array
        // if (Array.isArray(data)) {
        //   setStudents(data);
        // } else if (data && Array.isArray(data.students)) {
        //   setStudents(data.students);
        // } else if (data && Array.isArray(data.data)) {
        //   setStudents(data.data);
        // } else {
        //   console.warn('Invalid students data format:', data);
        //   setStudents([]);
        // }
        setStudents(data.data || []); // Giả sử data.data chứa danh sách học sinh
      } else {
        console.error('Failed to fetch students:', response.statusText);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthHistory = async (studentId) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`https://wdp301-se1752-be.onrender.com/health-profile/student/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform data để phù hợp với format hiện tại
        const transformedData = data.map(record => ({
          id: record.id,
          date: new Date(record.createdAt || record.date).toLocaleDateString('vi-VN'),
          weight: record.weight,
          height: record.height,
          bloodType: record.bloodType,
          vision: record.vision,
          spine: record.spine || record.hearing,
          allergies: record.allergies,
          notes: record.notes,
          bmi: calculateBMI(record.weight, record.height),
          bmiStatus: getBMIStatus(calculateBMI(record.weight, record.height)),
          overall: record.overall || 'Tốt'
        }));
        setHealthHistory(transformedData);
      } else {
        console.error('Failed to fetch health history:', response.statusText);
        setHealthHistory([]);
      }
    } catch (error) {
      console.error('Error fetching health history:', error);
      setHealthHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStudentSelect = async (studentId) => {
    setSelectedStudent(studentId);
    if (studentId && studentId !== '') {
      await fetchHealthHistory(studentId);
    } else {
      setHealthHistory([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || selectedStudent === '') {
      alert('Vui lòng chọn học sinh trước khi lưu hồ sơ');
      return;
    }

    try {
      const response = await fetch('https://wdp301-se1752-be.onrender.com/health-profile', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          studentId: selectedStudent
        })
      });

      if (response.ok) {
        alert('Lưu hồ sơ thành công!');
        // Reset form
        setFormData({
          weight: '',
          height: '',
          bloodType: 'A',
          vision: '',
          spine: '',
          allergies: '',
          notes: ''
        });
        // Refresh health history
        await fetchHealthHistory(selectedStudent);
      } else {
        alert('Có lỗi xảy ra khi lưu hồ sơ');
      }
    } catch (error) {
      console.error('Error submitting health profile:', error);
      alert('Có lỗi xảy ra khi lưu hồ sơ');
    }
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    return bmi;
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường';
    if (bmi < 30) return 'Thừa cân';
    return 'Béo phì';
  };

  const getBMIColor = (status) => {
    switch (status) {
      case 'Bình thường': return 'text-green-600';
      case 'Thiếu cân': return 'text-yellow-600';
      case 'Thừa cân': return 'text-orange-600';
      case 'Béo phì': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const currentBMI = calculateBMI(formData.weight, formData.height);
  const bmiStatus = getBMIStatus(currentBMI);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)'
    }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#223A6A] mb-2">Hồ Sơ Sức Khỏe</h1>
          <p className="text-gray-600">Theo dõi và quản lý sức khỏe học sinh</p>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#223A6A' }}>
              <User className="w-5 h-5" style={{ color: '#407CE2' }} />
              Chọn học sinh
              {loading && <span className="text-sm text-gray-500 ml-2">Đang tải...</span>}
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
              {students && students.length > 0 ? (
                students.map(student => (
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
                        <span className="text-2xl">{student.avatar || '👤'}</span>
                      </div>
                      <div className="font-medium" style={{ color: '#223A6A' }}>{student.name}</div>
                      <div className="text-sm text-gray-500">{student.age} - {student.class}</div>
                    </div>
                  </div>
                ))
              ) : (
                !loading && (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-500">
                    <User className="mb-4 text-gray-300" size={48} />
                    <p className="text-lg font-medium text-gray-600">Không có học sinh</p>
                    <p className="text-sm text-gray-500">Hiện tại chưa có học sinh nào trong hệ thống</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* New Health Profile Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <Plus className="text-[#407CE2] mr-2" size={24} />
              <h2 className="text-xl font-semibold text-[#223A6A]">Khai báo hồ sơ mới</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Weight className="mr-2 text-[#407CE2]" size={18} />
                    Cân nặng (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="60"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent"
                    required
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Ruler className="mr-2 text-[#407CE2]" size={18} />
                    Chiều cao (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="160"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Blood Type */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Droplet className="mr-2 text-[#407CE2]" size={18} />
                  Nhóm máu *
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent bg-white"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Vision */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Eye className="mr-2 text-[#407CE2]" size={18} />
                    Thị lực (0-10) *
                  </label>
                  <input
                    type="number"
                    name="vision"
                    value={formData.vision}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                    max="10"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent"
                    required
                  />
                </div>

                {/* Spine */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Activity className="mr-2 text-[#407CE2]" size={18} />
                    Thính giác (0-10) *
                  </label>
                  <input
                    type="number"
                    name="spine"
                    value={formData.spine}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                    max="10"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="mr-2 text-[#407CE2]" size={18} />
                  Dị ứng
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="mr-2 text-[#407CE2]" size={18} />
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú bổ sung..."
                  rows="4"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#407CE2] focus:border-transparent resize-none"
                />
              </div>

              {/* BMI Preview */}
              {currentBMI && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#223A6A]">{currentBMI}</div>
                    <div className={`text-sm font-medium ${getBMIColor(bmiStatus)}`}>
                      {bmiStatus} BMI
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedStudent || selectedStudent === ''}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                  !selectedStudent || selectedStudent === ''
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-[#407CE2] hover:bg-[#223A6A] text-white'
                }`}
              >
                <Plus className="mr-2" size={20} />
                Lưu hồ sơ
              </button>
              {(!selectedStudent || selectedStudent === '') && (
                <p className="text-sm text-red-500 text-center">Vui lòng chọn học sinh trước khi lưu hồ sơ</p>
              )}
            </div>
          </div>

          {/* Health History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <History className="text-[#407CE2] mr-2" size={24} />
              <h2 className="text-xl font-semibold text-[#223A6A]">Lịch sử hồ sơ</h2>
              {loadingHistory && <span className="text-sm text-gray-500 ml-2">Đang tải...</span>}
            </div>

            <div className="space-y-4">
              {selectedStudent && selectedStudent !== '' ? (
                healthHistory.length > 0 ? (
                  healthHistory.map((record) => (
                    <div key={record.id} className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-[#223A6A]">Hồ sơ #{record.id}</h3>
                          <p className="text-sm text-gray-600">📅 Cập nhật: {record.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#407CE2]">{record.bmi}</div>
                          <div className={`text-sm font-medium ${getBMIColor(record.bmiStatus)}`}>
                            {record.bmiStatus}
                          </div>
                          <div className="text-xs text-gray-500">BMI</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Weight className="mr-2 text-gray-400" size={16} />
                          <span>Cân nặng: <strong>{record.weight}kg</strong></span>
                        </div>
                        <div className="flex items-center">
                          <Ruler className="mr-2 text-gray-400" size={16} />
                          <span>Chiều cao: <strong>{record.height}cm</strong></span>
                        </div>
                        <div className="flex items-center">
                          <Droplet className="mr-2 text-gray-400" size={16} />
                          <span>Nhóm máu: <strong>{record.bloodType}</strong></span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="mr-2 text-gray-400" size={16} />
                          <span>Tổng quát: <strong>{record.overall}</strong></span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="mr-2 text-gray-400" size={16} />
                          <span>Thị lực: <strong>{record.vision}</strong></span>
                          {record.vision < 8 && <AlertTriangle className="ml-1 text-yellow-500" size={14} />}
                        </div>
                        <div className="flex items-center">
                          <Activity className="mr-2 text-gray-400" size={16} />
                          <span>Thính giác: <strong>{record.spine}</strong></span>
                          {record.spine >= 8 ? (
                            <CheckCircle className="ml-1 text-green-500" size={14} />
                          ) : (
                            <AlertTriangle className="ml-1 text-yellow-500" size={14} />
                          )}
                        </div>
                      </div>

                      {record.allergies && (
                        <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                          <div className="flex items-center text-red-700">
                            <AlertTriangle className="mr-2" size={16} />
                            <span className="font-medium">Dị ứng: {record.allergies}</span>
                          </div>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-3">
                          <div className="flex items-start">
                            <FileText className="mr-2 text-gray-400 mt-0.5" size={16} />
                            <div>
                              <span className="font-medium text-gray-700">Ghi chú:</span>
                              <p className="text-gray-600">{record.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="mx-auto mb-4 text-gray-300" size={48} />
                    <p>Chưa có lịch sử hồ sơ sức khỏe</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>Vui lòng chọn học sinh để xem lịch sử hồ sơ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;