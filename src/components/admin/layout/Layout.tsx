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
    <div className="flex h-screen bg-gray-100">
      <Navigation
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
      />
      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <header
          className="bg-white shadow-sm h-16 fixed right-0 left-0 z-10"
          style={{ left: isSidebarOpen ? "16rem" : "5rem" }}
        >
          <div className="flex items-center justify-between h-full px-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`${
                      isSidebarOpen ? "hidden md:block" : "hidden"
                    }`}
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

        <main className="pt-24 pb-8 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
