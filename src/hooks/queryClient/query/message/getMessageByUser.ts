import { useQuery } from "@tanstack/react-query";
import { getMessagesByUserId } from "../../../../api/service/message.service";

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
