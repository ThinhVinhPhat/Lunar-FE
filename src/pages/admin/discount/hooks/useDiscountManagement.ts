import { useState } from "react";
import {
  DiscountInterface,
  DiscountProductInterface,
  DiscountValueType,
} from "@/shared/types/discount";
import { useGetAllDiscounts } from "@/lib/hooks/queryClient/query/discount/discount.query";
import { useDeleteDiscount } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import usePagination from "@/shared/hooks/usePagination";
import { formatDate } from "@/lib/ultis/formatDate";

/**
 * Comprehensive hook for managing discounts and discount products in admin panel
 * 
 * Features:
 * - Discount data fetching with pagination and filtering
 * - Search functionality across discount names and product names
 * - Modal state management (Add Discount, Add Product, Delete)
 * - CRUD operations for both discounts and discount products
 * - Status calculation and styling utilities
 * - Proper error handling and loading states
 * 
 * @returns {Object} All discount management functionality and state
 */
export const useDiscountManagement = () => {
  // ===== PAGINATION & SEARCH STATE =====
  const { page, handlePageChange } = usePagination();
  const [searchTerm, setSearchTerm] = useState("");

  // ===== MODAL STATE MANAGEMENT =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<DiscountInterface | null>(null);
  const [currentDiscountProduct, setCurrentDiscountProduct] = useState<DiscountProductInterface | null>(null);

  // ===== API HOOKS =====
  const {
    data: discounts,
    total: totalItems,
    isLoading,
    refetch,
  } = useGetAllDiscounts(page, 10, "All Discount", searchTerm);

  const { mutateAsync: deleteDiscount } = useDeleteDiscount();
  const { mutateAsync: deleteDiscountProduct } = useDeleteDiscount();

  // ===== COMPUTED VALUES =====
  /**
   * Filter discounts based on search term across discount and product names
   */
  const filteredDiscounts = discounts?.filter((discount: DiscountInterface) =>
    discount?.discountProduct?.some((item: DiscountProductInterface) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || discount.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Calculate total items and pages for pagination
   */
  const totalDiscounts = searchTerm === "" ? discounts?.length || 0 : filteredDiscounts?.length || 0;
  const totalPages = Math.ceil(totalDiscounts / 10);

  // ===== DISCOUNT STATUS UTILITIES =====
  /**
   * Get discount badge color based on status and dates
   * @param {DiscountInterface} discount - Discount object
   * @returns {string} CSS classes for discount badge
   */
  const getDiscountBadgeColor = (discount: DiscountInterface) => {
    if (!discount.isActive) return "bg-gray-100 text-gray-600";
    const now = new Date();
    const startDate = new Date(discount.startAt);
    const endDate = new Date(discount.expireAt);

    if (now < startDate) return "bg-blue-100 text-blue-600";
    if (now > endDate) return "bg-red-100 text-red-600";
    return "bg-green-100 text-green-600";
  };

  /**
   * Get discount status text
   * @param {DiscountInterface} discount - Discount object
   * @returns {string} Status text
   */
  const getDiscountStatus = (discount: DiscountInterface) => {
    if (!discount.isActive) return "Inactive";
    const now = new Date();
    const startDate = new Date(discount.startAt);
    const endDate = new Date(discount.expireAt);

    if (now.getTime() < startDate.getTime()) return "Scheduled";
    if (now.getTime() > endDate.getTime()) return "Expired";
    return "Active";
  };

  /**
   * Format discount value with proper symbol
   * @param {DiscountInterface} discount - Discount object
   * @returns {string} Formatted discount value
   */
  const formatDiscountValue = (discount: DiscountInterface) => {
    return discount.valueType === DiscountValueType.PERCENTAGE
      ? `${discount.value}%`
      : `$${discount.value}`;
  };

  /**
   * Get usage statistics for a discount
   * @param {DiscountInterface} discount - Discount object
   * @returns {Object} Usage statistics
   */
  const getUsageStats = (discount: DiscountInterface) => {
    const used = discount.userDiscounts?.length || 0;
    const limit = discount.usageLimit;
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    
    return {
      used,
      limit,
      percentage,
      remaining: Math.max(0, limit - used),
    };
  };

  // ===== EVENT HANDLERS =====
  /**
   * Handle creating a new discount
   */
  const handleCreateNewDiscount = () => {
    setCurrentDiscount(null);
    setShowAddModal(true);
  };

  /**
   * Handle editing an existing discount
   * @param {DiscountInterface} discount - Discount to edit
   */
  const handleEditDiscount = (discount: DiscountInterface) => {
    setCurrentDiscount(discount);
    setShowAddModal(true);
  };

  /**
   * Handle editing a discount product
   * @param {DiscountProductInterface} discountProduct - Discount product to edit
   */
  const handleEditProduct = (discountProduct: DiscountProductInterface) => {
    setCurrentDiscountProduct(discountProduct);
    setShowAddProductModal(true);
  };

  /**
   * Handle creating a new discount product
   * @param {DiscountInterface} discount - Parent discount
   */
  const handleCreateNewProduct = (discount: DiscountInterface) => {
    setCurrentDiscountProduct(null);
    setCurrentDiscount(discount);
    setShowAddProductModal(true);
  };

  /**
   * Handle opening delete confirmation modal for discount
   * @param {DiscountInterface} discount - Discount to delete
   */
  const handleDeleteDiscountClick = (discount: DiscountInterface) => {
    setCurrentDiscount(discount);
    setCurrentDiscountProduct(null);
    setShowDeleteModal(true);
  };

  /**
   * Handle opening delete confirmation modal for discount product
   * @param {DiscountProductInterface} discountProduct - Discount product to delete
   */
  const handleDeleteProductClick = (discountProduct: DiscountProductInterface) => {
    setCurrentDiscountProduct(discountProduct);
    setCurrentDiscount(null);
    setShowDeleteModal(true);
  };

  /**
   * Handle discount deletion with refetch
   */
  const handleDeleteDiscount = async () => {
    if (currentDiscount) {
      await deleteDiscount(currentDiscount.id);
      setShowDeleteModal(false);
      setCurrentDiscount(null);
      refetch();
    }
  };

  /**
   * Handle discount product deletion with refetch
   */
  const handleDeleteDiscountProduct = async () => {
    if (currentDiscountProduct) {
      await deleteDiscountProduct(currentDiscountProduct.product.id);
      setShowDeleteModal(false);
      setCurrentDiscountProduct(null);
      refetch();
    }
  };

  /**
   * Handle unified delete operation (discount or product based on current state)
   */
  const handleDelete = async () => {
    if (currentDiscount) {
      await handleDeleteDiscount();
    } else if (currentDiscountProduct) {
      await handleDeleteDiscountProduct();
    }
  };

  /**
   * Get product count for a discount
   * @param {DiscountInterface} discount - Discount object
   * @returns {number} Number of products in discount
   */
  const getProductCount = (discount: DiscountInterface) => {
    return discount.discountProduct?.length || 0;
  };

  /**
   * Check if discount is currently active
   * @param {DiscountInterface} discount - Discount object
   * @returns {boolean} Whether discount is currently active
   */
  const isDiscountActive = (discount: DiscountInterface) => {
    if (!discount.isActive) return false;
    const now = new Date();
    const startDate = new Date(discount.startAt);
    const endDate = new Date(discount.expireAt);
    return now >= startDate && now <= endDate;
  };

  /**
   * Get recent users who used the discount
   * @param {DiscountInterface} discount - Discount object
   * @param {number} limit - Maximum number of users to return
   * @returns {any[]} Recent users
   */
  const getRecentUsers = (discount: DiscountInterface, limit: number = 5) => {
    return discount.userDiscounts?.slice(0, limit) || [];
  };

  // ===== RETURN INTERFACE =====
  return {
    // Data
    discounts,
    filteredDiscounts,
    totalItems,
    totalPages,
    totalDiscounts,
    currentDiscount,
    currentDiscountProduct,

    // Loading state
    isLoading,

    // Search state
    searchTerm,
    setSearchTerm,

    // Modal states
    showAddModal,
    setShowAddModal,
    showDeleteModal,
    setShowDeleteModal,
    showAddProductModal,
    setShowAddProductModal,

    // Pagination
    page,
    handlePageChange,

    // Event handlers
    handleCreateNewDiscount,
    handleEditDiscount,
    handleEditProduct,
    handleCreateNewProduct,
    handleDeleteDiscountClick,
    handleDeleteProductClick,
    handleDelete,

    // Utility functions
    getDiscountBadgeColor,
    getDiscountStatus,
    formatDiscountValue,
    getUsageStats,
    getProductCount,
    isDiscountActive,
    getRecentUsers,
    formatDate,
    refetch,
  };
};
