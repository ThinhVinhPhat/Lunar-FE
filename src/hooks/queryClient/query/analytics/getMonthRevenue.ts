import { useQuery } from "@tanstack/react-query";
import { getRevenue } from "@/api/service/analytic.service";

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
