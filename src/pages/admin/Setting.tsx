import React, { useState } from "react";
import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";

const Setting: React.FC<AuthProps> = () => {
  const [activeTab, setActiveTab] = useState("User & Role Management");

  const settingsMenuItems = [
    "User & Role Management",
    "Site Settings",
    "Email Settings",
    "Payment Settings",
    "Notification Settings",
    "Security Settings",
    "Storage Settings",
    "SEO & Metadata",
    "Integration / API",
    "Logs / Audit",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <div
            className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium"
            style={{ backgroundColor: "#C8A846" }}
          >
            1
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-1">
              {settingsMenuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item
                      ? "text-white border-l-4"
                      : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  style={
                    activeTab === item
                      ? {
                          backgroundColor: "#C8A846",
                          borderLeftColor: "#C8A846",
                        }
                      : {}
                  }
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab}
              </h2>
              <p className="text-gray-600">
                Manage users and system permissions
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  User Management
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum number of users
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      borderColor: "var(--focus-border, #d1d5db)",
                    }}
                    onFocus={(e) =>
                      e.target.style.setProperty("--focus-border", "#C8A846")
                    }
                    onBlur={(e) =>
                      e.target.style.setProperty("--focus-border", "#d1d5db")
                    }
                    defaultValue="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Allow user registration
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: "var(--toggle-bg, #e5e7eb)",
                        }}
                        ref={(el) => {
                          if (el) {
                            const checkbox = el.previousElementSibling as HTMLInputElement | null;
                            const updateToggle = () => {
                              el.style.setProperty(
                                "--toggle-bg",
                                checkbox?.checked ? "#C8A846" : "#e5e7eb"
                              );
                            };
                            checkbox?.addEventListener("change", updateToggle);
                            updateToggle(); 
                          }
                        }}
                      ></div>
                    </label>
                    <span className="ml-3 text-sm text-gray-700">Enabled</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Require email verification
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8A846] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8A846]"></div>
                    </label>
                    <span className="ml-3 text-sm text-gray-700">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Role Management
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default role for new users
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C8A846] focus:border-[#C8A846] text-sm">
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Allow multiple roles for one user
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8A846] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8A846]"></div>
                    </label>
                    <span className="ml-3 text-sm text-gray-700">Disabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Login & Security
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto logout time (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C8A846] focus:border-[#C8A846] text-sm"
                    defaultValue="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum failed login attempts
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C8A846] focus:border-[#C8A846] text-sm"
                    defaultValue="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account lockout duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#C8A846] focus:border-[#C8A846] text-sm"
                    defaultValue="15"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]">
                Cancel
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C8A846] hover:bg-[#897334] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithSetting = isLoginAdminAuth(Setting);
export default WithSetting;
