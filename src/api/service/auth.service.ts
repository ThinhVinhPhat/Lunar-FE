import instance from "../index";

export const login = async (email: string, password: string) => {
  const response = await instance.post("auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  first_name: string | undefined,
  last_name: string | undefined,
  role: string
) => {
  const response = await instance.post("auth/register", {
    firstName: first_name,
    lastName: last_name,
    email: email,
    password: password,
    role: role,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await instance.post("auth/forgot-password", {
    email: email,
  });
  return response.data;
};

export const verifyRegister = async (email: string, code: string) => {
  const response = await instance.post("auth/verify", {
    email: email,
    code: code,
  });
  return response.data;
};
