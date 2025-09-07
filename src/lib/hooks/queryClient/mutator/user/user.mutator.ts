import {
  CreateUserParams,
  createUser,
  UpdateUserAdminParams,
  updateUserAdmin,
  UserService,
  deleteUser,
} from "@/lib/api/service/user.service";
import { UserType } from "@/shared/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useCreateUser = () => {
  const response = useMutation({
    mutationFn: async (data: CreateUserParams) => await createUser(data),
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

export const useUpdateUserAdmin = () => {
  const response = useMutation({
    mutationFn: async (data: UpdateUserAdminParams) =>
      await updateUserAdmin(data),
    onSuccess: () => {
      enqueueSnackbar("User updated successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to update user", {
        variant: "error",
      });
    },
  });

  return response;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (data: UserType) => UserService.updateUser(data),
    onSuccess: async () => {
     await queryClient.invalidateQueries({ queryKey: ["user"] });
      enqueueSnackbar("User updated successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to update user", {
        variant: "error",
      });
    },
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useDeleteUser = () => {
  const response = useMutation({
    mutationFn: async (id: string) => await deleteUser(id),
    onSuccess: () => {
      enqueueSnackbar("User deleted successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete user", {
        variant: "error",
      });
    },
  });
  return response;
};
