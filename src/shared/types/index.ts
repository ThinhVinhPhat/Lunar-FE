export interface ErrorResponse {
    message: {
      message: string[];
    };
}

export enum Role {
  ADMIN = "Admin",
  CUSTOMER = "Customer",
  ENGINEER = "Engineer",
}