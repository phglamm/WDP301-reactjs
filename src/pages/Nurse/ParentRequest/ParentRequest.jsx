import { useState, useEffect } from "react";
import CardData from "../../../components/CardData/CardData";
import { useMedicineRequest } from "./useMedicineRequest";
import { filterRequests, generateReportData } from "./requestFilters";
import RequestDetailModal from "../../../components/ParentRequest/RequestDetailModal/RequestDetailModal";
import CreateRequestModal from "../../../components/ParentRequest/CreateRequestModal/CreateRequestModal";
import RequestTable from "../../../components/ParentRequest/RequestTable/RequestTable";


const ParentRequest = () => {
  const {
    allMedicineRequest,
    medicineRequestToday,
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    getRequestById
  } = useMedicineRequest();

  // State management
  const [selectedCardTitle, setSelectedCardTitle] = useState("Tất cả yêu cầu (trong hôm nay)");
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Update current data when medicine requests change
  useEffect(() => {
    setCurrentData(medicineRequestToday);
  }, [medicineRequestToday]);

  // Filter data based on search term
  useEffect(() => {
    setFilteredData(filterRequests(currentData, searchTerm));
  }, [searchTerm, currentData]);

  // Event handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCardClick = (item) => {
    setCurrentData(item.data);
    setSelectedCardTitle(`${item.title} (${item.subtitle})`);
    setSearchTerm("");
  };

  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleDetailClick = async (record) => {
    console.log("Selected record:", record);
    setDetailLoading(true);
    setIsDetailModalVisible(true);
    
    const requestData = await getRequestById(record.id);
    if (requestData) {
      setSelectedRequest(requestData);
    } else {
      setIsDetailModalVisible(false);
    }
    setDetailLoading(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedRequest(null);
  };

  // Generate report data
  const generalReport = generateReportData(medicineRequestToday, allMedicineRequest);

  return (
    <div className="w-full h-full pt-[2%]">
      <div className="w-full flex flex-wrap justify-between items-center mb-4">
        {/* Report Cards */}
        {generalReport.map((item, index) => (
          <CardData
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
            onClick={() => handleCardClick(item)}
          />
        ))}

        {/* Table */}
        <div className="w-full flex flex-wrap justify-center items-center">
          <RequestTable
            data={filteredData}
            title={selectedCardTitle}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onCreateClick={handleCreateClick}
            onDetailClick={handleDetailClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateRequestModal
        visible={isCreateModalVisible}
        onCancel={handleCreateCancel}
        onSubmit={createRequest}
        loading={loading}
      />

      <RequestDetailModal
        visible={isDetailModalVisible}
        onCancel={handleDetailCancel}
        request={selectedRequest}
        loading={detailLoading}
        onApprove={approveRequest}
        onReject={rejectRequest}
      />
    </div>
  );
};

export default ParentRequest;