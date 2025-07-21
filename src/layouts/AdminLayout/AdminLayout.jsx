import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Breadcrumb } from "antd";

export default function AdminLayout() {
  const [selectedItem, setSelectedItem] = useState("Quản lý người dùng");
  const location = useLocation();

  // Path translations for breadcrumb
  const pathTranslations = {
    admin: "Quản trị viên",
    userManagement: "Quản lý người dùng",
    parentrequest: "Yêu cầu từ phụ huynh", 
    medicine: "Thuốc và Vật Tư",
    "injection-event": "Tiêm Chủng",
    "health-event": "Khám Sức Khỏe",
    appointment: "Lịch Hẹn"
  };

  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbItems = pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Get Vietnamese translation or use formatted English name as fallback
      const translatedName = pathTranslations[name] || name.charAt(0).toUpperCase() + name.slice(1);
      
      return {
        title: isLast ? translatedName : <a href={routeTo}>{translatedName}</a>,
        key: routeTo,
      };
    });
    
    return breadcrumbItems;
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="w-[5%] fixed left-0 top-0 h-full z-10">
        <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </div>
      <div className="ml-[5%] p-[2%] overflow-y-auto h-full">
        <div className="text-2xl font-bold mb-1">{selectedItem}</div>
        <Breadcrumb
          items={generateBreadcrumbItems()}
          separator="/"
          className="mt-1"
        />
        <Outlet />
      </div>
    </div>
  );
}
