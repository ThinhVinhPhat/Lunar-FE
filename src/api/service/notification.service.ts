import { Role } from "@/types/notification";
import instance from "..";

export const getNotificationByUser = async (page: number, limit: number) => {
  const response = await instance.get(
    `/notifications/me?page=${page}&limit=${limit}`
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
  page: number,
  limit: number,
  roles: string[]
) => {
  const response = await instance.get(
    `/notifications?page=${page}&limit=${limit}&name=${name}&roles=${roles.join(
      ","
    )}`
  );
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await instance.delete(`/notifications/${id}`);
  return response.data;
};
