import { useState, useEffect } from 'react';
import { message } from 'antd';
import medicinRequestService from '../../../services/MedicineRequest/MedicineRequest';

export const useMedicineRequest = () => {
  const [allMedicineRequest, setAllMedicineRequest] = useState([]);
  const [medicineRequestToday, setMedicineRequestToday] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const response = await medicinRequestService.getAllMedicineRequests();
      setAllMedicineRequest(response.data);
    } catch (error) {
      console.error("Error fetching all medicine requests:", error);
      message.error('Không thể tải danh sách yêu cầu thuốc');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayRequests = async () => {
    try {
      setLoading(true);
      const response = await medicinRequestService.getMedicineRequestsToday();
      setMedicineRequestToday(response.data);
    } catch (error) {
      console.error("Error fetching medicine requests for today:", error);
      message.error('Không thể tải yêu cầu thuốc hôm nay');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (formData) => {
    try {
      setLoading(true);
      await medicinRequestService.createMedicineRequest(formData);
      message.success('Tạo yêu cầu thuốc thành công!');
      await Promise.all([fetchAllRequests(), fetchTodayRequests()]);
      return true;
    } catch (error) {
      console.error('Error creating medicine request:', error);
      message.error('Có lỗi xảy ra khi tạo yêu cầu thuốc!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setLoading(true);
      await medicinRequestService.approveMedicineRequest(id);
      message.success('Đã duyệt yêu cầu thuốc thành công!');
      await Promise.all([fetchAllRequests(), fetchTodayRequests()]);
      return true;
    } catch (error) {
      console.error('Error approving medicine request:', error);
      message.error('Có lỗi xảy ra khi duyệt yêu cầu!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (id) => {
    try {
      setLoading(true);
      await medicinRequestService.rejectMedicineRequest(id);
      message.success('Đã từ chối yêu cầu thuốc!');
      await Promise.all([fetchAllRequests(), fetchTodayRequests()]);
      return true;
    } catch (error) {
      console.error('Error rejecting medicine request:', error);
      message.error('Có lỗi xảy ra khi từ chối yêu cầu!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = async (id) => {
    try {
      const response = await medicinRequestService.getMedicineRequestById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicine request details:', error);
      message.error('Có lỗi xảy ra khi tải thông tin chi tiết!');
      return null;
    }
  };

  useEffect(() => {
    fetchAllRequests();
    fetchTodayRequests();
  }, []);

  return {
    allMedicineRequest,
    medicineRequestToday,
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    getRequestById,
    refreshData: () => Promise.all([fetchAllRequests(), fetchTodayRequests()])
  };
};