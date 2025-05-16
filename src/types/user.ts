export type UserType = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  role: string;
  phone: string;
  avatar: File[] | null;
  status: string | boolean;
  createdAt: string;
};

export type AuthType = {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
};
