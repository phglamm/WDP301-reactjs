import React, { useState, useEffect } from 'react';
import { User, Phone, GraduationCap, Calendar, Users, Edit3, Save, X, Loader2, Mail, MapPin, UserCheck } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    parentName: "",
    phoneNumber: "",
    email: "",
    children: []
  });

  const [editData, setEditData] = useState(profileData);

  // API Configuration
  const API_BASE_URL = 'https://wdp301-se1752-be.onrender.com';
  
  // Get token from localStorage or wherever you store it
  const getAuthToken = () => {
    // Thay đổi này tùy theo cách bạn lưu token
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  // Decode JWT token to get user ID
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload.sub;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return '';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    } catch (err) {
      console.error('Error calculating age:', err);
      return '';
    }
  };

  // Fetch parent info and children data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('Không thể lấy ID người dùng từ token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch parent info using user ID from token
      let parentInfo = {
        parentName: "Đang tải...",
        phoneNumber: "",
        email: ""
      };

      try {
        const parentResponse = await fetch(`${API_BASE_URL}/user/${userId}`, {
          headers
        });
        
        if (parentResponse.ok) {
          const result = await parentResponse.json();
          
          // Extract data from the API response structure
          const parentData = result.data || result;
          
          parentInfo = {
            parentName: parentData.fullName || parentData.name || "",
            phoneNumber: parentData.phone || "",
            email: parentData.email || ""
          };
        } else {
          throw new Error(`Failed to fetch parent info: ${parentResponse.status}`);
        }
      } catch (err) {
        console.error('Error fetching parent info:', err);
        throw new Error('Không thể tải thông tin phụ huynh');
      }

      // Fetch children list
      const childrenResponse = await fetch(`${API_BASE_URL}/student/parent`, {
        headers
      });

      if (!childrenResponse.ok) {
        throw new Error(`API Error: ${childrenResponse.status}`);
      }

      const childrenResult = await childrenResponse.json();
      console.log('Children API Response:', childrenResult); // Debug log
      
      // Extract children data from API response
      let childrenData = [];
      if (childrenResult && childrenResult.data && Array.isArray(childrenResult.data)) {
        childrenData = childrenResult.data;
      } else if (Array.isArray(childrenResult)) {
        childrenData = childrenResult;
      } else {
        console.log('Unexpected children data structure:', childrenResult);
        childrenData = [];
      }

      // Transform API data to match component structure
      const transformedChildren = childrenData.map((child, index) => ({
        id: child.id || index + 1,
        name: child.fullName || child.name || "",
        age: calculateAge(child.dob) || child.age || "",
        grade: child.class || child.grade || "",
        school: child.school || child.schoolName || "",
        studentCode: child.studentCode || "",
        address: child.address || "",
        gender: child.gender || ""
      }));

      const newProfileData = {
        ...parentInfo,
        children: transformedChildren
      };

      console.log('Final profile data:', newProfileData); // Debug log

      setProfileData(newProfileData);
      setEditData(newProfileData);
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Update profile data via API
  const updateProfileData = async (updatedData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('Không thể lấy ID người dùng từ token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Update parent info using user ID
      try {
        const updateResponse = await fetch(`${API_BASE_URL}/user/${userId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            fullName: updatedData.parentName,
            phone: updatedData.phoneNumber,
            email: updatedData.email
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`Failed to update parent info: ${updateResponse.status}`);
        }
      } catch (err) {
        console.error('Error updating parent info:', err);
        throw new Error('Không thể cập nhật thông tin phụ huynh');
      }

      // Update children info (if API supports it)
      // This depends on your API structure
      for (const child of updatedData.children) {
        try {
          await fetch(`${API_BASE_URL}/api/student/${child.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              fullName: child.name,
              age: child.age,
              grade: child.grade,
              school: child.school
            })
          });
        } catch (err) {
          console.log(`Failed to update child ${child.id}:`, err);
        }
      }

      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfileData(editData);
      setProfileData(editData);
      setIsEditing(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
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

  const handleRefresh = () => {
    fetchProfileData();
  };

  if (loading && !profileData.children.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4 border border-blue-100">
          <Loader2 className="animate-spin text-[#407CE2]" size={24} />
          <span className="text-[#223A6A] font-medium">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md border border-red-100">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-[#223A6A] mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-[#223A6A] to-[#407CE2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-[#223A6A] via-[#407CE2] to-[#5B9BD5] px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <User size={36} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Hồ Sơ Sức Khỏe Gia Đình</h1>
                  <p className="text-blue-100 text-lg">Quản lý thông tin sức khỏe con em</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                  title="Làm mới"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : "🔄"}
                </button>
                <button
                  onClick={isEditing ? handleCancel : handleEdit}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm border border-white/20"
                >
                  {isEditing ? <X size={20} /> : <Edit3 size={20} />}
                  <span className="font-medium">{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-8 border border-blue-100">
          <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-r from-[#223A6A] to-[#407CE2] rounded-xl flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#223A6A]">Thông tin phụ huynh</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                <User size={16} className="text-[#407CE2]" />
                <span>Họ và tên</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.parentName}
                  onChange={(e) => updateParentInfo('parentName', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-gray-50 focus:bg-white"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl font-semibold text-[#223A6A] border border-blue-100 min-h-[56px] flex items-center">
                  {profileData.parentName || "Chưa có thông tin"}
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                <Phone size={16} className="text-[#407CE2]" />
                <span>Số điện thoại</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => updateParentInfo('phoneNumber', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-gray-50 focus:bg-white"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl font-semibold text-[#223A6A] border border-blue-100 min-h-[56px] flex items-center">
                  {profileData.phoneNumber || "Chưa có thông tin"}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                <Mail size={16} className="text-[#407CE2]" />
                <span>Email</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => updateParentInfo('email', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-gray-50 focus:bg-white"
                  placeholder="Nhập email"
                />
              ) : (
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl font-semibold text-[#223A6A] border border-blue-100 min-h-[56px] flex items-center">
                  {profileData.email || "Chưa có thông tin"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-r from-[#407CE2] to-[#5B9BD5] rounded-xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#223A6A]">
              Thông tin các con ({(isEditing ? editData.children : profileData.children).length})
            </h2>
          </div>

          {(isEditing ? editData.children : profileData.children).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={64} className="mx-auto mb-6 opacity-30" />
              <p className="text-lg font-medium">Chưa có thông tin học sinh</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(isEditing ? editData.children : profileData.children).map((child, index) => (
                <div key={child.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-[#407CE2]/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-[#223A6A] flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#223A6A] to-[#407CE2] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span>Con thứ {index + 1}</span>
                    </h3>
                    {child.studentCode && (
                      <span className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 font-medium">
                        Mã HS: {child.studentCode}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                        <User size={16} className="text-[#407CE2]" />
                        <span>Họ và tên</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => updateChildInfo(child.id, 'name', e.target.value)}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-white"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="px-3 py-3 bg-white rounded-xl font-semibold text-[#223A6A] border border-blue-200 min-h-[48px] flex items-center">
                          {child.name || "Chưa có thông tin"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                        <Calendar size={16} className="text-[#407CE2]" />
                        <span>Tuổi</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={child.age}
                          onChange={(e) => updateChildInfo(child.id, 'age', e.target.value)}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-white"
                          placeholder="Nhập tuổi"
                        />
                      ) : (
                        <div className="px-3 py-3 bg-white rounded-xl font-semibold text-[#223A6A] border border-blue-200 min-h-[48px] flex items-center">
                          {child.age ? `${child.age} tuổi` : "Chưa có thông tin"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                        <GraduationCap size={16} className="text-[#407CE2]" />
                        <span>Lớp</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={child.grade}
                          onChange={(e) => updateChildInfo(child.id, 'grade', e.target.value)}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-[#407CE2] focus:outline-none transition-all duration-300 text-[#223A6A] font-medium bg-white"
                          placeholder="Nhập lớp"
                        />
                      ) : (
                        <div className="px-3 py-3 bg-white rounded-xl font-semibold text-[#223A6A] border border-blue-200 min-h-[48px] flex items-center">
                          {child.grade || "Chưa có thông tin"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional info row */}
                  {(child.address || child.gender) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                      {child.address && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                            <MapPin size={16} className="text-[#407CE2]" />
                            <span>Địa chỉ</span>
                          </label>
                          <div className="px-3 py-3 bg-white rounded-xl text-[#223A6A] font-medium border border-blue-200 min-h-[48px] flex items-center">
                            {child.address}
                          </div>
                        </div>
                      )}
                      {child.gender && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-600 mb-3 flex items-center space-x-2">
                            <UserCheck size={16} className="text-[#407CE2]" />
                            <span>Giới tính</span>
                          </label>
                          <div className="px-3 py-3 bg-white rounded-xl text-[#223A6A] font-medium border border-blue-200 min-h-[48px] flex items-center">
                            {child.gender === 'Nam' ? '👦 Nam' : '👧 Nữ'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-[#223A6A] via-[#407CE2] to-[#5B9BD5] text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 transform hover:scale-105 border border-blue-200"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;