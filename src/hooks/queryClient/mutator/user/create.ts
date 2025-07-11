import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/api/service/user.service";
import { enqueueSnackbar } from "notistack";

export const useCreateUser = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await createUser(data),
    onSuccess: () => {
      enqueueSnackbar("User created successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to create user", {
        variant: "error",
      });
    },
  });

  return response;
};
