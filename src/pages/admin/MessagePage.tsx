import { useGetUserById } from "@/lib/hooks/queryClient/query/user/user.query";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "@/components/admin/ui/message/MessageBubble";
import { useEffect, useRef, useState } from "react";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import { useGetConversation } from "@/lib/hooks/queryClient/query/message/message.query";
import { MessageType } from "@/shared/types/message";

const MessagePage = () => {
  const navigate = useNavigate();
  const { socketRef, user: currentUser } = useContextProvider();
  const { id } = useParams();
  const { data: user } = useGetUserById(id || "");
  const [offLineTimePeriod, setOffLineTimePeriod] = useState(0);
  const [isOnline, setIsOnline] = useState(user?.isOnline);
  const offlineTimeRef = useRef<Date | null>(null);
  const { data: messages, refetch } = useGetConversation(id || "");
  const [message, setMessage] = useState("");
  const onBack = () => {
    navigate("/admin/dashboard");
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };
  const onSendMessage = () => {
    socketRef.current?.emit(
      "send_message",
      {
        senderId: currentUser?.id,
        receiverId: user?.id,
        content: message,
      },
      () => {
        refetch();
      }
    );

    setMessage("");
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    socketRef.current?.on("user_status_offline", ({ userId, offLineAt }) => {
      if (userId === user?.id) {
        offlineTimeRef.current = offLineAt;
        setIsOnline(false);
      }
    });
    socketRef.current?.on("user_status_online", ({ userId }) => {
      if (userId === user?.id) {
        setIsOnline(true);
      }
    });

    return () => {
      socketRef.current?.off("user_status_offline");
      socketRef.current?.off("user_status_online");
    };
  }, [socketRef, user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (offlineTimeRef.current) {
        setOffLineTimePeriod(
          new Date().getTime() - new Date(offlineTimeRef.current).getTime()
        );
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [offlineTimeRef]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex flex-col">
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#C8A846]/20 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="text-[#C8A846]" />
            </button>

            <div className="relative">
              {user?.avatar ? (
                <div className="p-0.5 bg-gradient-to-br from-[#C8A846] to-amber-600 rounded-full shadow-lg">
                  <img
                    src={user?.avatar}
                    alt={user?.firstName || ""}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-inner"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8A846] to-amber-600 flex items-center justify-center shadow-lg">
                  <User size={28} className="text-white" />
                </div>
              )}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-[#C8A846] font-medium">
                {isOnline
                  ? "Online now"
                  : `Last seen ${offLineTimePeriod} minutes ago`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group">
              <Phone
                size={20}
                className="text-[#C8A846] group-hover:text-amber-700"
              />
            </button>
            <button className="p-2 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group">
              <Video
                size={20}
                className="text-[#C8A846] group-hover:text-amber-700"
              />
            </button>
            <button className="p-2 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group">
              <MoreVertical
                size={20}
                className="text-[#C8A846] group-hover:text-amber-700"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C8A846] to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Send size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Start a conversation
              </h3>
              <p className="text-[#C8A846] font-medium">
                Send a message to {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
        ) : (
          messages?.map((msg: MessageType) => (
            <MessageBubble
              key={msg?.id}
              message={msg}
              isOwn={msg?.sender?.id === currentUser?.id}
              sender={currentUser}
              receiver={user}
            />
          ))
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm border-t border-[#C8A846]/20 p-4 shadow-lg">
        <div className="flex items-end space-x-3">
          <button className="p-3 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group">
            <Paperclip
              size={20}
              className="text-[#C8A846] group-hover:text-amber-700"
            />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={`Message ${user?.firstName}...`}
              className="w-full px-4 py-3 border-2 border-[#C8A846]/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-[#C8A846] max-h-32 bg-white/90 backdrop-blur-sm placeholder-[#C8A846]/60 transition-all duration-200"
              rows={1}
            />
          </div>

          <button className="p-3 hover:bg-[#C8A846]/10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 group">
            <Smile
              size={20}
              className="text-[#C8A846] group-hover:text-amber-700"
            />
          </button>

          <button
            onClick={onSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-[#C8A846] to-amber-600 text-white p-3 rounded-full hover:from-amber-600 hover:to-[#C8A846] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MessagePage;
