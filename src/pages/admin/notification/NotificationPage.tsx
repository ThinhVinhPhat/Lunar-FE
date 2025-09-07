import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Send,
  Users,
  Filter,
  Search,
} from "lucide-react";
import { NotificationTemplate, NotificationType } from "@/shared/types/notification";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import Pagination from "@/components/admin/pagination";
import { AddNotificationModal } from "./modals/AddNotification";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import { formatDate } from "@/lib/ultis/formatDate";
import useNotificationMessageAction from "@/pages/admin/notification/hooks/useNotificationMessageAction";

const NotificationPage = () => {
  const {
    // Data
    paginatedNotifications,
    filteredNotifications,
    totalPages,
    notifiTotalItem,
    
    // Loading states
    isLoading,
    
    // UI State
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    showAddModal,
    setShowAddModal,
    showDeleteModal,
    setShowDeleteModal,
    currentNotification,
    
    // Pagination
    page,
    handlePageChange,
    
    // Helper functions
    getTypeIcon,
    getTypeColor,
    
    // Event handlers
    handleEdit,
    handleCreateNew,
    handleDeleteClick,
    handleSubmitNotification,
    handleDelete,
    handleUpdateNotificationData,
  } = useNotificationMessageAction();

  const renderTypeIcon = (type: NotificationType) => {
    const iconName = getTypeIcon(type);
    switch (iconName) {
      case "Bell":
        return <Bell className="w-4 h-4" />;
      case "Send":
        return <Send className="w-4 h-4" />;
      case "Users":
        return <Users className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <>
      <IsLoadingWrapper isLoading={isLoading}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-[#C8A846]" />
              <h1 className="text-2xl font-bold text-[#C8A846]">
                Notification Center
              </h1>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-lg hover:bg-[#b39539]"
            >
              <Plus className="mr-2" /> Create
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8A846]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg"
              >
                <option value="ALL">All Types</option>
                {Object.values(NotificationType).map((type) => (
                  <option key={type} value={type}>
                    {type
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedNotifications?.map(
              (notification: NotificationTemplate) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  <img
                    src={notification.image?.[0]}
                    alt={notification.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {renderTypeIcon(notification.type)}
                        <span className="ml-1">
                          {notification.type
                            .replace("_", " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(notification)}
                          className="text-[#C8A846] hover:text-yellow-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(notification)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h2 className="font-semibold text-lg mb-1 truncate">
                      {notification.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                      <span className="font-bold">
                        {notification?.targetRoles?.join(", ") || "All"}
                      </span>
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </IsLoadingWrapper>

      <Pagination
        filteredProducts={filteredNotifications}
        setPage={handlePageChange}
        page={page}
        totalPages={totalPages}
        totalItems={notifiTotalItem}
      />

      {showAddModal && (
        <AddNotificationModal
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          currentNotification={currentNotification || undefined}
          onSubmitNotification={handleSubmitNotification}
          onUpdateNotification={handleUpdateNotificationData}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default NotificationPage;
