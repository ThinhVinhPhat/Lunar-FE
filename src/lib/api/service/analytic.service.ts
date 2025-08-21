  import { OrderFilterEnum, SummaryType } from "@/types/analytic";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";

export interface GetSummaryInterface {
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  totalNewUsers: number;
}

export const getSummary = async () => {
  const response = await instance.get(API_URL.ANALYTICS.SUMMARY);
  return response.data;
};

export const getCompareLastMonth = async (summary: SummaryType) => {
  const response = await instance.get(
    API_URL.ANALYTICS.COMPARE_LAST_MONTH(summary.totalOrders, summary.totalRevenue, summary.totalViews, summary.totalNewUsers)
  );
  return response.data;
};

export const getRevenue = async () => {
  const response = await instance.get(API_URL.ANALYTICS.REVENUE);
  return response.data;
};

export const getUserOrder = async (
  page: number,
  limit: number,
  sort: OrderFilterEnum
) => {
  const response = await instance.get(
    API_URL.ANALYTICS.USER_ORDERS(page, limit, sort)
  );
  return response.data;
};
