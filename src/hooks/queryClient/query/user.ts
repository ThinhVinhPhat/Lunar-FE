import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../../api/service/user.service";
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
