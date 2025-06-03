import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { FaUserMd } from 'react-icons/fa';

const DrugInfo = () => {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const units = ['mg', 'ml', 'tablets', 'capsules', 'drops', 'grams'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMedication = () => {
    if (formData.name && formData.dosage && formData.frequency && formData.startDate) {
      const newMedication = {
        id: Date.now(),
        ...formData
      };
      setMedications([...medications, newMedication]);
      setFormData({
        name: '',
        dosage: '',
        unit: 'mg',
        frequency: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
    }
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #d4e4ff 50%, #b3ccff 100%)',
      }}
    >
      <div className="flex min-h-screen">
        {/* Sidebar - Student Selection */}
        <div
          className="w-[320px] p-8 border-r border-white border-opacity-20 backdrop-blur-md min-h-screen shadow-[4px_0_20px_rgba(0,0,0,0.1)]"
          style={{
            background: 'transparent', // trong suốt nhìn xuyên nền cha
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 text-black text-[20px] font-semibold mb-6 select-none"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            <FaUserMd className="w-6 h-6 " />
            <h2 className="text-2xl	">Học sinh</h2>
          </div>

          {/* Student Cards */}
          <div className="space-y-3">
            {/* Selected Student */}
            <div className="cursor-pointer p-4 rounded-[16px] bg-gradient-to-tr from-blue-500 to-blue-700 text-white shadow-[0_10px_25px_rgba(59,130,246,0.4)] transform scale-[1.02] font-semibold transition-all">
              <h3 className="text-base">Nguyễn Khánh Tùng</h3>
              <div className="flex justify-between text-[12px] opacity-80 mt-1 font-semibold">
                <span>MSSV: SS160730</span>
                <span>1 hồ sơ</span>
              </div>
            </div>

            {/* Other Students */}
            <div className="cursor-pointer p-4 rounded-[16px] bg-white bg-opacity-[0.9] text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.1)] font-semibold transition-all hover:shadow-lg">
              <h3 className="text-base">Nguyễn Quốc Huy</h3>
              <div className="flex justify-between text-[12px] opacity-80 mt-1 font-semibold">
                <span>MSSV: SE444444</span>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Add New Medication Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-10">
            <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Thêm Thuốc Mới
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Tên Thuốc
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Paracetamol"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Liều Lượng
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="VD: 500"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Đơn Vị
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-3">
                Tần Suất Sử Dụng
              </label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                placeholder="VD: 2 lần/ngày"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Ngày Bắt Đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Ngày Kết Thúc (Tùy chọn)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-black mb-3">
                Ghi Chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Ghi chú quan trọng về thuốc này..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
              />
            </div>

            <button
              onClick={handleAddMedication}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Thuốc
            </button>
          </div>

          {/* Current & Past Medications */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-8 border-b border-gray-300">
              <h2 className="text-3xl font-bold text-black flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                Thuốc Hiện Tại & Đã Sử Dụng
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Tên Thuốc
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Liều Lượng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Tần Suất
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Ngày Bắt Đầu
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Ngày Kết Thúc
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Ghi Chú
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-black">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg">Chưa có thuốc nào được thêm.</p>
                        <p className="text-sm">Hãy thêm thuốc đầu tiên ở phía trên.</p>
                      </td>
                    </tr>
                  ) : (
                    medications.map((medication) => (
                      <tr key={medication.id} className="hover:bg-gray-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-black">{medication.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black font-medium">{medication.dosage} {medication.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{medication.frequency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{medication.startDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{medication.endDate || '-'}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <div className="text-sm text-black">{medication.notes || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3">
                            <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedication(medication.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugInfo;
