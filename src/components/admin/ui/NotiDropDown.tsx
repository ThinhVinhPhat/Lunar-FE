import { Message } from "@/types/message";
import IsLoadingWrapper from "../../../components/wrapper/isLoading";
import useGetMessageByUser from "../../../hooks/queryClient/query/message/getMessageByUser";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextProvider } from "../../../hooks/useContextProvider";

type GroupedNotification = {
  senderId: string;
  senderName: string;
  senderAvatar?: File[] | null;
  latestMessage: string;
  latestTime: Date;
  unreadCount: number;
  messageIds: string[];
};

const typeClasses = {
  message: "bg-[#C8A846] text-white",
  order: "bg-green-100 text-green-800",
  system: "bg-yellow-100 text-yellow-800",
  alert: "bg-red-100 text-red-800",
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function NotificationBell({ isOpen, setIsOpen }: Props) {
  const { data: messages, isLoading } = useGetMessageByUser();
  const { socketRef } = useContextProvider();
  const [groupedNotifications, setGroupedNotifications] = useState<
    GroupedNotification[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const totalUnreadCount = groupedNotifications.reduce(
    (sum, notification) => sum + notification.unreadCount,
    0
  );

  useEffect(() => {
    if (messages && messages.length > 0) {
      const grouped = messages.reduce(
        (acc: Record<string, GroupedNotification>, message: Message) => {
          const senderId = message.sender?.id ?? "";
          const key = String(senderId);

          if (!acc[key]) {
            acc[key] = {
              senderId: senderId,
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

      const groupedArray = (Object.values(grouped) as Message[]).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setGroupedNotifications(groupedArray as unknown as GroupedNotification[]);
    }
  }, [messages]);

  useEffect(() => {
    const audio = new Audio("/sound/message-notification-190034.mp3");
    socketRef.current?.on("receive_message", (message: Message) => {
      const notification = {
        senderId: message.sender?.id || "",
        senderName: message.sender?.lastName || "",
        senderAvatar: message.sender?.avatar || null,
        latestMessage: message.content || "",
        latestTime: message.createdAt || new Date(),
        unreadCount: 1,
        messageIds: [message.id || ""],
      };
      setGroupedNotifications((prev) => {
        if (prev.some((n) => n.senderId === notification.senderId)) {
          return prev;
        }
        return [...prev, notification];
      });
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    });
    return () => {
      socketRef.current?.off("receive_message");
    };
  }, [socketRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const markSenderAsRead = (senderId: string) => {
    setGroupedNotifications((prev) =>
      prev.map((notification) =>
        notification.senderId === senderId
          ? { ...notification, unreadCount: 0 }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setGroupedNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unreadCount: 0 }))
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <div className="relative" ref={dropdownRef}>
        <button
          className="relative p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
          onClick={toggleDropdown}
        >
          <svg
            className="w-6 h-6 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {totalUnreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-5 h-5 px-1 text-xs font-semibold flex items-center justify-center">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </div>
          )}
        </button>

        <div
          className={`absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl w-96 max-h-96 overflow-hidden z-50 transition-all duration-200 ease-out ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <div className="text-lg font-semibold text-slate-900">Messages</div>
            <button
              className="text-[#C8A846] text-sm font-medium hover:underline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {groupedNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center text-slate-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p>No messages yet</p>
              </div>
            ) : (
              groupedNotifications.map((notification) => {
                const initials = notification.senderName
                  .split(" ")
                  .map((w) => w[0])
                  .join("");
                const avatar = notification.senderAvatar ? (
                  <img
                    src={notification.senderAvatar as unknown as string}
                    alt={notification.senderName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#C8A846] text-white flex items-center justify-center font-semibold text-sm">
                    {initials}
                  </div>
                );

                return (
                  <div
                    key={notification.senderId}
                    className={`px-6 py-4 border-b border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors duration-200 relative ${
                      notification.unreadCount > 0
                        ? "bg-blue-50 border-l-4 border-l-[#C8A846]"
                        : ""
                    }`}
                    onClick={() => {
                      markSenderAsRead(notification.senderId);
                      navigate(`/admin/message/${notification.senderId}`);
                    }}
                  >
                    {avatar}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 text-sm">
                          {notification.senderName}
                        </span>
                        {notification.unreadCount > 0 && (
                          <span className="bg-[#C8A846] text-white text-xs rounded-full px-2 py-1 font-medium min-w-5 text-center">
                            {notification.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 leading-5 mb-1 truncate">
                        {notification.latestMessage}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {formatTime(notification.latestTime.toString())}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            typeClasses[
                              "message" as keyof typeof typeClasses
                            ] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          Message
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 text-center">
            <a
              href="#"
              className="text-[#C8A846] text-sm font-medium hover:underline"
            >
              View all messages
            </a>
          </div>
        </div>
      </div>
    </IsLoadingWrapper>
  );
}
