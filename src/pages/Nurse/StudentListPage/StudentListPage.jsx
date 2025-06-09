import { Segmented, Tabs } from "antd";
import { useEffect, useState } from "react";
import AllStudent from "./AllStudent/AllStudent";
import MedicineDistribution from "./MedicineDistribution/MedicineDistribution";
import AccidentCase from "./AccidentCase/AccidentCase";
import CardData from "../../../components/CardData/CardData";
import studentService from "../../../services/StudentService/StudentService";

const StudentListPage = () => {
  const [selectedTab, setSelectedTab] = useState("Tất Cả");
  const [students, setStudents] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [medicineRequests, setMedicineRequests] = useState([]);
  const generalReport = [
    {
      title: "Tổng Số Học Sinh",
      value: students.length,
      subtitle: "trong trường",
    },
    {
      title: "Học Sinh Nhận Thuốc",
      value: 80,
      subtitle: "trong hôm nay",
    },
    {
      title: "Các Trường Hợp Tai Nạn",
      value: accidents.length,
      subtitle: "trường hợp cần theo dõi",
    },
  ];


  
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAllStudents();
        setStudents(response.data);
      }
      catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    const fetchAccidents = async () => {
      try {
        const response = await studentService.getAllAccident();
        setAccidents(response.data);
      } catch (error) {
        console.error("Error fetching accidents:", error);
      }
    }

    const fetchMedicineRequests = async () => {
      try {
        const response = await studentService.getMedicineRequest();
        setMedicineRequests(response.data);
      } catch (error) {
        console.error("Error fetching medicine requests:", error);
      }
    }

  useEffect(() => {
    fetchStudents();
    fetchAccidents();
    fetchMedicineRequests();
  }
  , []);

  return (
    <div className=" w-full h-full pt-[2%]">
      <div className="w-full flex flex-wrap justify-center gap-10 items-center mb-4">
        {generalReport.map((item, index) => (
          <CardData
            key={index}
            title={item.title}
            value={item.value}
            subTitle={item.subtitle}
          />
        ))}
      </div>

      <Segmented
        size="large"
        style={{ width: "100%", marginBottom: "20px" }}
        block
        options={["Tất Cả", "Phân Phối Thuốc", "Các Trường Hợp Tai Nạn"]}
        onChange={(value) => {
          setSelectedTab(value);
        }}
      />

      {selectedTab === "Tất Cả" ? (
        <AllStudent students={students} />
      ) : selectedTab === "Phân Phối Thuốc" ? (
        <MedicineDistribution medicineRequests={medicineRequests} />
      ) : selectedTab === "Các Trường Hợp Tai Nạn" ? (
        <AccidentCase accidents={accidents} />
      ) : null}
    </div>
  );
};

export default StudentListPage;
