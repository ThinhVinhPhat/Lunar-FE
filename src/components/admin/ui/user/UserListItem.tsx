import { UserType } from "@/types/user";
import { User } from "lucide-react";

type UserListItemProps = {
  user: UserType;
  onClick: () => void;
};

const UserListItem = ({ user, onClick }: UserListItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#f5ecd1] hover:to-[#f5ecd1] transition-all duration-200 group border border-transparent hover:border-[#C8A846]"
    >
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar as unknown as string}
            alt={user.firstName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#C8A846] transition-colors"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={25} />
          </div>
        )}
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>

      <div className="flex-1 min-w-0 ml-3 text-left">
        <p className="text-sm font-medium text-[#C8A846] truncate group-hover:text-[#C8A846]">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-500 truncate group-hover:text-blue-600">
          {user.role}
        </p>
      </div>
      {/* 
      {user.unreadCount > 0 && (
        <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {user.unreadCount}
        </div>
      )} */}
    </button>
  );
};

export default UserListItem;
