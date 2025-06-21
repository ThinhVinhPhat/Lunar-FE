import { UserType } from "./user";

export type Conversation = {
  id: string;
  sender: UserType;
  receiver: UserType;
  createdAt: Date;
};

export type Message = {
  id: string;
  content: string;
  isRead: boolean;
  conversation: Conversation;
  sender: UserType;
  createdAt: Date;
  updatedAt: Date;
};
