import React, { useState } from 'react';
import { Plus, Calendar, FileText, User, Edit, Trash2, Camera } from 'lucide-react';

const DrugInfo = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const students = [
    { id: 'sophie', name: 'Sophie Miller', age: 8, class: 'Lớp 3A', avatar: '👧' },
    { id: 'john', name: 'John Smith', age: 6, class: 'Lớp 1B', avatar: '👦' }
  ];
  const handleAddDrug = () => {
    if (newDrug.name && newDrug.dosage && newDrug.frequency) {
      setDrugs([...drugs, { ...newDrug, id: Date.now() }]);
      setNewDrug({
        name: '',
        dosage: '',
        unit: 'mg',
        frequency: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteDrug = (id) => {
    setDrugs(drugs.filter(drug => drug.id !== id));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
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
          <p className="text-gray-600 text-lg">Theo dõi và quản lý thuốc cho con em</p>
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
                      <span className="text-2xl">{student.avatar}</span>
                    </div>
                    <div className="font-medium" style={{ color: '#223A6A' }}>{student.name}</div>
                    <div className="text-sm text-gray-500">{student.age} tuổi - {student.class}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(selectedStudent !== null && selectedStudent !== undefined) && (
          <>
            {/* Add New Drug Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-2" style={{ color: '#407CE2' }} />
                  <h2 className="text-xl font-semibold" style={{ color: '#223A6A' }}>
                    Thêm Thuốc Mới
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center px-4 py-2 rounded-lg text-white transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#407CE2' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Thuốc
                </button>
              </div>

              {showAddForm && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                        Tên Thuốc
                      </label>
                      <input
                        type="text"
                        value={newDrug.name}
                        onChange={(e) => setNewDrug({...newDrug, name: e.target.value})}
                        placeholder="VD: Paracetamol"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                        Liều Lượng
                      </label>
                      <input
                        type="text"
                        value={newDrug.dosage}
                        onChange={(e) => setNewDrug({...newDrug, dosage: e.target.value})}
                        placeholder="VD: 500"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                        Đơn Vị
                      </label>
                      <select
                        value={newDrug.unit}
                        onChange={(e) => setNewDrug({...newDrug, unit: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="mg">mg</option>
                        <option value="ml">ml</option>
                        <option value="viên">viên</option>
                        <option value="gói">gói</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                      Tần Suất Sử Dụng
                    </label>
                    <input
                      type="text"
                      value={newDrug.frequency}
                      onChange={(e) => setNewDrug({...newDrug, frequency: e.target.value})}
                      placeholder="VD: 2 lần/ngày"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                        Ngày Bắt Đầu
                      </label>
                      <input
                        type="date"
                        value={newDrug.startDate}
                        onChange={(e) => setNewDrug({...newDrug, startDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                        Ngày Kết Thúc (Tùy chọn)
                      </label>
                      <input
                        type="date"
                        value={newDrug.endDate}
                        onChange={(e) => setNewDrug({...newDrug, endDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#223A6A' }}>
                      Ghi Chú
                    </label>
                    <textarea
                      value={newDrug.notes}
                      onChange={(e) => setNewDrug({...newDrug, notes: e.target.value})}
                      placeholder="Ghi chú quan trọng về thuốc này..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddDrug}
                      className="px-6 py-2 rounded-lg text-white transition-colors duration-200 hover:opacity-90"
                      style={{ backgroundColor: '#407CE2' }}
                    >
                      Thêm Thuốc
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current and Used Drugs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 mr-2" style={{ color: '#407CE2' }} />
                <h2 className="text-xl font-semibold" style={{ color: '#223A6A' }}>
                  Thuốc Hiện Tại & Đã Sử Dụng
                </h2>
              </div>

              {drugs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg mb-2">Chưa có thuốc nào được thêm.</p>
                  <p className="text-gray-400">Hãy thêm thuốc đầu tiên ở phía trên.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>TÊN THUỐC</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>LIỀU LƯỢNG</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>TẦN SUẤT</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>NGÀY BẮT ĐẦU</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>NGÀY KẾT THÚC</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>GHI CHÚ</th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#223A6A' }}>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drugs.map((drug) => (
                        <tr key={drug.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium" style={{ color: '#223A6A' }}>{drug.name}</td>
                          <td className="py-4 px-4 text-gray-700">{drug.dosage} {drug.unit}</td>
                          <td className="py-4 px-4 text-gray-700">{drug.frequency}</td>
                          <td className="py-4 px-4 text-gray-700">{drug.startDate}</td>
                          <td className="py-4 px-4 text-gray-700">{drug.endDate || '-'}</td>
                          <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{drug.notes || '-'}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDrug(drug.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DrugInfo;