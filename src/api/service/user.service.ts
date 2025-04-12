import { UserType } from "@/types/user";
import instance from "..";
import Cookies from "js-cookie";

export const UserService = {
  getUser: async () => {
    console.log(Cookies.get("accessToken"));

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
