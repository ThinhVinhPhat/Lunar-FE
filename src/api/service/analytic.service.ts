import { OrderFilterEnum, SummaryType } from "@/types/analytic";
import instance from "..";

export const getSummary = async () => {
  const response = await instance.get("/statistic/summary");
  return response.data;
};

export const getCompareLastMonth = async (summary: SummaryType) => {
  const response = await instance.get(
    `/statistic/compare-last-month?totalOrder=${summary.totalOrders}&totalRevenue=${summary.totalRevenue}&totalView=${summary.totalViews}&totalCustomer=${summary.totalNewUsers}`
  );
  return response.data;
};

export const getRevenue = async () => {
  const response = await instance.get("/statistic/get-year-Revenue");
  return response.data;
};

export const getUserOrder = async (
  offset: number,
  limit: number,
  sort: OrderFilterEnum
) => {
  const response = await instance.get(
    `/statistic/user-orders?offset=${offset}&limit=${limit}&filter=${sort}`
  );
  return response.data;
};
