import { getUserComment } from "../../../../api/service/comment.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentUser = (data: any) => {
  const response = useQuery({
    queryKey: ["comment-user", data],
    queryFn: () =>
      getUserComment({
        offset: data.offset,
        limit: data.limit,
        sort: data.sort,
      }),
  });
  return {
    ...response,
    data: response.data?.data || [],
  };
};
