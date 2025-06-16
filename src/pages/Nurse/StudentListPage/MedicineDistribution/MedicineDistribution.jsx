import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import slotService from '../../../../services/SlotService/SlotService';
import toast from 'react-hot-toast';
import Header from '../../../../components/MedicineDistribution/Header/Header';
import StatisticsCards from '../../../../components/MedicineDistribution/StatisticsCards/StatisticsCards';
import MedicineTable from '../../../../components/MedicineDistribution/MedicineTable/MedicineTable';
import CheckModal from '../../../../components/MedicineDistribution/CheckModal/CheckModal';
import DetailModal from '../../../../components/MedicineDistribution/DetailModal/DetailModal';


const MedicineDistribution = ({ searchText }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSession, setSelectedSession] = useState('Sáng');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [selectedSlotForCheck, setSelectedSlotForCheck] = useState(null);
  const [checkImage, setCheckImage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeCard, setActiveCard] = useState('all');

  // Fetch slots data based on selected session
  const fetchSlots = async (session = selectedSession) => {
    try {
      setLoading(true);
      const encodedSession = encodeURIComponent(session);
      console.log('Fetching slots for session:', session, 'encoded:', encodedSession);
      
      const response = await slotService.getSlotTodaty(encodedSession);
      
      if (response.status && response.data) {
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
        setSlots(allSlots);
        console.log('Loaded slots:', allSlots.length);
      } else {
        setSlots([]);
        console.log('No slots found for session:', session);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and session change
  useEffect(() => {
    fetchSlots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  // Filter slots based on search text and status filter
  const filteredSlots = slots.filter(slot => {
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

    return matchesSearch && matchesStatus;
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

  return (
    <div className="w-full h-[90%] flex flex-col">
      <Header
        selectedSession={selectedSession}
        onSessionChange={setSelectedSession}
        onRefresh={() => fetchSlots()}
        onExcelUpload={handleExcelUpload}
        loading={loading}
        uploading={uploading}
      />

      <StatisticsCards
        slots={slots}
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
