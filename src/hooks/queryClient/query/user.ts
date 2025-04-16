import { useQuery } from "@tanstack/react-query";
import { findUser, UserService } from "../../../api/service/user.service";
import Cookies from "js-cookie";

export const useGetUser = () => {
  const response = useQuery({
    queryKey: ["user"],
    queryFn: async () => await UserService.getUser(),
    enabled: !!Cookies.get("accessToken"),
    staleTime: Infinity,
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useFindUser = (data: any) => {
  const response = useQuery({
    queryKey: ["users", data.role, data.offset, data.limit],
    queryFn: async () => await findUser(data),
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};
