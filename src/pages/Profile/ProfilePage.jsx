import React, { useState } from 'react';
import { User, Phone, GraduationCap, Calendar, Users, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    parentName: "Nguyễn Thị Lan Anh",
    phoneNumber: "0987 654 321",
    children: [
      {
        id: 1,
        name: "Nguyễn Minh Khang",
        age: 8,
        grade: "Lớp 3A",
        school: "Trường Tiểu học ABC"
      },
      {
        id: 2,
        name: "Nguyễn Minh Thu",
        age: 12,
        grade: "Lớp 6B",
        school: "Trường THCS XYZ"
      }
    ]
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const updateParentInfo = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateChildInfo = (childId, field, value) => {
    setEditData(prev => ({
      ...prev,
      children: prev.children.map(child =>
        child.id === childId ? { ...child, [field]: value } : child
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#223A6A] to-[#407CE2] px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Hồ Sơ Sức Khỏe Gia Đình</h1>
                  <p className="text-blue-100 mt-1">Quản lý thông tin sức khỏe con em</p>
                </div>
              </div>
              <button
                onClick={isEditing ? handleCancel : handleEdit}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#223A6A] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#223A6A]">Thông tin phụ huynh</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Họ và tên</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.parentName}
                  onChange={(e) => updateParentInfo('parentName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg font-medium text-[#223A6A]">
                  {profileData.parentName}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => updateParentInfo('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg font-medium text-[#223A6A] flex items-center space-x-2">
                  <Phone size={16} className="text-[#407CE2]" />
                  <span>{profileData.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#407CE2] rounded-full flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#223A6A]">Thông tin các con</h2>
          </div>

          <div className="space-y-4">
            {(isEditing ? editData.children : profileData.children).map((child, index) => (
              <div key={child.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#407CE2]/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#223A6A] flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#223A6A] to-[#407CE2] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span>Con thứ {index + 1}</span>
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateChildInfo(child.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-blue-50 rounded-lg font-medium text-[#223A6A]">
                        {child.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Tuổi</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={child.age}
                        onChange={(e) => updateChildInfo(child.id, 'age', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-blue-50 rounded-lg font-medium text-[#223A6A] flex items-center space-x-2">
                        <Calendar size={16} className="text-[#407CE2]" />
                        <span>{child.age} tuổi</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Lớp</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={child.grade}
                        onChange={(e) => updateChildInfo(child.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-blue-50 rounded-lg font-medium text-[#223A6A] flex items-center space-x-2">
                        <GraduationCap size={16} className="text-[#407CE2]" />
                        <span>{child.grade}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Trường</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={child.school}
                        onChange={(e) => updateChildInfo(child.id, 'school', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-[#407CE2]/20 rounded-lg focus:border-[#407CE2] focus:outline-none transition-colors"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-blue-50 rounded-lg font-medium text-[#223A6A]">
                        {child.school}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#223A6A] to-[#407CE2] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;