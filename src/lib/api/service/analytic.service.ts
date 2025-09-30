import { OrderFilterEnum, SummaryType } from "@/shared/types/analytic";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";

export interface GetSummaryInterface {
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  totalNewUsers: number;
}

export const getSummary = async () => {
  const response = await instance.get(API_URL.ANALYTICS.SUMMARY, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getCompareLastMonth = async (summary: SummaryType) => {
  const response = await instance.get(
    API_URL.ANALYTICS.COMPARE_LAST_MONTH(summary.totalOrders, summary.totalRevenue, summary.totalViews, summary.totalNewUsers),
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};

export const getRevenue = async () => {
  const response = await instance.get(API_URL.ANALYTICS.REVENUE, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getUserOrder = async (
  page: number,
  limit: number,
  sort: OrderFilterEnum
) => {
  const response = await instance.get(
    API_URL.ANALYTICS.USER_ORDERS(page, limit, sort),
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};
