import { Segmented, Tabs } from "antd";
import { useState } from "react";
import AllStudent from "./AllStudent/AllStudent";
import MedicineDistribution from "./MedicineDistribution/MedicineDistribution";
import AccidentCase from "./AccidentCase/AccidentCase";
import CardData from "../../../components/CardData/CardData";

const StudentListPage = () => {
  const [selectedTab, setSelectedTab] = useState("Tất Cả");
  const generalReport = [
    {
      title: "Tổng Số Học Sinh",
      value: 120,
      subtitle: "trong trường",
    },
    {
      title: "Học Sinh Nhận Thuốc",
      value: 80,
      subtitle: "trong hôm nay",
    },
    {
      title: "Các Trường Hợp Tai Nạn",
      value: 40,
      subtitle: "trường hợp cần theo dõi",
    },
  ];
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
        <AllStudent />
      ) : selectedTab === "Phân Phối Thuốc" ? (
        <MedicineDistribution />
      ) : selectedTab === "Các Trường Hợp Tai Nạn" ? (
        <AccidentCase />
      ) : null}
    </div>
  );
};

export default StudentListPage;
