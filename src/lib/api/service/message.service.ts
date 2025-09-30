import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export const getConversation = async (senderId: string) => {
  const response = await instance.get(API_URL.MESSAGES.GET_CONVERSATION(senderId), {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};

export const getMessagesByUserId = async () => {
  const response = await instance.get(API_URL.MESSAGES.GET_BY_USER, {
    headers: {
      ...(instance.defaults.headers.common || {}),
      "x-api-key": import.meta.env.VITE_PUBLIC_API_KEY ?? "",
    },
  });
  return response.data;
};
