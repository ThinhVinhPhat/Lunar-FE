import { UserType } from "@/shared/types/user";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";
import { Role } from "@/shared/types";

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
    const response = await instance.get(API_URL.USERS.ME, {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    });
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
        ...(instance.defaults.headers.common || {}),
        "Content-Type": "multipart/form-data",
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
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
  }, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const findUser = async (data: FindUserParams) => {
  const response = await instance.get(API_URL.USERS.FIND_ALL, {
    params: data,
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
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
  }, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await instance.delete(API_URL.USERS.DELETE(id), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const updateUserAdmin = async (data: UpdateUserAdminParams) => {
  const response = await instance.patch(API_URL.USERS.UPDATE_BY_ADMIN, {
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    status: data.status,
  }, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await instance.get(API_URL.USERS.GET_BY_ID(id), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};
