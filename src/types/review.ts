import { ProductType } from "./product";
import { UserType } from "./user";

export interface CommentType {
  id: string;
  content: string;
  rate: number;
  images: string[];
  user: UserType;
  createdAt: Date;
  updatedAt: Date;
  product: ProductType;
}
export enum CommentSort {
  NEWEST = "NEWEST",
  LOW_RATE = "LOW_RATE",
  HIGH_RATE = "HIGH_RATE",
}
