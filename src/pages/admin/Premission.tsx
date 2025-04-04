import React, { useState } from "react";
import AdminLayout from "../../components/admin/layout/Layout";
import { Search, Edit, Save, Shield, CheckCircle, XCircle } from "lucide-react";

const Permissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Sample roles data
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full access to all features",
      users: 1,
    },
    {
      id: 2,
      name: "Manager",
      description: "Can manage most content but cannot manage users",
      users: 2,
    },
    {
      id: 3,
      name: "Editor",
      description: "Can edit content but cannot delete",
      users: 1,
    },
    {
      id: 4,
      name: "Viewer",
      description: "Can only view content",
      users: 1,
    },
  ];

  // Sample permissions
  const permissionGroups = [
    {
      name: "Dashboard",
      permissions: [
        {
          id: "dashboard_view",
          name: "View Dashboard",
          roles: ["Administrator", "Manager", "Editor", "Viewer"],
        },
      ],
    },
    {
      name: "Products",
      permissions: [
        {
          id: "products_view",
          name: "View Products",
          roles: ["Administrator", "Manager", "Editor", "Viewer"],
        },
        {
          id: "products_create",
          name: "Create Products",
          roles: ["Administrator", "Manager", "Editor"],
        },
        {
          id: "products_edit",
          name: "Edit Products",
          roles: ["Administrator", "Manager", "Editor"],
        },
        {
          id: "products_delete",
          name: "Delete Products",
          roles: ["Administrator", "Manager"],
        },
      ],
    },
    {
      name: "Categories",
      permissions: [
        {
          id: "categories_view",
          name: "View Categories",
          roles: ["Administrator", "Manager", "Editor", "Viewer"],
        },
        {
          id: "categories_create",
          name: "Create Categories",
          roles: ["Administrator", "Manager"],
        },
        {
          id: "categories_edit",
          name: "Edit Categories",
          roles: ["Administrator", "Manager"],
        },
        {
          id: "categories_delete",
          name: "Delete Categories",
          roles: ["Administrator"],
        },
      ],
    },
    {
      name: "User Management",
      permissions: [
        {
          id: "users_view",
          name: "View Users",
          roles: ["Administrator", "Manager"],
        },
        { id: "users_create", name: "Create Users", roles: ["Administrator"] },
        { id: "users_edit", name: "Edit Users", roles: ["Administrator"] },
        { id: "users_delete", name: "Delete Users", roles: ["Administrator"] },
        {
          id: "users_permissions",
          name: "Manage Permissions",
          roles: ["Administrator"],
        },
      ],
    },
  ];

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Roles & Permissions
          </h1>
          <p className="text-gray-600">
            Manage access control for your application
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
        >
          {isEditing ? (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit size={16} className="mr-2" />
              Edit Permissions
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
          />
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-[#C8A846]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
              </div>
              <Shield
                size={24}
                className={
                  role.name === "Administrator"
                    ? "text-red-500"
                    : role.name === "Manager"
                    ? "text-[#C8A846]"
                    : role.name === "Editor"
                    ? "text-blue-500"
                    : "text-gray-500"
                }
              />
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-gray-500">
                {role.users} user{role.users !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            Permission Matrix
          </h2>
          <p className="text-sm text-gray-500">
            Configure which roles have access to which features
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissionGroups.map((group, groupIndex) => (
                <React.Fragment key={group.name}>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={roles.length + 1}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {group.name}
                    </td>
                  </tr>
                  {group.permissions.map((permission, permIndex) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.name}
                      </td>
                      {roles.map((role) => (
                        <td
                          key={role.id}
                          className="px-6 py-4 whitespace-nowrap text-center"
                        >
                          {isEditing ? (
                            <input
                              type="checkbox"
                              defaultChecked={permission.roles.includes(
                                role.name
                              )}
                              className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                            />
                          ) : permission.roles.includes(role.name) ? (
                            <CheckCircle
                              size={20}
                              className="mx-auto text-green-500"
                            />
                          ) : (
                            <XCircle
                              size={20}
                              className="mx-auto text-gray-300"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Permissions;
