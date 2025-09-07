import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";
import FormProfile from "@/shared/components/form/form-profile";
import { useAdminProfile } from "./hooks/useAdminProfile";

type DeviceInfoType = { name: string; value: string; id: number };

const AdminProfile: React.FC<AuthProps> = () => {
  const {
    user,
    isUpdating,
    register,
    handleSubmit,
    setValue,
    isDirty,
    onSubmit,
    isEditing,
    setIsEditing,
    handleNotificationChange,
    saveNotificationSettings,
    getNotificationList,
    deviceInfo,
    inboxMessages,
    unreadCount,
    markAllAsRead,
    deleteAllMessages,
    deleteMessage,
    viewMessageDetails,
    navigateToUserManagement,
    navigateToOrderManagement,
    navigateToDashboard,
    navigateToSettings,
    getPriorityColor,
    getPriorityText,
  } = useAdminProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <FormProfile
          user={user}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          register={register}
          setValue={setValue}
          formState={{ isDirty, isSubmitting: isUpdating }}
          isEditing={isEditing}
          isUpdating={isUpdating}
          setIsEditing={setIsEditing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Admin Tools</h3>
              <div className="space-y-2">
                <button
                  onClick={navigateToUserManagement}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  👥 Quản lý người dùng
                </button>
                <button
                  onClick={navigateToOrderManagement}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  📦 Quản lý đơn hàng
                </button>
                <button
                  onClick={navigateToDashboard}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  📊 Thống kê hệ thống
                </button>
                <button
                  onClick={navigateToSettings}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  ⚙️ Cài đặt hệ thống
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Trạng thái hệ thống
              </h3>
              <div className="space-y-3">
                {deviceInfo?.map((item: DeviceInfoType, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-medium text-green-600">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-3">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Cài đặt thông báo
                </h2>
                <button 
                  onClick={saveNotificationSettings}
                  className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Lưu cài đặt
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Thông báo Email
                    </h3>
                    <div className="space-y-3">
                      {getNotificationList().map(
                        (item, index: number) => (
                          <label key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.value}
                              onChange={() =>
                                handleNotificationChange(item.name)
                              }
                              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {item.name}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Hộp thư đến
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Đánh dấu đã đọc
                  </button>
                  <button 
                    onClick={deleteAllMessages}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                {inboxMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors ${
                      index !== inboxMessages.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } ${!message.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      {message.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium text-sm ${
                            !message.read ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {message.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              message.priority
                            )}`}
                          >
                            {getPriorityText(message.priority)}
                          </span>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {message.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewMessageDetails(message.id.toString())}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Xem chi tiết
                          </button>
                          <button 
                            onClick={() => deleteMessage(message.id.toString())}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthAdminProfile = isLoginAdminAuth(AdminProfile);

export default AuthAdminProfile;
