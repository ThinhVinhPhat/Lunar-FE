import { ProductType } from "./product";

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
