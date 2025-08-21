import { NotificationTemplate } from "@/types/notification";
import IsLoadingWrapper from "@/components/wrapper/isLoading";
import { useNavigate } from "react-router-dom";
import useNotificationMessageAction from "@/lib/hooks/useNotificationMessageAction";
import { useState } from "react";
import { formatTime } from "@/lib/ultis/formatDate";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function NotificationBell({ isOpen, setIsOpen }: Props) {
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">(
    "messages"
  );
  const navigate = useNavigate();
  const {
    notifications,
    totalUnreadCount,
    groupedNotifications,
    isLoadingNotification,
    isLoading,
    dropdownRef,
    toggleDropdown,
    isRead,
    handleUpdateNotification,
  } = useNotificationMessageAction(setIsOpen, isOpen);

  return (
    <IsLoadingWrapper isLoading={isLoading || isLoadingNotification}>
      <div className="relative" ref={dropdownRef}>
        <button
          className="relative p-2 rounded-full hover:bg-slate-100"
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
          <div className="flex justify-around border-b border-slate-200">
            {["messages", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "messages" | "notifications")
                }
                className={`w-full py-2 font-medium text-sm ${
                  activeTab === tab
                    ? "text-[#C8A846] border-b-2 border-[#C8A846]"
                    : "text-slate-500"
                }`}
              >
                {tab === "messages" ? "Messages" : "Notifications"}
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {activeTab === "messages" ? (
              groupedNotifications.length === 0 ? (
                <div className="py-12 px-6 text-center text-slate-500">
                  No messages yet
                </div>
              ) : (
                groupedNotifications.map((notification) => (
                  <div
                    key={notification.senderId}
                    className={`px-6 py-4 border-b border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 relative ${
                      notification.unreadCount > 0
                        ? "bg-blue-50 border-l-4 border-l-[#C8A846]"
                        : ""
                    }`}
                    onClick={() => {
                      navigate(`/admin/message/${notification.senderId}`);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C8A846] text-white flex items-center justify-center font-semibold text-sm">
                      {notification.senderName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {notification.senderName}
                      </div>
                      <div className="text-sm text-slate-600 truncate">
                        {notification.latestMessage}
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{formatTime(notification.latestTime)}</span>
                        <span className="bg-[#C8A846] text-white px-2 py-1 rounded-full text-xs">
                          Message
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : notifications.length === 0 ? (
              <div className="py-12 px-6 text-center text-slate-500">
                No notifications yet
              </div>
            ) : (
              notifications?.map((notif: NotificationTemplate) => {
                return (
                  <div
                    onClick={() => handleUpdateNotification(notif?.id)}
                    key={notif?.id}
                    className={`px-6 py-4 border-b border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 relative ${
                      !isRead(notif?.id)
                        ? "bg-yellow-50 border-l-4 border-[#C8A846]"
                        : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-center flex items-center justify-center text-xl">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src={notif?.image?.[0]}
                        alt="icon"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {notif?.title}
                      </div>
                      <div className="text-sm text-slate-600 truncate">
                        {notif?.message}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatTime(notif?.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 text-center">
            <button
              onClick={() => handleUpdateNotification("all")}
              className="text-[#C8A846] text-sm font-medium hover:underline"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </IsLoadingWrapper>
  );
}
