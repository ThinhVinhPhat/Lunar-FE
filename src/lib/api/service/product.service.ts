import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export type CreateProductParams = {
  categoryId: string[];
  name: string;
  price: number;
  description: string;
  stock: number;
  discount: number;
  video?: string;
  images: (string | File)[];
  isFreeShip: boolean;
  isNew: boolean;
  isFeatured: boolean;
};

export type UpdateProductParams = {
  id: string;
  categoryId: string[];
  name: string;
  price: number;
  description: string;
  stock: number;
  discount: number;
  video?: string;
  images: (string | File)[];
  isFreeShip: boolean;
  isNew: boolean;
  isFeatured: boolean;
  status?: boolean;
};

export const getProducts = async (
  category?: string[],
  page: number = 1,
  limit: number = 20,
  userId?: string
) => {
  let query = API_URL.PRODUCTS.LIST + `?page=${page}&limit=${limit}`;

  if (category && category?.length > 0) {
    category.forEach((item) => {
      query += `&category=${item}`;
    });
  }
  if (userId) {
    query += `&userId=${userId}`;
  }

  const response = await instance.get(query);
  return response.data;
};

export const getProduct = async (slug: string | undefined, userId?: string) => {
  let query = API_URL.PRODUCTS.DETAIL_BY_SLUG(slug as string);
  if (userId) {
    query += `&userId=${userId}`;
  }
  const response = await instance.get(query);
  return response.data;
};

export const addProduct = async (data: CreateProductParams) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "images") {
      data[key].forEach((image: string | File) => {
        if (image instanceof File) {
          formData.append("images", image);
        } else {
          // Nếu là string (URL), có thể cần xử lý khác hoặc skip
          formData.append("images", image);
        }
      });
    } else {
      formData.append(key, data[key as keyof CreateProductParams] as string);
    }
  });

  const response = await instance.post(API_URL.PRODUCTS.CREATE, formData);
  return response.data;
};

export const updateProduct = async (data: UpdateProductParams) => {
  console.log(data);
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "images") {
      data[key].forEach((image: string | File) => {
        if (image instanceof File) {
          formData.append("images", image);
        } else {
          // Nếu là string (URL), có thể cần xử lý khác hoặc skip
          formData.append("images", image);
        }
      });
    } else {
      formData.append(key, data[key as keyof UpdateProductParams] as string);
    }
  });

  const response = await instance.patch(API_URL.PRODUCTS.UPDATE(data.id as string), formData);
  return response.data;
};

export const deleteProduct = async (id: string | undefined) => {
  const response = await instance.delete(API_URL.PRODUCTS.DELETE(id as string));
  return response.data;
};

export const favoriteProduct = async (productId: string | undefined) => {
  const response = await instance.post(
    API_URL.FAVORITES.ADD(productId as string)
  );
  return response.data;
};

export const getFavoriteProducts = async () => {
  const response = await instance.get(API_URL.FAVORITES.GET_BY_USER);
  return response.data;
};

export const getProductBySuggestion = async (suggestion: string) => {
  const response = await instance.get(API_URL.PRODUCTS.SUGGESTION(suggestion));
  return response.data;
};
