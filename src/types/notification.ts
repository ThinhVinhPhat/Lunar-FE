export enum NotificationType {
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_ORDER = "NEW_ORDER",
  NEW_REPLY = "NEW_REPLY",
  NEW_DEAL = "NEW_DEAL",
  NEW_THREAD = "NEW_THREAD",
}

export enum Role {
  ADMIN = "Admin",
  CUSTOMER = "Customer",
  ENGINEER = "Engineer",
}

export interface userNotification {
  notification: NotificationTemplate;
  userId: string;
  isRead: boolean;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  image?: string[];
  type: NotificationType;
  targetRoles?: Role[];
  createdAt: string;
  updatedAt: string;
  status: boolean;
}
