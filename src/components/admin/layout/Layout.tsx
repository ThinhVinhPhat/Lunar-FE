import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import { navItems } from "../../../database/admin/layout";
import Navigation from "./Navigation";
import { useGetUser } from "../../../hooks/queryClient/query/user";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: user } = useGetUser();
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
        <header
          className="bg-white shadow-sm h-16 fixed right-0 left-0 z-10 w-full"
          style={{ 
            left: isSidebarOpen ? (window.innerWidth >= 768 ? "16rem" : "0") : (window.innerWidth >= 768 ? "5rem" : "0") 
          }}
        >
          <div className="flex items-center justify-between h-full px-3 md:px-24">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
                <Bell size={window.innerWidth >= 768 ? 20 : 18} />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                  />
                  <div
                    className="hidden md:block"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 md:pt-24 pb-6 md:pb-8 px-3 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
