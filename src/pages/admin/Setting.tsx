import { AuthProps, isLoginAdminAuth } from "../../components/wrapper/withAuth";

const Setting: React.FC<AuthProps> = () => {
  return (
    <div className="flex-1 ml-64 p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
          1
        </div>
      </div>

      <div className="flex gap-5">
        <div className="w-60 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <ul>
            <li className="border-l-4 border-primary bg-primary/10 font-semibold p-3.5 cursor-pointer">
              User & Role Management
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Site Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Email Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Payment Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Notification Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Security Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Storage Settings
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              SEO & Metadata
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Integration / API
            </li>
            <li className="border-l-4 border-transparent p-3.5 cursor-pointer hover:bg-gray-50">
              Logs / Audit
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="pb-4 mb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">User & Role Management</h2>
            <p className="text-gray-500 mt-1">
              Manage users and system permissions
            </p>
          </div>

          <div className="border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">User Management</div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Maximum number of users
              </label>
              <input
                type="number"
                className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value="100"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Allow user registration
              </label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span>Enabled</span>
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Require email verification
              </label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span>Enabled</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Role Management</div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Default role for new users
              </label>
              <select className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>Customer</option>
                <option>Staff</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Allow multiple roles for one user
              </label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span>Disabled</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Login & Security</div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Auto logout time (minutes)
              </label>
              <input
                type="number"
                className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value="30"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Maximum failed login attempts
              </label>
              <input
                type="number"
                className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value="5"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">
                Account lockout duration (minutes)
              </label>
              <input
                type="number"
                className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value="15"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button className="px-4 py-2.5 border border-gray-200 rounded font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2.5 bg-primary text-white rounded font-medium hover:bg-primary-dark">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithSetting = isLoginAdminAuth(Setting);
export default WithSetting;
