import { Role } from "@/types/notification";
import instance from "..";

export const getNotificationByUser = async (offset: number, limit: number) => {
  const response = await instance.get(
    `/notifications/me?offset=${offset}&limit=${limit}`
  );
  return response.data;
};

export const createNotification = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: File) => {
        formData.append("image", image);
      });
    } else if (key === "targetRoles") {
      data[key]?.forEach((role: Role) => {
        formData.append("targetRoles", role);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  const response = await instance.post("/notifications", formData);
  return response.data;
};

export const updateNotification = async (id: string, data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      data[key]?.forEach((image: File) => {
        formData.append("image", image);
      });
    } else {
      formData.append(key, data[key] || "");
    }
  });
  const response = await instance.patch(`/notifications/${id}`, formData);
  return response.data;
};

export const updateNotificationStatus = async (id: string) => {
  const response = await instance.patch(`/notifications/update-status/${id}`);
  return response.data;
};

export const getAllNotification = async (
  name: string,
  offset: number,
  limit: number,
  roles: string[]
) => {
  const response = await instance.get(
    `/notifications?offset=${offset}&limit=${limit}&name=${name}&roles=${roles.join(
      ","
    )}`
  );
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await instance.delete(`/notifications/${id}`);
  return response.data;
};
