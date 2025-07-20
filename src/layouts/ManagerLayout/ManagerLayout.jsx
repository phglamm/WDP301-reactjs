import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Breadcrumb } from "antd";

export default function ManagerLayout() {
  const [selectedItem, setSelectedItem] = useState("");
  const location = useLocation();  // Vietnamese path translations for manager
  const pathTranslations = {
    'manager': 'Quản lý',
    'manager-slot': 'Quản lý ca làm việc',
    'user-management': 'Quản lý người dùng',
    'studentlist': 'Danh sách học sinh',
    'parentrequest': 'Yêu cầu phụ huynh',
    'medicine': 'Thuốc và Vật Tư',
    'injection-event': 'Sự kiện tiêm chủng',
    'health-event': 'Khám sức khỏe',
    'appointment': 'Lịch hẹn',
    'health-profile': 'Hồ sơ sức khỏe',
    'drug-information': 'Thông tin thuốc',
    'vaccine-reminder': 'Nhắc nhở vaccine',
    'health-history': 'Lịch sử sức khỏe'
  };

  // Function to generate breadcrumb items from the current path
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbItems = pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;

      // Get Vietnamese translation or fallback to formatted name
      const translatedName = pathTranslations[name] || name.charAt(0).toUpperCase() + name.slice(1);

      return {
        title: isLast ? translatedName : <a href={routeTo}>{translatedName}</a>,
        key: routeTo,
      };
    });

    return breadcrumbItems;
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Fixed Sidebar - 5% width */}
      <div className="w-[5%] fixed left-0 top-0 h-full overflow-hidden bg-white shadow-lg z-10">
        <Sidebar
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
      
      {/* Main Content Area - 95% width with left margin */}
      <div className="w-[95%] ml-[5%] overflow-y-auto">
        <div className="p-6">
          <div className="text-2xl font-bold mb-1 text-gray-800">{selectedItem}</div>
          <Breadcrumb
            items={generateBreadcrumbItems()}
            separator="/"
            className="mt-1 mb-4"
          />
          <div className="bg-white rounded-lg shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
