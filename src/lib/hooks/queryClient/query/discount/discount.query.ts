import { useQuery } from "@tanstack/react-query";
import {
  getDiscountById,
  getAllDiscounts,
  getDiscountsByUser,
} from "@/lib/api/service/discount.service";

export const useGetAllDiscounts = (
  page: number,
  limit: number,
  discountType: string,
  name: string
) => {
  const response = useQuery({
    queryKey: ["discounts", page, limit, discountType, name],
    queryFn: () => getAllDiscounts(page, limit, discountType, name),
  });
  return {
    ...response,
    data: response.data?.data || null,
    total: response.data?.total || 0,
  };
};

export const useGetDiscountsByUser = () => {
  const response = useQuery({
    queryKey: ["discounts-by-user"],
    queryFn: () => getDiscountsByUser(),
  });
  return {
    ...response,
    data: response.data?.data || null,
    total: response.data?.total || 0,
  };
};

export const useGetDiscountById = (id: string) => {
  const response = useQuery({
    queryKey: ["discount", id],
    queryFn: () => getDiscountById(id),
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};
