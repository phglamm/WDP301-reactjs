import React, { useState, useEffect } from 'react';
import { User, Phone, GraduationCap, Calendar, Users, Loader2, Mail, MapPin, UserCheck, RefreshCw } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    parentName: "",
    phoneNumber: "",
    email: "",
    children: []
  });

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
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleRefresh = () => {
    fetchProfileData();
  };

  if (loading && !profileData.children.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex items-center space-x-6 border border-slate-200/50 backdrop-blur-sm">
          <Loader2 className="animate-spin text-blue-600" size={28} />
          <span className="text-slate-700 font-semibold text-lg">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg border border-red-200/50">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Có lỗi xảy ra</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden border border-slate-200/50">
          <div className="bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 px-10 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-3">Hồ Sơ Gia Đình</h1>
                  <p className="text-blue-100 text-xl font-medium">Thông tin sức khỏe và học tập</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white/15 hover:bg-white/25 px-6 py-4 rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/20 group"
                title="Làm mới"
              >
                <RefreshCw size={24} className={`text-white transition-transform duration-300 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white rounded-3xl shadow-2xl mb-8 p-10 border border-slate-200/50">
          <div className="flex items-center space-x-6 mb-10 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Thông tin phụ huynh</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group">
              <label className="text-sm font-bold text-slate-600 mb-4 flex items-center space-x-3 uppercase tracking-wide">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span>Họ và tên</span>
              </label>
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl font-semibold text-slate-800 border border-slate-200 min-h-[64px] flex items-center text-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                {profileData.parentName || "Chưa có thông tin"}
              </div>
            </div>
            
            <div className="group">
              <label className="text-sm font-bold text-slate-600 mb-4 flex items-center space-x-3 uppercase tracking-wide">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-green-600" />
                </div>
                <span>Số điện thoại</span>
              </label>
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-green-50 rounded-2xl font-semibold text-slate-800 border border-slate-200 min-h-[64px] flex items-center text-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                {profileData.phoneNumber || "Chưa có thông tin"}
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-bold text-slate-600 mb-4 flex items-center space-x-3 uppercase tracking-wide">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-purple-600" />
                </div>
                <span>Email</span>
              </label>
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl font-semibold text-slate-800 border border-slate-200 min-h-[64px] flex items-center text-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                {profileData.email || "Chưa có thông tin"}
              </div>
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-200/50">
          <div className="flex items-center space-x-6 mb-10 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Thông tin các con ({profileData.children.length})
            </h2>
          </div>

          {profileData.children.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users size={64} className="opacity-30" />
              </div>
              <p className="text-2xl font-semibold mb-2">Chưa có thông tin học sinh</p>
              <p className="text-lg">Thông tin sẽ được cập nhật khi có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-8">
              {profileData.children.map((child, index) => (
                <div key={child.id} className="border-2 border-slate-100 rounded-3xl p-8 hover:border-blue-200 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-slate-50/50 to-blue-50/30 group">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-2xl text-slate-800 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-slate-700 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <span>{child.name || `Con thứ ${index + 1}`}</span>
                    </h3>
                    {child.studentCode && (
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-3 rounded-xl border border-indigo-200 shadow-sm">
                        <span className="text-sm font-bold text-indigo-700">Mã HS: {child.studentCode}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="group/item">
                      <label className="text-sm font-bold text-slate-600 mb-3 flex items-center space-x-2 uppercase tracking-wide">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <span>Họ và tên</span>
                      </label>
                      <div className="px-4 py-4 bg-white rounded-xl font-semibold text-slate-800 border border-blue-100 min-h-[56px] flex items-center shadow-sm group-hover/item:shadow-md transition-all duration-300">
                        {child.name || "Chưa có thông tin"}
                      </div>
                    </div>
                    
                    <div className="group/item">
                      <label className="text-sm font-bold text-slate-600 mb-3 flex items-center space-x-2 uppercase tracking-wide">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <Calendar size={14} className="text-green-600" />
                        </div>
                        <span>Tuổi</span>
                      </label>
                      <div className="px-4 py-4 bg-white rounded-xl font-semibold text-slate-800 border border-green-100 min-h-[56px] flex items-center shadow-sm group-hover/item:shadow-md transition-all duration-300">
                        {child.age ? `${child.age} tuổi` : "Chưa có thông tin"}
                      </div>
                    </div>
                    
                    <div className="group/item">
                      <label className="text-sm font-bold text-slate-600 mb-3 flex items-center space-x-2 uppercase tracking-wide">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <GraduationCap size={14} className="text-purple-600" />
                        </div>
                        <span>Lớp</span>
                      </label>
                      <div className="px-4 py-4 bg-white rounded-xl font-semibold text-slate-800 border border-purple-100 min-h-[56px] flex items-center shadow-sm group-hover/item:shadow-md transition-all duration-300">
                        {child.grade || "Chưa có thông tin"}
                      </div>
                    </div>
                  </div>

                  {/* Additional info row */}
                  {(child.address || child.gender) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      {child.address && (
                        <div className="group/item">
                          <label className="text-sm font-bold text-slate-600 mb-3 flex items-center space-x-2 uppercase tracking-wide">
                            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                              <MapPin size={14} className="text-orange-600" />
                            </div>
                            <span>Địa chỉ</span>
                          </label>
                          <div className="px-4 py-4 bg-white rounded-xl text-slate-800 font-medium border border-orange-100 min-h-[56px] flex items-center shadow-sm group-hover/item:shadow-md transition-all duration-300">
                            {child.address}
                          </div>
                        </div>
                      )}
                      {child.gender && (
                        <div className="group/item">
                          <label className="text-sm font-bold text-slate-600 mb-3 flex items-center space-x-2 uppercase tracking-wide">
                            <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                              <UserCheck size={14} className="text-pink-600" />
                            </div>
                            <span>Giới tính</span>
                          </label>
                          <div className="px-4 py-4 bg-white rounded-xl text-slate-800 font-medium border border-pink-100 min-h-[56px] flex items-center shadow-sm group-hover/item:shadow-md transition-all duration-300">
                            {child.gender === 'Nam' ? '👦 Nam' : child.gender === 'Nữ' ? '👧 Nữ' : child.gender}
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
      </div>
    </div>
  );
};

export default Profile;