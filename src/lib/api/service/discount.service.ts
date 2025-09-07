import { DiscountType, DiscountValueType } from "@/shared/types/discount";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";


export interface CreateDiscountInterface {
  name: string;
  description: string;
  value: number;
  valueType: DiscountValueType;
  discountType: DiscountType;
  thresholdAmount: number;
  usageLimit: number;
  isActive: boolean;
  startAt: Date;
  expireAt: Date;
  productIds?: string[];
  userIds?: string[];
}

export interface UpdateDiscountInterface extends CreateDiscountInterface {
  status: boolean;
}

export const getAllDiscounts = async (
  page: number,
  limit: number,
  discountType: string,
  name: string
) => {
  const response = await instance.get(
    API_URL.DISCOUNTS.LIST(discountType, name, page, limit)
  );
  return response.data;
};

export const getDiscountsByUser = async () => {
  const response = await instance.get(API_URL.DISCOUNTS.GET_BY_USER);
  return response.data;
};

// Lấy một discount theo ID
export const getDiscountById = async (id: string) => {
  const response = await instance.get(API_URL.DISCOUNTS.GET_BY_ID(id));
  return response.data;
};

export const createDiscount = async (data: CreateDiscountInterface) => {
  const response = await instance.post(API_URL.DISCOUNTS.CREATE, {
    name: data.name,
    description: data.description,
    value: data.value,
    valueType: data.valueType,
    discountType: data.discountType,
    thresholdAmount: data.thresholdAmount,
    usageLimit: data.usageLimit,
    isActive: data.isActive,
    startAt: data.startAt,
    expireAt: data.expireAt,
    productIds: data.productIds,
    userIds: data.userIds,
  });
  return response.data;
};

export const applyDiscount = async (discountId: string, orderId: string) => {
  const response = await instance.patch(
    API_URL.DISCOUNTS.APPLY_FOR_ORDER(discountId, orderId)
  );
  return response.data;
};

export const applyDiscountForUser = async (slug: string) => {
  const response = await instance.patch(API_URL.DISCOUNTS.APPLY_FOR_USER, {
    slug,
  });
  return response.data;
};

export const updateDiscount = async (id: string, data: UpdateDiscountInterface) => {
  const response = await instance.patch(API_URL.DISCOUNTS.UPDATE(id), {
    name: data.name,
    description: data.description,
    value: data.value,
    valueType: data.valueType,
    discountType: data.discountType,
    thresholdAmount: data.thresholdAmount,
    usageLimit: data.usageLimit,
    status: data.status,
    startAt: data.startAt,
    expireAt: data.expireAt,
    productIds: data.productIds,
    userIds: data.userIds,
    isActive: data.isActive,
  });
  return response.data;
};

export const deleteDiscount = async (id: string) => {
  const response = await instance.delete(API_URL.DISCOUNTS.DELETE(id));
  return response.data;
};

export const deleteDiscountFromOrder = async (
  discountId: string,
  orderId: string
) => {
  const response = await instance.delete(
    API_URL.DISCOUNTS.DELETE_FROM_ORDER(discountId, orderId)
  );
  return response.data;
};
