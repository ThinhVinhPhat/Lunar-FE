import { UserType } from "@/types/user";
import instance from "..";
import Cookies from "js-cookie";

export const UserService = {
  getUser: async () => {
    console.log(Cookies.get("accessToken"));

    const response = await instance.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    return response.data;
  },

  updateUser: async (data: UserType) => {
    console.log(data);

    const response = await instance.patch(
      `/users/update`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        address: data.address,
        city: data.city,
        phone: data.phone,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
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
