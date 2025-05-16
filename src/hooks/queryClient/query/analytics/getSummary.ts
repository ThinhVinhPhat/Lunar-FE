import { getSummary } from "../../../../api/service/analytic.service";
import { useQuery } from "@tanstack/react-query";

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
