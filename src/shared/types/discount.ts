import { Product } from "./product";
import { UserType } from "./user";

export enum DiscountValueType {
  PERCENTAGE = "Percentage",
  FIXED = "Fixed",
}

export enum DiscountType {
  ALL_DISCOUNT = "All Discount",
  ALL_PRODUCTS = "All Products",
  FREE_SHIP = "Free Ship",
  DISCOUNT = "Discount",
}

export interface DiscountInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  value: number;
  valueType: DiscountValueType;
  discountType: DiscountType;
  thresholdAmount: number;
  usageLimit: number;
  startAt: Date;
  expireAt: Date;
  isActive: boolean;
  userDiscounts?: UserDiscountInterface[];
  discountProduct?: DiscountProductInterface[];
}

export interface DiscountProductInterface {
  discount: DiscountInterface;
  product: Product;
  appliedAt?: Date;
  customDiscountRate?: number;
}

export interface UserDiscountInterface {
  quantity: number;
  user: UserType;
  discount: DiscountInterface;
}


export interface DiscountCategoryInterface {
  all: DiscountInterface[];
  allProducts: DiscountInterface[];
  discountProduct: DiscountInterface[];
  freeShip: DiscountInterface[];
}
