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

// Form type for profile editing - only includes editable fields
export type ProfileFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  city: string;
  role: Role;
  avatar: File[] | null;
  status?: string | boolean;
};

export type AuthType = {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
};
