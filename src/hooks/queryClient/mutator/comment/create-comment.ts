import { createComment } from "@/api/service/comment.service";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useCreateComment = () => {
  const response = useMutation({
    mutationFn: async (data: any) => {
      const { productId, ...commentData } = data;
      await createComment(productId, commentData);
    },
    onSuccess: () => {
      enqueueSnackbar("Create comment success", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Create comment failed", { variant: "error" });
    },
  });

  return response;
};
