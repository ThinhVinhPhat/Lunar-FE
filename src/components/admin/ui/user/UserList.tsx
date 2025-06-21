import { useNavigate } from "react-router-dom";
import {
  useFindUser,
  useGetUser,
} from "../../../../hooks/queryClient/query/user";
import UserListItem from "./UserListItem";
import { UserType } from "@/types/user";

export default function UserList() {
  const { data: user } = useGetUser();
  const { data: userList } = useFindUser({ role: ["Engineer", "Admin"] });
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Team Members
        </h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">
            {userList
              .filter((u: UserType) => u.id !== user?.id && u.isOnline)
              .length.toString() + " "}
            Online
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {userList?.map(
          (userItem: UserType) =>
            userItem.id !== user?.id && (
              <UserListItem
                key={userItem.id}
                user={userItem}
                onClick={() => navigate(`/admin/message/${userItem.id}`)}
              />
            )
        )}
      </div>
    </div>
  );
}
