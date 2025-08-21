import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export const getConversation = async (senderId: string) => {
  const response = await instance.get(API_URL.MESSAGES.GET_CONVERSATION(senderId));
  return response.data;
};

export const getMessagesByUserId = async () => {
  const response = await instance.get(API_URL.MESSAGES.GET_BY_USER);
  return response.data;
};
