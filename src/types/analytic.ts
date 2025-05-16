import { Product } from "./product";

export interface SummaryType {
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  totalNewUsers: number;
  topProducts: Product[];
}

export interface CompareLastMonthType {
  changeOrder: number;
  changeRevenue: number;
  changeView: number;
  changeCustomer: number;
}

export enum OrderFilterEnum {
  RECENT = "Recent",
  LAST_24_HOUR = "last 24 hour",
  LAST_2_DAYS = "last 2 days",
  LAST_7_DAY = "last 7 day",
  LAST_MONTH = "last month",
}

export interface UserOrderType {
  id: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  shipPhone: string;
  shippingFee: string;
  orderDate: string;
  note: string;
  status: string;
  paymentId: string | null;
  total_price: number;
  timeSinceOrder: string;
}
