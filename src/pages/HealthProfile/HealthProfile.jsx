import React, { useState } from 'react';
import { User, Weight, Ruler, Droplet, Eye, Activity, FileText, Plus, History, AlertTriangle, CheckCircle } from 'lucide-react';

const HealthProfile = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    bloodType: 'A',
    vision: '',
    spine: '',
    allergies: '',
    notes: ''
  });

  // Mock data cho học sinh và lịch sử
  const students = [
    { id: 1, name: 'Nguyễn Minh An', class: 'Lớp 10A1', age: '16 tuổi', avatar: '👦' },
    { id: 2, name: 'Trần Thị Bình', class: 'Lớp 8B2', age: '14 tuổi', avatar: '👧' },
  ];
  
  const healthHistory = [
    {
      id: 1,
      date: '29/5/2025',
      weight: 65,
      height: 170,
      bloodType: 'A',
      bmi: 22.5,
      bmiStatus: 'Bình thường',
      overall: '8.5/10',
      vision: '7/10',
      spine: '10/10',
      allergies: 10,
      notes: 'dd'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting health profile:', formData);
    // Xử lý lưu dữ liệu
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
          <h1 className="text-4xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #223A6A 0%, #407CE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Hồ Sơ Sức Khỏe
          </h1>
          <p className="text-gray-600 text-lg">Theo dõi và quản lý sức khỏe học sinh</p>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#223A6A' }}>
              <User className="w-5 h-5" style={{ color: '#407CE2' }} />
              Chọn học sinh
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
              {students.map(student => (
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
                      <span className="text-2xl">{student.avatar}</span>
                    </div>
                    <div className="font-medium" style={{ color: '#223A6A' }}>{student.name}</div>
                    <div className="text-sm text-gray-500">{student.age} - {student.class}</div>
                  </div>
                </div>
              ))}
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
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#407CE2] hover:bg-[#223A6A] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Plus className="mr-2" size={20} />
                Lưu hồ sơ
              </button>
            </div>
          </div>

          {/* Health History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <History className="text-[#407CE2] mr-2" size={24} />
              <h2 className="text-xl font-semibold text-[#223A6A]">Lịch sử hồ sơ</h2>
            </div>

            <div className="space-y-4">
              {healthHistory.map((record) => (
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
                      {record.vision.startsWith('7') && <AlertTriangle className="ml-1 text-yellow-500" size={14} />}
                    </div>
                    <div className="flex items-center">
                      <Activity className="mr-2 text-gray-400" size={16} />
                      <span>Thính giác: <strong>{record.spine}</strong></span>
                      <CheckCircle className="ml-1 text-green-500" size={14} />
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;