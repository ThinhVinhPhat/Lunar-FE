import { useState, useMemo } from "react";
import { 
  useGetSummary, 
  useGetMonthRevenue, 
  useGetCompareLastMonth,
  useGetUserOrder 
} from "@/lib/hooks/queryClient/query/analytics/analytics.query";
import { OrderFilterEnum, UserOrderType } from "@/shared/types/analytic";
import { useProducts } from "@/lib/hooks/queryClient/query/product/product.query";
import { Product } from "@/shared/types/product";

/**
 * Dashboard management hook using analytics APIs
 * 
 * Features:
 * - Summary statistics from analytics API
 * - Monthly revenue data
 * - Comparison with last month
 * - User order analytics
 * - Chart data preparation
 * 
 * @returns {Object} All dashboard functionality and computed data
 */
export const useDashboardManagement = () => {
  // ===== STATE MANAGEMENT =====
  const [selectedPeriod, setSelectedPeriod] = useState("30"); // days
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [orderFilter, setOrderFilter] = useState(OrderFilterEnum.LAST_MONTH);
  // ===== ANALYTICS API HOOKS =====
  const { data: summaryData, isLoading: summaryLoading } = useGetSummary();
  const { data: monthlyRevenue, isLoading: revenueLoading } = useGetMonthRevenue();
  const { data: compareData, isLoading: compareLoading } = useGetCompareLastMonth(summaryData);
  const { data: userOrderData, isLoading: userOrderLoading, total: totalUserOrder } = useGetUserOrder(1, 10, orderFilter);
  const { data: products, total } = useProducts({limit: 10, page: 1})
  // ===== LOADING STATE =====
  const isLoading = summaryLoading || revenueLoading || compareLoading || userOrderLoading;

  // ===== COMPUTED STATISTICS FROM ANALYTICS API =====
  /**
   * Basic statistics from summary API
   */
  const basicStats = useMemo(() => {
    if (!summaryData) {
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalViews: 0,
        totalNewUsers: 0,
        activeUsers: 0,
        activeProducts: 0,
        activeOrders: 0,
      };
    }
        
    return {
      totalUsers: summaryData.totalNewUsers || 0,
      totalProducts: total || 0,
      totalOrders: summaryData.totalOrders || 0,
      totalRevenue: summaryData.totalRevenue || 0,
      totalViews: summaryData.totalViews || 0,
      totalNewUsers: summaryData.totalNewUsers || 0,
      activeUsers: summaryData.totalNewUsers || 0,
      activeProducts: products?.data?.map((item: Product) => item.status === true).length || 0,
      activeOrders: summaryData.totalOrders || 0,
    };
  }, [summaryData, products]);

  /**
   * Revenue statistics from analytics API
   */
  const revenueStats = useMemo(() => {
    if (!summaryData) {
      return {
        totalRevenue: 0,
        averageOrderValue: 0,
        monthlyRevenue: 0,
      };
    }

    const averageOrderValue = summaryData.totalOrders > 0 
      ? summaryData.totalRevenue / summaryData.totalOrders 
      : 0;

    return {
      totalRevenue: summaryData.totalRevenue || 0,
      averageOrderValue,
      monthlyRevenue: summaryData.totalRevenue || 0,
    };
  }, [summaryData]);

  /**
   * Growth metrics from comparison API
   */
  const growthMetrics = useMemo(() => {
    if (!compareData) {
      return {
        userGrowth: 0,
        orderGrowth: 0,
        revenueGrowth: 0,
        viewGrowth: 0,
      };
    }

    return {
      userGrowth: compareData.changeCustomer || 0,
      orderGrowth: compareData.changeOrder || 0,
      revenueGrowth: compareData.changeRevenue || 0,
      viewGrowth: compareData.changeView || 0,
    };
  }, [compareData]);

  /**
   * Recent activities from user order API
   */
  const recentActivities = useMemo(() => {
    if (!userOrderData?.data || !Array.isArray(userOrderData.data)) {
      return [];
    }

    return userOrderData.data.slice(0, 10).map((item: UserOrderType) => ({
      type: 'order',
      title: `New order #${item.id} - $${item.total_price}`,
      timestamp: item.createdAt,
      icon: 'shopping-cart',
    }));
  }, [userOrderData]);

  /**
   * Top products from analytics
   */
  const topProducts = useMemo(() => {
    if (!summaryData?.topProducts) {
      return [];
    }

    return summaryData.topProducts.slice(0, 5);
  }, [summaryData]);

  /**
   * Revenue chart data from monthly revenue API
   */
  const revenueChartData = useMemo(() => {

    return {
      monthlyRevenues: monthlyRevenue?.monthlyRevenues,
      orders: totalUserOrder,
    }
  }, [monthlyRevenue]);

  /**
   * Order status distribution from user orders
   */
  const orderStatusDistribution = useMemo(() => {
    if (!userOrderData?.data || !Array.isArray(userOrderData.data)) {
      return [];
    }

    const statusCounts = userOrderData.data.reduce((acc: Record<string, number>, order: UserOrderType) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const total = userOrderData.data.length;
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }, [userOrderData]);

  // ===== HANDLERS =====
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  // ===== UTILITY FUNCTIONS =====
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatPercentage = (value: number): string => {
    if (!value) {
      return '0%';
    }
    
    return `${value >= 0 ? '+' : '-'}${Number(value)?.toFixed(1)}%`;
  };
  
  const getGrowthColor = (value: number): string => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };
  
  const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // ===== RETURN INTERFACE =====
  return {
    // Data
    basicStats,
    revenueStats,
    growthMetrics,
    recentActivities,
    topProducts,
    revenueChartData,
    orderStatusDistribution,
    
    // State
    selectedPeriod,
    selectedMetric,
    isLoading,
    orderFilter,
    setOrderFilter,
    
    // Handlers
    handlePeriodChange,
    handleMetricChange,
    
    // Utility functions
    formatCurrency,
    formatPercentage,
    getGrowthColor,
    getStatusBadgeColor,
    
    // Raw data for advanced usage
    summaryData,
    monthlyRevenue,
    compareData,
    userOrderData,
  };
};
