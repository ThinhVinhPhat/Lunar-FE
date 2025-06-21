import { useQuery } from "@tanstack/react-query";
import {
  findUser,
  getUserById,
  UserService,
} from "../../../api/service/user.service";
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

export const useGetUserById = (id: string) => {
  const response = useQuery({
    queryKey: ["user", id],
    queryFn: async () => await getUserById(id),
    enabled: !!id,
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
    staleTime: 0,
    refetchInterval: 1000 * 60,
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};
