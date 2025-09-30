import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export interface CreateCategoryInterface {
  name: string;
}

export interface UpdateCategoryInterface extends CreateCategoryInterface {
  status: boolean;
}

export interface CreateCategoryDetailInterface {
  name: string;
  image: string[];
}

export interface UpdateCategoryDetailInterface extends CreateCategoryDetailInterface {
  status: boolean;
}

export const getCategoriesDetail = async () => {
  const response = await instance.get(API_URL.CATEGORIES.GET_DETAIL, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const addCategory = async (data: CreateCategoryInterface) => {
  const response = await instance.post(API_URL.CATEGORIES.CREATE, {
    name: data.name,
  }, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await instance.delete(API_URL.CATEGORIES.DELETE(id), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getCategories = async (
  page: number,
  limit: number,
  name: string
) => {
  const response = await instance.get(
    API_URL.CATEGORIES.LIST(name, page, limit),
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};

export const getCategoriesDetailByCategoryName = async (name: string) => {
  const response = await instance.get(
    API_URL.CATEGORIES.GET_DETAIL_BY_NAME(name),
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};

export const deleteCategoryDetail = async (id: string) => {
  const response = await instance.delete(API_URL.CATEGORIES.DELETE_DETAIL(id), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const addCategoryDetail = async (categoryId: string, data: CreateCategoryDetailInterface) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: string) => {
        formData.append("images", image as unknown as File);
      });
    } else {
      formData.append(key, data[key as keyof CreateCategoryDetailInterface] as string);
    }
  });
  const response = await instance.post(
    API_URL.CATEGORIES.CREATE_DETAIL(categoryId),
    formData,
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "Content-Type": "multipart/form-data",
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};

export const updateCategoryDetail = async (categoryId: string, data: UpdateCategoryDetailInterface) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: string) => {
        formData.append("images", image as unknown as File);
      });
    } else {
      formData.append(key, data[key as keyof UpdateCategoryDetailInterface] as string);
    }
  });
  const response = await instance.patch(
    API_URL.CATEGORIES.UPDATE_DETAIL(categoryId),
    formData,
    {
      headers: {
        ...(instance.defaults.headers.common || {}),
        "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
      },
    }
  );
  return response.data;
};
