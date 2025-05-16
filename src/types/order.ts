import { ProductType } from "./product";
import { UserType } from "./user";

export type CreateOrderProps = {
  shippingAddress: string;
  shipPhone: string;
  shippingFee: number;
  note: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  shipPhone: string;
  shippingFee: number;
  orderDate: string;
  note: string;
  status: string;
  paymentId: string;
  orderDetails: OrderDetail[];
  total_price?: number;
  user: UserType;
};

export enum OrderStatus {
  ALL_ORDER = "ALL_ORDER",
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  REJECTED = "Rejected",
}

export type OrderType = {
  order: Order;
  total: number;
};

export type OrderDetail = {
  id: string;
  createdAt: string;
  updatedAt: string;
  product_name: string;
  quantity: number;
  price: string;
  total: string;
  product: ProductType;
};
