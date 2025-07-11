import { useQuery } from "@tanstack/react-query";

import { getCommentByProduct } from "@/api/service/comment.service";

export const useGetCommentProduct = (id: string, data: any) => {
  const response = useQuery({
    queryKey: ["comment-product", id, data.limit, data.offset, data.sort],
    queryFn: () => getCommentByProduct(id, data),
  });

  return {
    ...response,
    data: response.data?.data || [],
    total: response.data?.meta.total || 0,
  };
};
