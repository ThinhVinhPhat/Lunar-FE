import { useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../../../api/service/comment.service";
import { enqueueSnackbar } from "notistack";

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
