import { useState } from "react";
import { Outlet } from "react-router-dom";
import { navItems } from "@/database/admin/layout";
import Navigation from "./Navigation";
import Header from "./Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100">
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
      <Header isSidebarOpen={isSidebarOpen} />

      <main className="pt-20 md:pt-24 pb-6 md:pb-8 px-3 md:px-6">
        <Outlet />
      </main>
      </div>
    </div>
  );
};

export default AdminLayout;
