import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between flex-col wrapper w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center mb-8">
        {/* <img src={logo} alt="Admin Logo" className="w-10 h-10 rounded-full" /> */}
        <h1 className="text-2xl font-bold ml-3">Admin</h1>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/customers">Customers</Link>
        <Link to="/admin/settings">Settings</Link>
      </div>
      <div className="mt-auto flex justify-end flex-col gap-2">
        <button
          onClick={() => {
            navigate("/admin/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
