import { NotificationTemplate, userNotification } from "@/types/notification";
import instance from "..";
import { API_URL } from "@/lib/config/api.config";
import { Role } from "@/types";

export interface CreateNotificationParams {
  title: string;
  message: string;
  image: string[];
  type: string;
  targetRoles: Role[];
};

export interface UpdateNotificationParams extends CreateNotificationParams {
  status: boolean;
};

export const getNotificationByUser = async (page: number, limit: number) => {
  const response = await instance.get(
    API_URL.NOTIFICATIONS.GET_BY_USER(page, limit)
  );
  return response.data;
};

export interface GetAllNotificationInterface {
  data: NotificationTemplate[];
  userNotification: userNotification[];
  meta: {
    total: number;
  };
}

export const createNotification = async (data: CreateNotificationParams) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: string) => {
        formData.append("image", image as unknown as File);
      });
    } else if (key === "targetRoles") {
      data[key]?.forEach((role: string) => {
        formData.append("targetRoles", role);
      });
    } else {
      formData.append(key, data[key as keyof CreateNotificationParams] as string);
    }
  });
  const response = await instance.post(API_URL.NOTIFICATIONS.CREATE, formData);
  return response.data;
};

export const updateNotification = async (id: string, data: UpdateNotificationParams) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: string) => {
        formData.append("image", image as unknown as File);
      });
    } else {
      formData.append(key, data[key as keyof CreateNotificationParams] as string);
    }
  });
  const response = await instance.patch(API_URL.NOTIFICATIONS.UPDATE(id), formData);
  return response.data;
};

export const updateNotificationStatus = async (id: string) => {
  const response = await instance.patch(API_URL.NOTIFICATIONS.UPDATE_STATUS(id));
  return response.data;
};

export const getAllNotification = async (
  name: string,
  page: number,
  limit: number,
  roles: string[]
) => {
  const response = await instance.get(
    API_URL.NOTIFICATIONS.LIST(name, page, limit, roles)
  );
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await instance.delete(API_URL.NOTIFICATIONS.DELETE(id));
  return response.data;
};
