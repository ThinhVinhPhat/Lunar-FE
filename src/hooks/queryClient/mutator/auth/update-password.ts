import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/service/user.service";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";
export const useUpdatePassword = () => {
  const status = useRef(false);
  const response = useMutation({
    mutationFn: (data: { email: string, code: string, password: string }) => updatePassword(data.email, data.code, data.password),
    onSuccess: () => {
      enqueueSnackbar("Password updated successfully", {
        variant: "success",
      });
      status.current = true;
    },
    onError: () => {
      enqueueSnackbar("Failed to update password", {
        variant: "error",
      });
      status.current = false;
    },
  });
  return {
    statusResponse: status.current,
    ...response,
    data: response.data || null,
  };
};
