import { DiscountInterface } from "./discount";
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
  shipments: Shipment[];
  orderTracks: TrackingOrder[];
  discounts: DiscountInterface[];
  finalPrice: number;
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
export enum PaymentMethod {
  CREDIT_CARD = "Credit Card",
  PAYPAL = "PayPal",
  BANK_TRANSFER = "Bank Transfer",
  CASH_ON_DELIVERY = "Cash on Delivery",
}

export enum ShipmentStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
}

export type Shipment = {
  order: Order;
  deliveredAt: string;
  estimatedDeliveryDate: string;
  shippingCarrier: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type TrackingOrder = {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentAddress: string;
  status: OrderStatus;
};
