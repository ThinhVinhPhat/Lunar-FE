import  { useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
  Lock,
} from "lucide-react";

type Account = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  image: string;
};

const AdminAccount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  // Sample account data
  const accounts = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Administrator",
      status: "Active",
      lastLogin: "2023-06-01 14:23",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-05-29 09:45",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "Active",
      lastLogin: "2023-05-30 16:12",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Viewer",
      status: "Inactive",
      lastLogin: "2023-05-15 11:30",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 5,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-05-31 08:55",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  ];

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (account: Account) => {
    setCurrentAccount(account);
    setShowAddModal(true);
  };

  const handleDelete = (account: Account) => {
    setCurrentAccount(account);
    setShowDeleteModal(true);
  };

  const handlePermissions = (account: Account) => {
    setCurrentAccount(account);
    setShowPermissionsModal(true);
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Accounts</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => {
            setCurrentAccount(null);
            setShowAddModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
        >
          <UserPlus size={16} className="mr-2" />
          Add Account
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search accounts..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filters
            </button>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
              <option value="">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={account.image}
                          alt={account.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handlePermissions(account)}
                        className="text-[#C8A846] hover:text-[#b39539]"
                      >
                        <Lock size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(account)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredAccounts.length}</span>{" "}
                of <span className="font-medium">{accounts.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={16} />
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[#C8A846]"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentAccount ? "Edit Account" : "Add New Account"}
                    </h3>
                    <div className="mt-4">
                      {/* Form fields */}
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={currentAccount?.name}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue={currentAccount?.email}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          />
                        </div>
                        {!currentAccount && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            defaultValue={currentAccount?.role}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          >
                            <option value="Administrator">Administrator</option>
                            <option value="Manager">Manager</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            defaultValue={currentAccount?.status}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentAccount ? "Save Changes" : "Add Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the account for{" "}
                        <strong>{currentAccount?.name}</strong>? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#f5ecd1] sm:mx-0 sm:h-10 sm:w-10">
                    <Lock className="h-6 w-6 text-[#C8A846]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Manage Permissions for {currentAccount?.name}
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">
                              Role: {currentAccount?.role}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Set specific permissions for this user
                            </p>
                          </div>
                          <div>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                currentAccount?.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {currentAccount?.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Permission Sections */}
                      <div className="space-y-4">
                        {/* Dashboard Permissions */}
                        <div className="border border-gray-200 rounded-md p-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Dashboard
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                View Dashboard
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Products Permissions */}
                        <div className="border border-gray-200 rounded-md p-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Products
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                View Products
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Add Products
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Edit Products
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Delete Products
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Categories Permissions */}
                        <div className="border border-gray-200 rounded-md p-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Categories
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                View Categories
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Add Categories
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Edit Categories
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Delete Categories
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>

                        {/* User Management Permissions */}
                        <div className="border border-gray-200 rounded-md p-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            User Management
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                View Users
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Add Users
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator" ||
                                  currentAccount?.role === "Manager"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Edit Users
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator" ||
                                  currentAccount?.role === "Manager"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Delete Users
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm text-gray-700">
                                Manage Permissions
                              </label>
                              <input
                                type="checkbox"
                                defaultChecked={
                                  currentAccount?.role === "Administrator"
                                }
                                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Permissions
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAccount;
