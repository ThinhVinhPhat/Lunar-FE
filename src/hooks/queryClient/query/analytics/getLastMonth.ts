import { SummaryType } from "@/types/analytic";
import { getCompareLastMonth } from "@/api/service/analytic.service";
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
