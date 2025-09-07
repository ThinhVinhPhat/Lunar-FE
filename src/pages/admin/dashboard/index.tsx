import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  Users, 
  Package, 
  DollarSign,
  ShoppingCart,
  Activity
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";
import { useDashboardManagement } from "./hooks/useDashboardManagement";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { Product } from "@/shared/types/product";
import { OrderFilterEnum } from "@/shared/types/analytic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type Activity = {
  title: string;
  timestamp: string;
};

export type OrderStatusDistribution = {
  status: string;
  count: number;
  percentage: number;
};

const Dashboard: React.FC<AuthProps> = ({ user }) => {
  const {
    // Data
    basicStats,
    revenueStats,
    growthMetrics,
    recentActivities,
    topProducts,
    revenueChartData,
    orderStatusDistribution,

    // Loading state
    isLoading,

    // Filter state
    selectedPeriod,
    orderFilter,
    setOrderFilter,

    // Event handlers
    handlePeriodChange,

    // Utility functions
    formatCurrency,
    formatPercentage,
    getGrowthColor,
    getStatusBadgeColor,
  } = useDashboardManagement();

  // Handle order filter change
  const handleOrderFilterChange = (event: SelectChangeEvent) => {
    setOrderFilter(event.target.value as OrderFilterEnum);
  };


  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Users",
      value: basicStats.totalUsers,
      change: formatPercentage(growthMetrics?.userGrowth),
      icon: Users,
      color: "blue",
      changeColor: getGrowthColor(growthMetrics?.userGrowth),
    },
    {
      title: "Total Products",
      value: basicStats.totalProducts,
      change: `${basicStats.activeProducts} active`,
      icon: Package,
      color: "green",
      changeColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: basicStats.totalOrders,
      change: formatPercentage(growthMetrics?.orderGrowth),
      icon: ShoppingCart,
      color: "purple",
      changeColor: getGrowthColor(growthMetrics?.orderGrowth),
    },
    {
      title: "Total Revenue",
      value: formatCurrency(revenueStats?.totalRevenue),
      change: formatPercentage(growthMetrics?.revenueGrowth),
      icon: DollarSign,
      color: "yellow",
      changeColor: getGrowthColor(growthMetrics?.revenueGrowth),
    },
  ];

  

  // Chart data for revenue
  const chartData = {
    labels: revenueChartData?.monthlyRevenues,
    datasets: [
      {
        label: 'Revenue',
        data: revenueChartData?.monthlyRevenues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Orders',
        data: revenueChartData?.orders,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue & Orders Over Time',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, {user?.lastName}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards?.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h2>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${card.color}-100`}>
                <card.icon size={24} className={`text-${card.color}-600`} />
              </div>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${card.changeColor}`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {topProducts?.map((product: Product, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {product.name || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {formatCurrency(Number(product.price))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Revenue & Orders
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePeriodChange("7")}
                className={`px-3 py-1 text-sm rounded ${
                  selectedPeriod === "7"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => handlePeriodChange("30")}
                className={`px-3 py-1 text-sm rounded ${
                  selectedPeriod === "30"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                30D
              </button>
            </div>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activities
            </h2>
            <FormControl size="small" className="min-w-[140px]">
              <InputLabel 
                id="order-filter-label" 
                className="text-gray-600"
                sx={{
                  fontSize: '0.875rem',
                  '&.Mui-focused': {
                    color: '#C8A846',
                  },
                }}
              >
                Filter Orders
              </InputLabel>
              <Select
                labelId="order-filter-label"
                value={orderFilter}
                label="Filter Orders"
                onChange={handleOrderFilterChange}
                className="bg-white"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C8A846',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C8A846',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '0.875rem',
                    padding: '8px 14px',
                  },
                }}
              >
                {Object.values(OrderFilterEnum).map((filter) => (
                  <MenuItem 
                    key={filter} 
                    value={filter}
                    className="text-sm hover:bg-gray-50"
                    sx={{
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#fef3c7',
                        '&:hover': {
                          backgroundColor: '#fde68a',
                        },
                      },
                    }}
                  >
                    {filter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="space-y-4">
            {recentActivities?.map((activity: Activity, index: number) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Activity size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>
          <div className="space-y-3">
            {orderStatusDistribution?.map((status: OrderStatusDistribution, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${getStatusBadgeColor(status.status)}`}></span>
                  <span className="text-sm text-gray-700 capitalize">{status.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-800">{status.count}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({status.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    </IsLoadingWrapper>
  );
};

const DashboardWrapper = isLoginAdminAuth(Dashboard);

export default DashboardWrapper;
