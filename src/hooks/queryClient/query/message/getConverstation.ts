import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../../../../api/service/message.service";

export const useGetConversation = (senderId: string) => {
  const response = useQuery({
    queryKey: ["conversation", senderId],
    queryFn: () => getConversation(senderId),
  });

  return {
    ...response,
    data: response?.data?.data,
  };
};
