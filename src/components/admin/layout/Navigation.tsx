import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuthAction } from "@/shared/hooks/useAuthAction";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import UserList from "../ui/user/UserList";
import { Role } from "@/shared/types";

type NavigationProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  navItems: {
    title: string;
    path: string;
    icon: React.ReactNode;
    roles: Role[];
  }[];
};

function Navigation({
  isSidebarOpen,
  toggleSidebar,
  navItems,
}: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuthAction();
  const { data: user } = useGetUser();

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 ease-in-out z-20 fixed h-screen flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold text-[#C8A846]">LUNAR ADMIN</h1>
        ) : (
          <h1 className="text-xl font-bold text-[#C8A846]">LA</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <nav className="flex-shrink-0 px-2 pt-4">
          <ul className="space-y-2">
            {navItems.map(
              (item) =>
                item.roles.includes(user?.role) && (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-[#C8A846] text-white shadow-md"
                          : "text-gray-600 hover:bg-[#f5ecd1] hover:text-[#C8A846]"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {isSidebarOpen && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto px-2 mt-6">
            <div className="mb-4">
              <div className="space-y-1">
                <UserList />
              </div>
            </div>
          </div>
        )}

        {!isSidebarOpen && (
          <div className="flex-1 justify-center mr-4 overflow-y-auto px-1 mt-6">
            <div className="space-y-1">
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="relative cursor-pointer flex flex-row items-center justify-between group">
          {isSidebarOpen && (
            <div
              onClick={() => navigate("/admin/profile")}
              className="flex items-center space-x-3 flex-1 min-w-0 transition-all duration-300 ease-in-out"
            >
              <div className="relative">
                <div className="p-0.5 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-inner transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-gray-800 truncate transition-colors duration-200 group-hover:text-amber-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs font-medium text-gray-500 truncate bg-gray-100 px-2 py-0.5 rounded-full mt-1 transition-all duration-200 group-hover:bg-amber-50 group-hover:text-amber-600">
                  {user?.role}
                </span>
              </div>
            </div>
          )}

          <div className="relative">
            <button
              className="group/logout flex items-center justify-center p-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md border border-transparent hover:border-red-200"
              onClick={() => {
                handleLogout();
                navigate("/admin/login");
              }}
              title="Sign out"
            >
              <LogOut
                size={20}
                className="transition-all duration-300 group-hover/logout:rotate-12"
              />

              {isSidebarOpen && (
                <div className="absolute right-full mr-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/logout:opacity-100 group-hover/logout:visible transition-all duration-300 whitespace-nowrap shadow-lg z-50">
                  Sign out
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                </div>
              )}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
