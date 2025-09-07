import { NotificationTemplate, userNotification, NotificationType } from "@/shared/types/notification";
import { useEffect, useRef, useState } from "react";
import { useContextProvider } from "../../../../shared/hooks/useContextProvider";
import useGetMessageByUser from "../../../../lib/hooks/queryClient/query/message/message.query";
import { MessageType } from "@/shared/types/message";
import { useCreateNotification, useDeleteNotification, useUpdateNotification, useUpdateNotificationStatus } from "../../../../lib/hooks/queryClient/mutator/notification/notification.mutator";
import { CreateNotificationParams, GetAllNotificationInterface, UpdateNotificationParams } from "@/lib/api/service/notification.service";
import usePagination from "../../../../shared/hooks/usePagination";
import { useGetAllNotification } from "@/lib/hooks/queryClient/query/notification/notification.query";

type GroupedNotification = {
  senderId: string;
  senderName: string;
  senderAvatar?: File[] | null;
  latestMessage: string;
  latestTime: Date;
  unreadCount: number;
  messageIds: string[];
};

export default function useNotificationMessageAction(
  setIsOpen?: (isOpen: boolean) => void,
  isOpen?: boolean
) {
  // API hooks
  const { data: messages, isLoading } = useGetMessageByUser();
  const { data: notifications, isLoading: isLoadingNotifications, refetch } = useGetAllNotification("", 1, 5);
  const { mutateAsync: updateNotificationStatus } = useUpdateNotificationStatus();
  const { mutateAsync: updateNotification } = useUpdateNotification();
  const { mutateAsync: deleteNotification } = useDeleteNotification();
  const { mutateAsync: createNotification } = useCreateNotification();
  
  // Context and pagination
  const { socketRef } = useContextProvider();
  const { page, handlePageChange } = usePagination();
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [notifiTotalItem, setNotifiTotalItem] = useState(0);
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotification[]>([]);
  const [, setSocketNotifications] = useState<NotificationTemplate[]>([]);
  const [userNotifications, setUserNotifications] = useState<userNotification[]>([]);
  const [isLoadingNotification, setIsLoadingNotification] = useState<boolean>(true);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<NotificationTemplate | null>(null);
  
  // Constants
  const itemsPerPage = 5;

  // Computed values
  const totalUnreadCount =
    groupedNotifications?.reduce((sum, n) => sum + n.unreadCount, 0) +
    userNotifications.reduce((sum, n) => (n.isRead ? sum : sum + 1), 0);

  // Filter notifications based on search and type
  const filteredNotifications = notifications?.filter((notification: NotificationTemplate) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil((filteredNotifications?.length || 0) / itemsPerPage);
  const paginatedNotifications = filteredNotifications?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // UI Helper functions
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_MESSAGE:
        return "Bell";
      case NotificationType.NEW_ORDER:
        return "Send";
      case NotificationType.NEW_REPLY:
        return "Bell";
      case NotificationType.NEW_DEAL:
        return "Users";
      case NotificationType.NEW_THREAD:
        return "Bell";
      default:
        return "Bell";
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

  // Event handlers
  const toggleDropdown = () => setIsOpen?.(!isOpen);

  const handleEdit = (notification: NotificationTemplate) => {
    setCurrentNotification(notification);
    setShowAddModal(true);
  };

  const handleCreateNew = () => {
    setCurrentNotification(null);
    setShowAddModal(true);
  };

  const handleDeleteClick = (notification: NotificationTemplate) => {
    setCurrentNotification(notification);
    setShowDeleteModal(true);
  };

  const handleSubmitNotification = async (data: CreateNotificationParams) => {
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

  const handleUpdateNotificationData = async (data: UpdateNotificationParams) => {
    if (currentNotification) {
      await updateNotification({ id: currentNotification.id, data });
      refetch();
      refetchNotifications();
      setShowAddModal(false);
      setCurrentNotification(null);
    }
  };

  const handleUpdateNotificationStatus = async (id: string) => {
    try {
      await updateNotificationStatus(id);
      refetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  // Socket and message handling effects
  useEffect(() => {
    if (messages && messages.length > 0) {
      const grouped = messages.reduce(
        (acc: Record<string, GroupedNotification>, message: MessageType) => {
          const senderId = message.sender?.id ?? "";
          const key = String(senderId);

          if (!acc[key]) {
            acc[key] = {
              senderId,
              senderName: message?.sender?.lastName,
              senderAvatar: message?.sender?.avatar,
              latestMessage: message?.content,
              latestTime: message.createdAt,
              unreadCount: message.isRead ? 0 : 1,
              messageIds: [message.id],
            };
          } else {
            const currentTime = new Date(message.createdAt);
            const existingTime = new Date(acc[key].latestTime);

            if (currentTime > existingTime) {
              acc[key].latestMessage = message.content;
              acc[key].latestTime = message.createdAt;
            }

            if (!message.isRead) {
              acc[key].unreadCount += 1;
            }

            acc[key].messageIds.push(message.id);
          }

          return acc;
        },
        {}
      );

      const groupedArray = (Object.values(grouped) as GroupedNotification[]).sort(
        (a: GroupedNotification, b: GroupedNotification) =>
          new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime()
      );
      setGroupedNotifications(groupedArray as GroupedNotification[]);
    }
  }, [messages]);

  const refetchNotifications = () => {
    if (!socketRef.current) return;
    setIsLoadingNotification(true);
    socketRef.current.emit("get_notifications_by_user", {
      page: page,
      limit: 10,
    });
  };

  useEffect(() => {
    if (!socketRef.current) return;

    refetchNotifications();

    const handleNotifications = (data: GetAllNotificationInterface) => {
      setSocketNotifications(data.data as NotificationTemplate[]);
      setUserNotifications(data.userNotification as userNotification[]);
      setNotifiTotalItem(data.meta.total as number);
      setIsLoadingNotification(false);
    };

    socketRef.current.on("notifications_by_user", handleNotifications);

    return () => {
      socketRef.current?.off("notifications_by_user", handleNotifications);
    };
  }, [socketRef]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleNotificationUpdate = () => {
      const audio = new Audio("/sound/message-notification-190034.mp3");
      refetchNotifications();
      audio.play().catch(console.error);
    };

    socketRef.current.on("notification_updated", handleNotificationUpdate);

    return () => {
      socketRef.current?.off("notification_updated", handleNotificationUpdate);
    };
  }, [socketRef]);

  useEffect(() => {
    const audio = new Audio("/sound/message-notification-190034.mp3");
    socketRef.current?.on("receive_message", (message: MessageType) => {
      const notification: GroupedNotification = {
        senderId: message.sender?.id || "",
        senderName: message.sender?.lastName || "",
        senderAvatar: message.sender?.avatar || null,
        latestMessage: message.content || "",
        latestTime: message.createdAt || new Date(),
        unreadCount: 1,
        messageIds: [message.id || ""],
      };

      setGroupedNotifications((prev) => {
        if (prev.some((n) => n.senderId === notification.senderId)) return prev;
        return [...prev, notification];
      });

      audio.play().catch(console.error);
    });
    return () => {
      socketRef.current?.off("receive_message");
    };
  }, [socketRef]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      const target = event.target as HTMLElement;
      const isTabClick = target.closest('.MuiTab-root') || target.closest('.MuiTabs-root');
      if (!isTabClick) {
        setIsOpen?.(false);
      }
    }
  };

  const isRead = (id: string) => {
    const notif = userNotifications.find(
      (notif: userNotification) => notif.notification.id === id
    );
    return notif !== undefined;
  };

  return {
    // Data
    notifications,
    filteredNotifications,
    paginatedNotifications,
    groupedNotifications,
    userNotifications,
    totalUnreadCount,
    totalPages,
    notifiTotalItem,
    
    // Loading states
    isLoading: isLoading || isLoadingNotifications,
    isLoadingNotification,
    
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
    
    // Refs
    dropdownRef,
    
    // Helper functions
    getTypeIcon,
    getTypeColor,
    
    // Event handlers
    toggleDropdown,
    handleEdit,
    handleCreateNew,
    handleDeleteClick,
    handleSubmitNotification,
    handleDelete,
    handleUpdateNotificationData,
    handleUpdateNotificationStatus,
    isRead,
    refetchNotifications,
  };
}
