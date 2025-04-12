import { CreditCard, Eye, ShoppingBag, Users } from "lucide-react";

export const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [12000, 19000, 13000, 25000, 22000, 30000],
      borderColor: "#C8A846",
      backgroundColor: "rgba(200, 168, 70, 0.2)",
      tension: 0.4,
    },
  ],
};

export const salesData = {
  labels: ["Men", "Women", "Children", "Accessories", "Sunglasses"],
  datasets: [
    {
      label: "Sales by Category",
      data: [12, 19, 8, 15, 12],
      backgroundColor: [
        "#C8A846",
        "#d4bc6e",
        "#e0cd96",
        "#ecdebe",
        "#f5ecd1",
      ],
    },
  ],
};

export const statsCards = [
  {
    title: "Total Revenue",
    value: "$121,000",
    change: "+12%",
    icon: <CreditCard size={24} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Total Orders",
    value: "2,345",
    change: "+3.5%",
    icon: <ShoppingBag size={24} />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Total Customers",
    value: "12,043",
    change: "+8.2%",
    icon: <Users size={24} />,
    iconBg: "bg-[#f5ecd1]",
    iconColor: "text-[#C8A846]",
  },
  {
    title: "Total Views",
    value: "48,271",
    change: "+15.3%",
    icon: <Eye size={24} />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];