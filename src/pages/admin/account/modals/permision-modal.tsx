import { Role } from "@/shared/types";
import { UserType } from "@/shared/types/user";
import { Lock } from "lucide-react";
type PermissionModalProps = {
  showPermissionsModal: boolean;
  setShowPermissionsModal: (show: boolean) => void;
  currentAccount: UserType | null;
};

function PermissionModal({
  showPermissionsModal,
  setShowPermissionsModal,
  currentAccount,
}: PermissionModalProps) {
  return (
    showPermissionsModal && (
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
                    Manage Permissions for {currentAccount?.firstName}{" "}
                    {currentAccount?.lastName}
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

                    <div className="space-y-4">
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
                                currentAccount?.role === Role.ADMIN
                              }
                              className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>

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
                                currentAccount?.role === Role.ADMIN
                              }
                              className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>

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
                                currentAccount?.role === Role.ADMIN ||
                                currentAccount?.role === Role.ENGINEER
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
                                currentAccount?.role === Role.ADMIN ||
                                currentAccount?.role === Role.ENGINEER
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
                                currentAccount?.role === Role.ADMIN
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
                                currentAccount?.role === Role.ADMIN
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
    )
  );
}

export default PermissionModal;
