import { MessageType } from "@/shared/types/message";
import { UserType } from "@/shared/types/user";
import { formatTime } from "@/lib/ultis/formatDate";
import { User } from "lucide-react";

type MessageBubbleProps = {
  message: MessageType;
  isOwn: boolean;
  sender: UserType | undefined;
  receiver: UserType | undefined;
};

const MessageBubble = ({
  message,
  isOwn,
  sender,
  receiver,
}: MessageBubbleProps) => {
  const messageAuthor = isOwn ? sender : receiver;

  return (
    <div
      className={`flex items-end space-x-2 ${
        isOwn ? "flex-row-reverse space-x-reverse" : "flex-row"
      }`}
    >
      {messageAuthor?.avatar ? (
        <img
          src={messageAuthor?.avatar as unknown as string}
          alt={messageAuthor?.firstName || ""}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#C8A846] transition-colors"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={25} />
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn
            ? "bg-[#C8A846] text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message?.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTime(message?.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
