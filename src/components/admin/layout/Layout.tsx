import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";


const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const navItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Products", path: "/admin/products", icon: <Package size={20} /> },
    {
      title: "Categories",
      path: "/admin/categories",
      icon: <Tags size={20} />,
    },
    { title: "Accounts", path: "/admin/accounts", icon: <Users size={20} /> },
    {
      title: "Permissions",
      path: "/admin/permissions",
      icon: <ShieldCheck size={20} />,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out z-20 fixed h-full`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-[#C8A846]">LUNAR ADMIN</h1>
          ) : (
            <h1 className="text-xl font-bold text-[#C8A846]">LA</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-[#C8A846] text-white"
                      : "text-gray-600 hover:bg-[#f5ecd1] hover:text-[#C8A846]"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
            <li className="mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-[#f5ecd1] hover:text-[#C8A846]"
                onClick={() => alert("Logging out...")}
              >
                <span className="mr-3">
                  <LogOut size={20} />
                </span>
                {isSidebarOpen && <span>Log Out</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

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
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2"
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`${
                      isSidebarOpen ? "hidden md:block" : "hidden"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Admin User
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-20">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => alert("Logging out...")}
                    >
                      Sign out
                    </button>
                  </div>
                )}
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
