import { useState } from "react";
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
import { useGetAllNotification } from "@/hooks/queryClient/query/notification/find-all";
import {
  NotificationTemplate,
  NotificationType,
} from "@/types/notification";
import IsLoadingWrapper from "@/components/wrapper/isLoading";
import Pagination from "@/components/admin/pagination";
import { AddNotificationModal } from "./modals/AddNotification";
import { useCreateNotification } from "@/hooks/queryClient/mutator/notification/create-notification";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import { useUpdateNotification } from "@/hooks/queryClient/mutator/notification/update-notification";
import { useDeleteNotification } from "@/hooks/queryClient/mutator/notification/delete-notification";
import { formatDate } from "@/ultis/formatDate";
import useNotificationMessageAction from "@/hooks/useNotificationMessageAction";

const NotificationPage = () => {
  const {
    data: notifications,
    isLoading,
    refetch,
  } = useGetAllNotification("", 0, 5);
  const { mutateAsync: updateNotification } = useUpdateNotification();
  const { mutateAsync: deleteNotification } = useDeleteNotification();
  const { mutateAsync: createNotification } = useCreateNotification();
  const { refetchNotifications, setPage, page, notifiTotalItem } =
    useNotificationMessageAction();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const itemsPerPage = 5;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationTemplate | null>(null);

  const handleSubmitNotification = async (data: NotificationTemplate) => {
    try {
      const isCreated = await createNotification(data);
      if (isCreated) {
        refetch();
        refetchNotifications();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    if (currentNotification) {
      await deleteNotification(currentNotification.id);
      refetch();
      refetchNotifications();
      setShowDeleteModal(false);
      setCurrentNotification(null);
    }
  };

  const handleUpdateNotification = async (data: NotificationTemplate) => {
    if (currentNotification) {
      await updateNotification({ id: currentNotification.id, data });
      refetch();
      refetchNotifications();
      setShowAddModal(false);
      setCurrentNotification(null);
    }
  };

  const filteredNotifications = notifications?.filter(
    (notification: NotificationTemplate) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "ALL" || notification.type === filterType;
      return matchesSearch && matchesType;
    }
  );

  const totalPages = Math.ceil(filteredNotifications?.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_MESSAGE:
        return <Bell className="w-4 h-4" />;
      case NotificationType.NEW_ORDER:
        return <Send className="w-4 h-4" />;
      case NotificationType.NEW_REPLY:
        return <Bell className="w-4 h-4" />;
      case NotificationType.NEW_DEAL:
        return <Users className="w-4 h-4" />;
      case NotificationType.NEW_THREAD:
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_MESSAGE:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case NotificationType.NEW_ORDER:
        return "bg-green-100 text-green-800 border-green-200";
      case NotificationType.NEW_REPLY:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case NotificationType.NEW_DEAL:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case NotificationType.NEW_THREAD:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEdit = (notification: NotificationTemplate) => {
    setCurrentNotification(notification);
    setShowAddModal(true);
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
              onClick={() => {
                setCurrentNotification(null);
                setShowAddModal(true);
              }}
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
                        {getTypeIcon(notification.type)}
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
                          onClick={() => {
                            setCurrentNotification(notification);
                            setShowDeleteModal(true);
                          }}
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
        setPage={setPage}
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
          onUpdateNotification={handleUpdateNotification}
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
