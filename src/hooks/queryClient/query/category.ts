import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoriesDetail,
  getCategoriesDetailByCategoryName,
} from "@/api/service/category.service";

export const useGetCategoriesDetail = () => {
  const response = useQuery({
    queryKey: ["categories-detail"],
    queryFn: () => getCategoriesDetail(),
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};

export const useGetCategories = (
  name: string = "",
  limit: number = 10,
  page: number = 1
) => {
  const response = useQuery({
    queryKey: ["categories", name, page, limit],
    queryFn: () => getCategories(page, limit, name),
  });

  return {
    ...response,
    data: response.data?.data || [],
    total: response.data?.meta?.total || 0,
  };
};

export const useGetCategoriesDetailByCateName = (name: string) => {
  const response = useQuery({
    queryKey: ["categories-detail-by-name"],
    queryFn: () => getCategoriesDetailByCategoryName(name),
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};
