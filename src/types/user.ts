import { Role } from ".";

export type UserType = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  role: Role;
  phone: string;
  avatar: File[] | null;
  status: string | boolean;
  createdAt: string;
  isOnline: boolean;
};

export type AuthType = {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
};
