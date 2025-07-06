export const inboxMessages = [
  {
    id: 1,
    type: "system",
    title: "Cập nhật hệ thống thành công",
    message: "Hệ thống đã được cập nhật lên phiên bản 2.1.3",
    time: "2 phút trước",
    read: false,
    icon: "⚙️",
    priority: "medium",
  },
  {
    id: 2,
    type: "security",
    title: "Cảnh báo bảo mật",
    message: "Phát hiện đăng nhập bất thường từ IP: 192.168.1.100",
    time: "15 phút trước",
    read: false,
    icon: "🔒",
    priority: "high",
  },
  {
    id: 3,
    type: "user",
    title: "Người dùng mới đăng ký",
    message: "5 người dùng mới đã đăng ký trong giờ qua",
    time: "1 giờ trước",
    read: true,
    icon: "👥",
    priority: "low",
  },
  {
    id: 4,
    type: "order",
    title: "Đơn hàng cần xử lý",
    message: "12 đơn hàng đang chờ xác nhận",
    time: "2 giờ trước",
    read: true,
    icon: "📦",
    priority: "medium",
  },
  {
    id: 5,
    type: "report",
    title: "Báo cáo hàng tháng",
    message: "Báo cáo doanh thu tháng 6 đã sẵn sàng",
    time: "3 giờ trước",
    read: true,
    icon: "📊",
    priority: "low",
  },
  {
    id: 6,
    type: "maintenance",
    title: "Bảo trì định kỳ",
    message: "Hệ thống sẽ bảo trì vào 2:00 AM ngày mai",
    time: "5 giờ trước",
    read: true,
    icon: "🔧",
    priority: "medium",
  },
];

export const getDeviceInfo = () => {
  return [
    {
      name: "CPU Usage",
      value: "100%",
    },
    {
      name: "Memory",
      value: "100%",
    },
    {
      name: "Storage",
      value: "100%",
    },
  
  ];
};

export const notifications = (notificationSettings: any) => [
  {
    name: "Email Notifications",
    value: notificationSettings.emailNotifications,
  },
  {
    name: "Push Notifications",
    value: notificationSettings.pushNotifications,
  },
  {
    name: "System Alerts",
    value: notificationSettings.systemAlerts,
  },
  {
    name: "User Registrations",
    value: notificationSettings.userRegistrations,
  },
  {
    name: "Order Updates",
    value: notificationSettings.orderUpdates,
  },
  {
    name: "Report Notifications",
    value: notificationSettings.reportNotifications,
  },
  {
    name: "Maintenance Alerts",
    value: notificationSettings.maintenanceAlerts,
  },
];
