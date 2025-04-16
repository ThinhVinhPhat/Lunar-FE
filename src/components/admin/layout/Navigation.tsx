import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuthAction } from "../../../hooks/useAuthAction";

type NavigationProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  navItems: {
    title: string;
    path: string;
    icon: React.ReactNode;
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
  return (
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
              onClick={() => {
                handleLogout();
                navigate("/admin/login");
              }}
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
  );
}

export default Navigation;
