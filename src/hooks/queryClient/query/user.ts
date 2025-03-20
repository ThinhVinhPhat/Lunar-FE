import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../../api/service/user.service";
import Cookies from "js-cookie";


export const useGetUser = () => {
  const response =  useQuery(
    { queryKey: ["user"], 
    queryFn: () => UserService.getUser(),
    enabled: !!Cookies.get("accessToken"),
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};
