import { useState } from "react";
import { Search, Edit, Trash2, UserPlus, Lock, User } from "lucide-react";
import { useFindUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { UserType } from "@/types/user";
import Pagination from "@/components/admin/pagination";
import PermissionModal from "./modals/permision-modal";
import AddModal from "./modals/add-modal";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import { useDeleteUser } from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import IsLoadingWrapper from "@/components/wrapper/isLoading";
import { Role } from "@/types";

const AdminAccount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<UserType | null>(null);
  const [page, setPage] = useState(1);
  const [currentRole, setCurrentRole] = useState(Role.CUSTOMER);
  const { mutate: deleteUser } = useDeleteUser();
  const {
    data: accounts,
    isLoading,
    refetch,
    total,
  } = useFindUser({
    email: "",
    role: [currentRole],
    page: page,
    limit: page * 10,
  });
  const totalPages = Math.ceil(total / (page * 10));

  const filteredAccounts = accounts.filter(
    (account: UserType) =>
      account?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (account: UserType) => {
    setCurrentAccount(account);
    setTimeout(() => {
      setShowAddModal(true);
    }, 0);
  };

  const handleDelete = (account: UserType) => {
    deleteUser(account.id as string);
    setShowDeleteModal(false);
    refetch();
  };

  const handlePermissions = (account: UserType) => {
    setCurrentAccount(account);
    setShowPermissionsModal(true);
  };

  return (
    <>
      <IsLoadingWrapper isLoading={isLoading}>
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                User Accounts
              </h1>
              <p className="text-gray-600">
                Manage user accounts and permissions
              </p>
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
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as Role)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                >
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["User", "Role", "Status", "Created At", "Actions"].map(
                      (item, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {item}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account: UserType) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {account?.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={account?.avatar as unknown as string}
                                alt={account.firstName}
                              />
                            ) : (
                              <div className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded-full flex items-center justify-center">
                                <User size={25} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {account.firstName} {account.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {account.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {account.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            account.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-left ml-2 items-center space-x-2">
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
                            onClick={() => {
                              setCurrentAccount(account);
                              setShowDeleteModal(true);
                            }}
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
            <Pagination
              filteredProducts={filteredAccounts}
              setPage={setPage}
              page={page}
              totalPages={totalPages}
              totalItems={total}
            />
            <AddModal
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
              currentAccount={currentAccount}
              refetch={refetch}
            />
            <PermissionModal
              showPermissionsModal={showPermissionsModal}
              setShowPermissionsModal={setShowPermissionsModal}
              currentAccount={currentAccount}
            />
            <DeleteConfirmModal
              showDeleteModal={showDeleteModal}
              setShowDeleteModal={setShowDeleteModal}
              onDelete={() => {
                handleDelete(currentAccount as UserType);
              }}
            />
          </div>
        </>
      </IsLoadingWrapper>
    </>
  );
};

export default AdminAccount;
