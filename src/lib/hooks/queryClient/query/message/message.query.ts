import { useQuery } from "@tanstack/react-query";
import { getConversation, getMessagesByUserId } from "@/lib/api/service/message.service";

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


export default function useGetMessageByUser() {
    const response = useQuery({
      queryKey: ["messages"],
      queryFn: () => getMessagesByUserId(),
    });
    return {
      ...response,
      data: response.data?.data || [],
    };
  }
  