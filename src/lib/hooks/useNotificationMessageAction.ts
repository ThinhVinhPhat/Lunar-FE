import { NotificationTemplate, userNotification } from "@/types/notification";
import { useEffect, useRef, useState } from "react";
import { useContextProvider } from "./useContextProvider";
import useGetMessageByUser from "./queryClient/query/message/message.query";
import { MessageType } from "@/types/message";
import { useUpdateNotificationStatus } from "./queryClient/mutator/notification/notification.mutator";
import { GetAllNotificationInterface } from "@/lib/api/service/notification.service";

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
  const { data: messages, isLoading } = useGetMessageByUser();
  const { mutateAsync: updateNotificationStatus } =
    useUpdateNotificationStatus();
  const { socketRef } = useContextProvider();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [notifiTotalItem, setNotifiTotalItem] = useState(0);
  const [groupedNotifications, setGroupedNotifications] = useState<
    GroupedNotification[]
  >([]);
  const [notifications, setNotifications] = useState<NotificationTemplate[]>(
    []
  );
  const [userNotifications, setUserNotifications] = useState<
    userNotification[]
  >([]);
  const [isLoadingNotification, setIsLoadingNotification] =
    useState<boolean>(true);

  const totalUnreadCount =
    groupedNotifications?.reduce((sum, n) => sum + n.unreadCount, 0) +
    userNotifications.reduce((sum, n) => (n.isRead ? sum : sum + 1), 0);

  const toggleDropdown = () => setIsOpen?.(!isOpen);

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
      setNotifications(data.data as NotificationTemplate[]);
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
      setIsOpen?.(false);
    }
  };

  const handleUpdateNotification = async (id: string) => {
    try {
      await updateNotificationStatus(id);
      refetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const isRead = (id: string) => {
    const notif = userNotifications.find(
      (notif: userNotification) => notif.notification.id === id
    );
    return notif !== undefined;
  };

  return {
    notifications: notifications,
    groupedNotifications,
    userNotifications,
    totalUnreadCount,
    isLoading,
    isLoadingNotification,
    dropdownRef,
    notifiTotalItem,
    page,
    toggleDropdown,
    setPage,
    handleUpdateNotification,
    isRead,
    refetchNotifications,
  };
}
