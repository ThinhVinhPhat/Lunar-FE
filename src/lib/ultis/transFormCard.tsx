import { CompareLastMonthType, SummaryType } from "@/shared/types/analytic";
import { CreditCard, Eye, ShoppingBag, Users } from "lucide-react";

export const transFormCard = (
  summary: SummaryType,
  change: CompareLastMonthType
) => {
  const statsCards = [
    {
      title: "Total Revenue",
      value: summary?.totalRevenue + " $",
      change: change?.changeRevenue + "%" || "0%",
      icon: <CreditCard size={24} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      isIncrease: Number(change?.changeRevenue) > 0,
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders,
      change: change?.changeOrder + "%" || "0%",
      icon: <ShoppingBag size={24} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      isIncrease: Number(change?.changeOrder) > 0,
    },
    {
      title: "Total Customers",
      value: summary?.totalNewUsers,
      change: change?.changeCustomer + "%" || "0%",
      icon: <Users size={24} />,
      iconBg: "bg-[#f5ecd1]",
      iconColor: "text-[#C8A846]",
      isIncrease: Number(change?.changeCustomer) > 0,
    },
    {
      title: "Total Views",
      value: summary?.totalViews + " views",
      change: change?.changeView + "%" || "0%",
      icon: <Eye size={24} />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      isIncrease: Number(change?.changeView) > 0,
    },
  ];
  return statsCards;
};


export type RevenueType = {
  monthlyRevenues: {
    month: string;
    totalRevenue: number;
  }[];
  categoryCounts: {
    [category: string]: number;
  };
};

export const transFormRevenue = (revenue: RevenueType) => {
  if (!revenue || !revenue.monthlyRevenues) {
    return {
      revenueData: {
        labels: [],
        datasets: [
          {
            label: "Revenue",
            data: [],
            borderColor: "#C8A846",
            backgroundColor: "rgba(200, 168, 70, 0.2)",
            tension: 0.4,
          },
        ],
      },
      salesData: {
        labels: [],
        datasets: [
          {
            label: "Sales by Category",
            data: [],
            backgroundColor: [],
          },
        ],
      },
    };
  }

  const months = revenue.monthlyRevenues.map((item) => {
    const date = new Date(item.month);
    return date.toLocaleString("default", { month: "short" });
  });

  const revenueValues = revenue.monthlyRevenues.map((item) =>
    parseFloat(item.totalRevenue.toString())
  );

  // Transform category data
  const categoryLabels = Object.keys(revenue.categoryCounts || {});
  const categoryValues = Object.values(revenue.categoryCounts || {});

  // Generate background colors for categories
  const backgroundColors = [
    "#C8A846",
    "#d4bc6e",
    "#e0cd96",
    "#ecdebe",
    "#f5ecd1",
    "#e8d7b0",
    "#dbc285",
    "#c9b06a",
  ];

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: revenueValues,
        borderColor: "#C8A846",
        backgroundColor: "rgba(200, 168, 70, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const salesData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Sales by Category",
        data: categoryValues,
        backgroundColor: backgroundColors.slice(0, categoryLabels.length),
      },
    ],
  };

  return { revenueData, salesData };
};
