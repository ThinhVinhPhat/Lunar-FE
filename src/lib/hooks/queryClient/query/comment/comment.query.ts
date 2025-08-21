import { useQuery } from "@tanstack/react-query";

import {
  getCommentByProduct,
  getUserComment,
  GetCommentByProductInterface,
  GetUserCommentInterface,
} from "@/lib/api/service/comment.service";

export const useGetCommentProduct = (
  id: string,
  data: GetCommentByProductInterface
) => {
  const response = useQuery({
    queryKey: ["comment-product", id, data.limit, data.page, data.sort],
    queryFn: () => getCommentByProduct(id, data),
  });

  return {
    ...response,
    data: response.data?.data || [],
    total: response.data?.meta.total || 0,
  };
};

export const useGetCommentUser = (data: GetUserCommentInterface) => {
  const response = useQuery({
    queryKey: ["comment-user", data.page, data.limit, data.sort],
    queryFn: () =>
      getUserComment({
        page: data.page,
        limit: data.limit,
        sort: data.sort,
      }),
  });
  return {
    ...response,
    data: response.data?.data || [],
    total: response.data?.meta.total || 0,
  };
};
