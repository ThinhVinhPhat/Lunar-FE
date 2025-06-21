import instance from "..";

export const getConversation = async (senderId: string) => {
  const response = await instance.get(`/messages/${senderId}`);
  return response.data;
};

export const getMessagesByUserId = async () => {
  const response = await instance.get(`/messages/me`);
  return response.data;
};
