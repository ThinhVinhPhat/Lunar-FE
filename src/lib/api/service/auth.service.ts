import { API_URL } from "@/lib/config/api.config";
import instance from "../index";
import { Role } from "@/types";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

export interface VerifyRegisterInterface {
  email: string;
  code: string;
}

export interface UpdatePasswordInterface {
  email: string;
  code: string;
  password: string;
}

export const login = async (data: LoginInterface) => {
  const response = await instance.post(API_URL.AUTH.LOGIN, {
    email: data.email,
    password: data.password,
  });
  return response.data;
};

export const register = async (data: RegisterInterface) => {
  const response = await instance.post(API_URL.AUTH.REGISTER, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: Role.CUSTOMER,
  });
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordInterface) => {
  const response = await instance.post(API_URL.AUTH.FORGOT_PASSWORD, {
    email: data.email,
  });
  return response.data;
};

export const verifyRegister = async (data: VerifyRegisterInterface) => {
  const response = await instance.post(API_URL.AUTH.VERIFY, {
    email: data.email,
    code: data.code,
  });
  return response.data;
};
