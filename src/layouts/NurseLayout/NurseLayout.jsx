import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Breadcrumb } from "antd";

export default function NurseLayout() {
  const [selectedItem, setSelectedItem] = useState('');
  const location = useLocation();
  
  // Function to generate breadcrumb items from the current path
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbItems = pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Capitalize first letter and format the name
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      
      return {
        title: isLast ? formattedName : <a href={routeTo}>{formattedName}</a>,
        key: routeTo,
      };
    });
    
    return breadcrumbItems;
  };
  
  return (
    <div className="flex h-screen w-screen">
      <div className="lg:w-[20%] md:w-[40%] sm:w-[40%] w-[40%] overflow-hidden">
        <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </div>
      <div className="lg:w-[80%] md:w-[60%] sm:w-[60%] w-[60%] p-[2%] overflow-hidden">
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
