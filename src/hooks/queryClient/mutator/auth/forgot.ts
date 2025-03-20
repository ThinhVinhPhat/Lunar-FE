import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../../../api/service/auth.service";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";
export const useForgotPassword = () => {
    const status = useRef(true)
    const response = useMutation({
      mutationFn: (email: string) => forgotPassword(email),
      onSuccess: () => {
        enqueueSnackbar("Password reset email sent", {
          variant: "success",
        });
        console.log("success");
        
        status.current = true
      },
      onError: () => {
        enqueueSnackbar("Failed to send password reset email", {
          variant: "error",
        });
        console.log("error");
        status.current = false
      },
    });
  return {
    statusResponse: status.current,
    ...response,
    data: response.data || null,
  }
};
