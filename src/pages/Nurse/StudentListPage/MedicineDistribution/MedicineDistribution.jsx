import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import slotService from '../../../../services/Nurse/SlotService/SlotService';
import toast from 'react-hot-toast';
import Header from '../../../../components/MedicineDistribution/Header/Header';
import StatisticsCards from '../../../../components/MedicineDistribution/StatisticsCards/StatisticsCards';
import MedicineTable from '../../../../components/MedicineDistribution/MedicineTable/MedicineTable';
import CheckModal from '../../../../components/MedicineDistribution/CheckModal/CheckModal';
import DetailModal from '../../../../components/MedicineDistribution/DetailModal/DetailModal';

const MedicineDistribution = ({ searchText, classFilter = 'all', setSlots }) => {
  // Function to get current session based on time
  const getCurrentSession = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 0 && hour < 10) {
      return 'Sáng'; // Morning: 8-10 AM
    } else if (hour >= 11 && hour <= 14) {
      return 'Trưa'; // Noon: 11 AM - 2 PM
    } else {
      return 'Chiều'; // Afternoon: other times
    }
  };

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(getCurrentSession());
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [selectedSlotForCheck, setSelectedSlotForCheck] = useState(null);
  const [checkImage, setCheckImage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeCard, setActiveCard] = useState('all');
  const [flattenedSlots, setFlattenedSlots] = useState([]); // Local state for flattened slots

  // Auto-update session based on real time (only if not manually selected)
  useEffect(() => {
    const updateSessionByTime = () => {
      const currentSession = getCurrentSession();
      // Only auto-update if user hasn't manually selected a session
      if (!isManualSelection && currentSession !== selectedSession) {
        setSelectedSession(currentSession);
        console.log('Session auto-updated to:', currentSession);
      }
    };

    // Update immediately
    updateSessionByTime();

    // Set up interval to check every minute
    const interval = setInterval(updateSessionByTime, 60000);

    return () => clearInterval(interval);
  }, [selectedSession, isManualSelection]);

  // Function to manually set session (overrides auto-selection)
  const handleSessionChange = (session) => {
    setSelectedSession(session);
    setIsManualSelection(true);
    console.log('Session manually changed to:', session);
  };

  // Reset to auto-selection
  const resetToAutoSelection = () => {
    setIsManualSelection(false);
    setSelectedSession(getCurrentSession());
    console.log('Reset to auto-selection');
  };

  // Fetch slots data based on selected session
  const fetchSlots = async (session = selectedSession) => {
    try {
      setLoading(true);
      const encodedSession = encodeURIComponent(session);
      console.log('Fetching slots for session:', session, 'encoded:', encodedSession);
      
      const response = await slotService.getSlotToday(encodedSession);
      
      if (response.status && response.data) {
        console.log('Slots fetched successfully:', response.data);
        
        // Update parent component with raw data structure for class filtering
        // Structure: { "5A": [...], "6B": [...] }
        setSlots(response.data);
        
        // Flatten the data for local use in table and filtering
        const allSlots = [];
        Object.keys(response.data).forEach(className => {
          response.data[className].forEach(slot => {
            allSlots.push({
              ...slot,
              className: className,
              key: `${className}-${slot.id}`
            });
          });
        });
        
        setFlattenedSlots(allSlots);
        console.log('Loaded slots:', allSlots.length);
        console.log('Available classes:', Object.keys(response.data));
      } else {
        setSlots({}); // Empty object for parent
        setFlattenedSlots([]); // Empty array for local use
        console.log('No slots found for session:', session);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
      setSlots({}); // Empty object for parent
      setFlattenedSlots([]); // Empty array for local use
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and session change
  useEffect(() => {
    fetchSlots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  // Filter slots based on search text, status filter, and class filter
  const filteredSlots = flattenedSlots.filter(slot => {
    let matchesSearch = true;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const student = slot.medicineRequest?.student;
      
      matchesSearch = (
        student?.fullName?.toLowerCase().includes(searchLower) ||
        student?.studentCode?.toLowerCase().includes(searchLower) ||
        slot.className?.toLowerCase().includes(searchLower) ||
        slot.note?.toLowerCase().includes(searchLower)
      );
    }

    let matchesStatus = true;
    if (statusFilter === 'taken') {
      matchesStatus = slot.status === true;
    } else if (statusFilter === 'not-taken') {
      matchesStatus = slot.status === false;
    }

    // Use the classFilter prop from parent component
    let matchesClass = true;
    if (classFilter !== 'all') {
      const slotClass = slot.className || slot.medicineRequest?.student?.class;
      matchesClass = slotClass === classFilter;
    }

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Handle Excel file upload
  const handleExcelUpload = async (file) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await slotService.importSlots(formData);
      
      if (response.status) {
        toast.success('Import dữ liệu thành công!');
        fetchSlots();
      } else {
        message.error('Import thất bại!');
      }
      
    } catch (error) {
      console.error('Error importing Excel file:', error);
      message.error('Có lỗi xảy ra khi import dữ liệu!');
    } finally {
      setUploading(false);
    }
    
    return false;
  };

  // Handle check slot (mark as taken) with image
  const handleCheckSlot = async (slot, imageFile = null) => {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await slotService.checkSlot(slot.id, formData);
      
      if (response.status) {
        message.success('Đã đánh dấu thuốc đã phát!');
        fetchSlots();
        setCheckModalVisible(false);
        setSelectedSlotForCheck(null);
        setCheckImage(null);
      } else {
        message.error('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error checking slot:', error);
      message.error('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleViewDetail = (slot) => {
    setSelectedRecord(slot);
    setDetailModalVisible(true);
  };

  const handleMarkAsTaken = (slot) => {
    setSelectedSlotForCheck(slot);
    setCheckModalVisible(true);
  };

  const handleCardClick = (filterType) => {
    setStatusFilter(filterType);
    setActiveCard(filterType);
  };

  // Get current time info for display
  const getCurrentTimeInfo = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return {
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      session: getCurrentSession(),
      isAutoSelected: !isManualSelection && selectedSession === getCurrentSession()
    };
  };

  const timeInfo = getCurrentTimeInfo();

  return (
    <div className="w-full h-[90%] flex flex-col">
      <Header
        selectedSession={selectedSession}
        onSessionChange={handleSessionChange}
        onRefresh={() => fetchSlots()}
        onExcelUpload={handleExcelUpload}
        loading={loading}
        timeInfo={timeInfo}
        uploading={uploading}
        resetToAutoSelection={resetToAutoSelection}
        currentTimeSession={getCurrentSession()}
      />

      <StatisticsCards
        slots={filteredSlots}
        selectedSession={selectedSession}
        activeCard={activeCard}
        onCardClick={handleCardClick}
      />

      <MedicineTable
        slots={filteredSlots}
        loading={loading}
        onViewDetail={handleViewDetail}
        onMarkAsTaken={handleMarkAsTaken}
      />

      <CheckModal
        visible={checkModalVisible}
        slot={selectedSlotForCheck}
        checkImage={checkImage}
        onClose={() => {
          setCheckModalVisible(false);
          setSelectedSlotForCheck(null);
          setCheckImage(null);
        }}
        onConfirm={handleCheckSlot}
        onImageChange={setCheckImage}
      />

      <DetailModal
        visible={detailModalVisible}
        record={selectedRecord}
        onClose={() => setDetailModalVisible(false)}
        onMarkAsTaken={(record) => {
          handleMarkAsTaken(record);
          setDetailModalVisible(false);
        }}
      />
    </div>
  );
};

export default MedicineDistribution;
