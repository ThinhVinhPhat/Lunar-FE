import { UserType } from "@/types/user";
import instance from "..";

export const UserService = {
  getUser: async () => {
    const response = await instance.get(`/users/me`, {});
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

    console.log(formData);
    const response = await instance.patch(`/users/update`, formData, {
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
  const response = await instance.patch("/users/update/update-password", {
    email: email,
    code: code,
    password: password,
  });
  return response.data;
};

export const findUser = async (data: any) => {
  const response = await instance.get(`/users/find-all`, {
    params: data,
  });

  return response.data;
};

export const createUser = async (data: any) => {
  const response = await instance.post(`/users`, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role,
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await instance.delete(`/users/delete/${id}`);
  return response.data;
};

export const updateUserAdmin = async (data: any) => {
  const response = await instance.patch(`/users/update-by-admin`, {
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    status: data.status,
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await instance.get(`/users/${id}`);
  return response.data;
};
