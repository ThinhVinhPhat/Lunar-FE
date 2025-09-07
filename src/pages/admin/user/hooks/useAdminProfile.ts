import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/shared/types/user";
import { useUpdateUser } from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import {
  getDeviceInfo,
  inboxMessages,
  notifications,
} from "@/database/admin/profile";

/**
 * Hook for managing admin profile functionality
 * 
 * Features:
 * - User profile data management
 * - Form handling for profile updates
 * - Notification settings management
 * - Inbox message handling
 * - Device info display
 * - Navigation utilities
 * 
 * @returns {Object} All admin profile functionality and state
 */
export const useAdminProfile = () => {
  // ===== STATE MANAGEMENT =====
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    userRegistrations: false,
    orderUpdates: true,
    securityAlerts: true,
    maintenanceAlerts: false,
    reportNotifications: true,
  });

  // ===== API HOOKS =====
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  // ===== FORM MANAGEMENT =====
  const form = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      company: user?.company,
      city: user?.city,
      role: user?.role,
      avatar: user?.avatar ? [user.avatar] : [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    setValue,
  } = form;

  // ===== DATA =====
  const deviceInfo = getDeviceInfo();
  const unreadCount = inboxMessages.filter((msg) => !msg.read).length;

  // ===== EFFECTS =====
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("address", user.address);
      setValue("company", user.company);
      setValue("city", user.city);
      setValue("role", user.role);
      setValue("avatar", user.avatar ? [user.avatar] : []);
    }
  }, [user, setValue]);

  // ===== EVENT HANDLERS =====
  /**
   * Handle form submission for profile update
   */
  const onSubmit = async (data: UserType) => {
    try {
      if (isDirty) {
        await updateUser(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  /**
   * Handle notification setting changes
   */
  const handleNotificationChange = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  /**
   * Handle navigation to admin tools
   */
  const navigateToUserManagement = () => {
    navigate("/admin/accounts");
  };

  const navigateToOrderManagement = () => {
    navigate("/admin/orders");
  };

  const navigateToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const navigateToSettings = () => {
    navigate("/admin/settings");
  };

  /**
   * Handle inbox actions
   */
  const markAllAsRead = () => {
    // Implementation for marking all messages as read
    console.log("Mark all messages as read");
  };

  const deleteAllMessages = () => {
    // Implementation for deleting all messages
    console.log("Delete all messages");
  };

  const markMessageAsRead = (messageId: string) => {
    // Implementation for marking specific message as read
    console.log("Mark message as read:", messageId);
  };

  const deleteMessage = (messageId: string) => {
    // Implementation for deleting specific message
    console.log("Delete message:", messageId);
  };

  const viewMessageDetails = (messageId: string) => {
    // Implementation for viewing message details
    console.log("View message details:", messageId);
  };

  /**
   * Save notification settings
   */
  const saveNotificationSettings = () => {
    // Implementation for saving notification settings
    console.log("Save notification settings:", notificationSettings);
  };

  // ===== UTILITY FUNCTIONS =====
  /**
   * Get priority color for messages
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Get priority text in Vietnamese
   */
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Bình thường";
    }
  };

  /**
   * Get formatted device info
   */
  const getFormattedDeviceInfo = () => {
    return deviceInfo?.map((item, index) => ({
      ...item,
      id: index,
    })) || [];
  };

  /**
   * Get notification list with current settings
   */
  const getNotificationList = () => {
    return notifications(notificationSettings);
  };

  // ===== RETURN INTERFACE =====
  return {
    // User data
    user,
    isUpdating,
    
    // Form management
    form,
    register,
    handleSubmit,
    setValue,
    isDirty,
    onSubmit,
    
    // Edit state
    isEditing,
    setIsEditing,
    
    // Notification settings
    notificationSettings,
    handleNotificationChange,
    saveNotificationSettings,
    getNotificationList,
    
    // Device info
    deviceInfo: getFormattedDeviceInfo(),
    
    // Inbox
    inboxMessages,
    unreadCount,
    markAllAsRead,
    deleteAllMessages,
    markMessageAsRead,
    deleteMessage,
    viewMessageDetails,
    
    // Navigation
    navigateToUserManagement,
    navigateToOrderManagement,
    navigateToDashboard,
    navigateToSettings,
    
    // Utility functions
    getPriorityColor,
    getPriorityText,
  };
};
