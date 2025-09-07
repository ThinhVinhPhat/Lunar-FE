import {
  createComment,
  CreateCommentInterface,
  deleteComment,
} from "@/lib/api/service/comment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/shared/types";



export const useCreateComment = () => {
  const response = useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: string;
      data: CreateCommentInterface;
    }) => {
      await createComment(productId, data);
    },
    onSuccess: () => {
      enqueueSnackbar("Create comment success", { variant: "success" });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  return response;
};


export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      enqueueSnackbar("Delete comment successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Delete comment failed", {
        variant: "error",
      });
    },
  });
  return response;
};
