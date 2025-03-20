import instance from "..";

export const getCategoriesDetail = async () => {
  const response = await instance.get(`/category-details`);
  return response.data;
};

export const getCategories = async () => {
  const response = await instance.get(`/category`);
  return response.data;
};

export const getCategoriesDetailByCategoryName = async (name: string) => {
  const response = await instance.get(
    `/category-details/get-by-category/${name}`
  );
  return response.data;
};
