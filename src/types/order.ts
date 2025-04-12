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
  total?: number;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

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
