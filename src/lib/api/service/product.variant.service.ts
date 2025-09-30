import instance from "..";
import { API_URL } from "../../config/api.config";
import { AddVariantForm } from "@/pages/admin/product/modals/AddVariant";


export type GetProductVariantsParams = {
  category?: string[];
  page: number;
  limit: number;
  userId?: string;
};



export const createProductVariant = async (data: AddVariantForm) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "images") {
            data[key].forEach((image: string | File) => {
                if (image instanceof File) {
                    formData.append("images", image);
                } else {
                    formData.append("images", image);
                }
            });
        } else {
            formData.append(key, data[key as keyof AddVariantForm] as string);
        }
    });
    const response = await instance.post(API_URL.PRODUCT_VARIANT.CREATE(data.productId as string), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },  
    });
    return response.data;
};

export const getProductVariants = async ( params?: GetProductVariantsParams ) => {
    const response = await instance.get(API_URL.PRODUCT_VARIANT.LIST, {
        params,
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const getProductVariantById = async (id: string) => {
    const response = await instance.get(`/product-variant/${id}`, {
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const getProductVariantByProductId = async (id: string) => {
    console.log(id);
    
    const response = await instance.get(`/product-variant/product/${id}`, {
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const getProductVariantBySlug = async (slug: string) => {
    const response = await instance.get(`/product-variant/find-by-slug/${slug}`, {
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const updateProductVariant = async (id: string, data: AddVariantForm) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "images") {
            data[key].forEach((image: string | File) => {
                if (image instanceof File) {
                    formData.append("images", image);
                } else {
                    formData.append("images", image);
                }
            });
        } else {
            formData.append(key, data[key as keyof AddVariantForm] as string);
        }
    });
    const response = await instance.patch(API_URL.PRODUCT_VARIANT.UPDATE(id), formData , {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const deleteProductVariant = async (id: string) => {
    const response = await instance.delete(API_URL.PRODUCT_VARIANT.DELETE(id), {
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

export const updateProductVariantFavorite = async (id: string) => {
    const response = await instance.post(API_URL.FAVORITES.ADD_VARIANT(id), {}, {
        headers: {
            ...(instance.defaults.headers.common || {}),
            "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
        },
    });
    return response.data;
};

