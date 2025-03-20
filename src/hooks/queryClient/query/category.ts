import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoriesDetail,
  getCategoriesDetailByCategoryName,
} from "../../../api/service/category.service";

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

export const useGetCategories = () => {
  const response = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};

export const useGetCategoriesDetailByCateName = (name: string) => {
  const response = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesDetailByCategoryName(name),
  });

  return {
    ...response,
    data: response.data?.data || [],
  };
};
