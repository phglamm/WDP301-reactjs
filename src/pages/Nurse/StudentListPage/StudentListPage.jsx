import { Segmented, Select } from "antd";
import { useEffect, useState } from "react";
import AllStudent from "./AllStudent/AllStudent";
import MedicineDistribution from "./MedicineDistribution/MedicineDistribution";
import AccidentCase from "./AccidentCase/AccidentCase";
import CardData from "../../../components/CardData/CardData";
import studentService from "../../../services/StudentService/StudentService";
import Search from "antd/es/input/Search";
import { useMedicineRequest } from "../ParentRequest/useMedicineRequest";

const StudentListPage = () => {
  const [selectedTab, setSelectedTab] = useState("Tất Cả");
  const [students, setStudents] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  const {medicineRequestToday } = useMedicineRequest();

  const generalReport = [
    {
      title: "Tổng Số Học Sinh",
      value: students.length,
      subtitle: "trong trường",
    },
    {
      title: "Học Sinh Nhận Thuốc",
      value: medicineRequestToday.length,
      subtitle: "trong hôm nay",
    },
    {
      title: "Các Trường Hợp Tai Nạn",
      value: accidents.length,
      subtitle: "trường hợp cần theo dõi",
    },
  ];


  // Map card titles to segmented options
  const getSegmentedValue = (cardTitle) => {
    switch (cardTitle) {
      case "Tổng Số Học Sinh":
        return "Tất Cả";
      case "Học Sinh Nhận Thuốc":
        return "Phân Phối Thuốc";
      case "Các Trường Hợp Tai Nạn":
        return "Các Trường Hợp Tai Nạn";
      default:
        return "Tất Cả";
    }
  };

  const handleCardClick = (cardTitle) => {
    const segmentedValue = getSegmentedValue(cardTitle);
    setSelectedTab(segmentedValue);
  };
  
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAllStudents();
        // Handle different response structures
        if (Array.isArray(response)) {
          setStudents(response);
        } else if (response && Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.log('Unexpected response structure:', response);
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    };

    const fetchAccidents = async () => {
      try {
        const response = await studentService.getAllAccident();
        if (Array.isArray(response)) {
          setAccidents(response);
        } else if (response && Array.isArray(response.data)) {
          setAccidents(response.data);
        } else {
          console.log('Unexpected response structure:', response);
          setAccidents([]);
        }
      } catch (error) {
        console.error("Error fetching accidents:", error);
        setAccidents([]);
      }
    };



  // Get unique classes from students
  const getUniqueClasses = () => {
    const classes = students
      .map(student => student.class)
      .filter(cls => cls && cls.trim() !== '');
    return [...new Set(classes)];
  };

  useEffect(() => {
    fetchStudents();
    fetchAccidents();
  }, []);

  return (
    <div className="w-full h-full pt-[1%]">
      <div className="w-full flex flex-wrap justify-center gap-10 items-center mb-4">
        {generalReport.map((item, index) => (
          <CardData
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
            onClick={() => handleCardClick(item.title)}
          />
        ))}
      </div>

      <Segmented
        size="large"
        style={{ width: "100%", marginBottom: "20px" }}
        block
        options={["Tất Cả", "Phân Phối Thuốc", "Các Trường Hợp Tai Nạn"]}
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value);
        }}
      />

      {/* Search and Filter Controls */}
      <div className="w-full flex items-center justify-end  gap-4 mb-4">
        <Search
          placeholder={
            selectedTab === "Tất Cả" ? "Search students..." :
            selectedTab === "Phân Phối Thuốc" ? "Search medicine requests..." :
            "Search accidents..."
          }
          allowClear
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => setSearchText(value)}
        />
        
        {selectedTab === "Tất Cả" && (
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            placeholder="Select class"
          >
            <Select.Option value="all">All Classes</Select.Option>
            {getUniqueClasses().map(cls => (
              <Select.Option key={cls} value={cls}>{cls}</Select.Option>
            ))}
          </Select>
        )}
      </div>

      {/* Render selected tab content */}
      {selectedTab === "Tất Cả" ? (
        <AllStudent 
          students={students} 
          searchText={searchText}
          filterType={filterType}
        />
      ) : selectedTab === "Phân Phối Thuốc" ? (
        <MedicineDistribution 
          searchText={searchText}
        />
      ) : selectedTab === "Các Trường Hợp Tai Nạn" ? (
        <AccidentCase 
          accidents={accidents} 
          searchText={searchText}
        />
      ) : null}
    </div>
  );
};

export default StudentListPage;
