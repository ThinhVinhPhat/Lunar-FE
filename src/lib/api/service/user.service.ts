import { UserType } from "@/types/user";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";
import { Role } from "@/types";

export type FindUserParams = {
  email?: string;
  role?: Role[];
  page?: number;
  limit?: number;
};

export type UpdateUserAdminParams = {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: boolean;
};

export type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status?: boolean | string;
};

export const UserService = {
  getUser: async () => {
    const response = await instance.get(API_URL.USERS.ME, {});
    return response.data;
  },

  updateUser: async (data: UserType) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "avatar") return;

      formData.append(key, data[key as keyof UserType] as string);
    });

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0] as File);
    }

    const response = await instance.patch(API_URL.USERS.UPDATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const updatePassword = async (
  email: string,
  code: string,
  password: string
) => {
  const response = await instance.patch(API_URL.USERS.UPDATE_PASSWORD, {
    email: email,
    code: code,
    password: password,
  });
  return response.data;
};

export const findUser = async (data: FindUserParams) => {
  const response = await instance.get(API_URL.USERS.FIND_ALL, {
    params: data,
  });

  return response.data;
};

export const createUser = async (data: CreateUserParams) => {
  const response = await instance.post(API_URL.USERS.CREATE, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role,
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await instance.delete(API_URL.USERS.DELETE(id));
  return response.data;
};

export const updateUserAdmin = async (data: UpdateUserAdminParams) => {
  const response = await instance.patch(API_URL.USERS.UPDATE_BY_ADMIN, {
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    status: data.status,
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await instance.get(API_URL.USERS.GET_BY_ID(id));
  return response.data;
};
