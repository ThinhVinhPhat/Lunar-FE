import { OrderFilterEnum, SummaryType } from "@/shared/types/analytic";
import { getCompareLastMonth, getRevenue, getSummary, getUserOrder } from "@/lib/api/service/analytic.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCompareLastMonth = (summary: SummaryType) => {
  const response = useQuery({
    queryKey: ["compareLastMonth"],
    queryFn: () => getCompareLastMonth(summary),
  });
  return {
    ...response,
    data: response?.data?.data || null,
  };
};


export const useGetMonthRevenue = () => {
    const response = useQuery({
      queryKey: ["getMonthRevenue"],
      queryFn: () => getRevenue(),
    });
    return {
      ...response,
      data: response.data?.data || [],
    };
  };

  export const useGetSummary = () => {
    const response = useQuery({
      queryKey: ["summary"],
      queryFn: () => getSummary(),
    });
    return {
      ...response,
      data: response?.data?.data || null,
    };
  };

  export const useGetUserOrder = (
    page: number,
    limit: number,
    sort: OrderFilterEnum
  ) => {
    const response = useQuery({
      queryKey: ["user-order", page, limit, sort],
      queryFn: () => getUserOrder(page, limit, sort),
    });
    return {
      ...response,
      data: response.data || [],
      total: response.data?.meta?.total || 0,
    };
  };
  