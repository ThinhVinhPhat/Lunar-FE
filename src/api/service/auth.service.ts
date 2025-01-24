import Cookies from 'js-cookie';
import instance  from "../index";

export const login = async (email: string, password: string) => {
  const response = await instance.post("auth/login",{
    email,
    password,
  });
  Cookies.set('accessToken', response.data.accessToken);
  return response.data;
};

