import { enqueueSnackbar } from "notistack";
import { verifyRegister } from "@/api/service/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useVerifyRegister = () => {
  const response = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyRegister(email, code),
    onSuccess: () => {
      enqueueSnackbar("Verification successful", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Verification failed", {
        variant: "error",
      });
    },
  });
  return response;
};

