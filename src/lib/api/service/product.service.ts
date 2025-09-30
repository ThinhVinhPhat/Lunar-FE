import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export type CreateProductParams = {
  categoryId: string[];
  name: string;
  description: string;
  video?: string | null;
  images: (string | File)[];
  isFreeShip: boolean;
  isNew: boolean;
  isFeatured: boolean;
  status: boolean;
};

export type UpdateProductParams = {
  id: string;
  categoryId: string[];
  name: string;
  description: string;
  video?: string | null;
  images: (string | File)[];
  isFreeShip: boolean;
  isNew: boolean;
  isFeatured: boolean;
  status: boolean;
};

export type GetProductsParams = {
  category?: string[];
  page: number;
  limit: number;
  userId?: string;
};


export type FindProductBySuggestionParams = {
  suggestion: string;
  limit: number;
  page: number;
};

export const getProducts = async ({
  category,
  page = 1,
  limit = 20,
  userId,
}: GetProductsParams) => {
  let query = API_URL.PRODUCTS.LIST + `?page=${page}&limit=${limit}`;

  if (category && category?.length > 0) {
    category.forEach((item) => {
      query += `&category=${item}`;
    });
  }
  if (userId) {
    query += `&userId=${userId}`;
  }

  const response = await instance.get(query, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getProduct = async (slug: string | undefined, userId?: string) => {
  let query = API_URL.PRODUCTS.DETAIL_BY_SLUG(slug as string);
  if (userId) {
    query += `&userId=${userId}`;
  }
  const response = await instance.get(query, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
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

  const response = await instance.post(API_URL.PRODUCTS.CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
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

  const response = await instance.patch(API_URL.PRODUCTS.UPDATE(data.id as string), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string | undefined) => {
  const response = await instance.delete(API_URL.PRODUCTS.DELETE(id as string), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const favoriteProduct = async (productId: string | undefined) => {
  const response = await instance.post(
    API_URL.FAVORITES.ADD_PRODUCT(productId as string),
    {},
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};

export const getFavoriteProducts = async () => {
  const response = await instance.get(API_URL.FAVORITES.GET_BY_USER, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getProductBySuggestion = async ({ suggestion, page = 1, limit = 20 }: FindProductBySuggestionParams) => {
  const response = await instance.get(API_URL.PRODUCTS.SUGGESTION(suggestion, page, limit), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};
