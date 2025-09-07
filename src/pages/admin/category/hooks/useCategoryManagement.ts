import { useState } from "react";
import { Category, CategoryDetail } from "@/shared/types/category";
import { useGetCategories } from "@/lib/hooks/queryClient/query/category/category.query";
import { useDeleteCategory } from "@/lib/hooks/queryClient/mutator/category/category.mutator";
import { useDeleteDetail } from "@/lib/hooks/queryClient/mutator/category/categoryDetail/categoryDetail.mutator";
import usePagination from "@/shared/hooks/usePagination";

/**
 * Comprehensive hook for managing categories and category details in admin panel
 * 
 * Features:
 * - Category and category detail data fetching with pagination
 * - Search functionality across category and detail names
 * - Modal state management (Add Category, Add Detail, Delete)
 * - CRUD operations for both categories and category details
 * - Proper error handling and loading states
 * 
 * @returns {Object} All category management functionality and state
 */
export const useCategoryManagement = () => {
  // ===== PAGINATION & SEARCH STATE =====
  const { page, handlePageChange } = usePagination();
  const [searchTerm, setSearchTerm] = useState("");

  // ===== MODAL STATE MANAGEMENT =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentCategoryDetail, setCurrentCategoryDetail] = useState<CategoryDetail | null>(null);

  // ===== API HOOKS =====
  const {
    data: categories,
    total,
    isLoading,
    refetch,
  } = useGetCategories(searchTerm, 10, page);

  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: deleteDetail } = useDeleteDetail();

  // ===== COMPUTED VALUES =====
  /**
   * Filter categories based on search term across category and detail names
   */
  const filteredCategories = categories?.filter((category: Category) =>
    category?.categoryDetails?.some((item: CategoryDetail) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Calculate total items and pages for pagination
   */
  const totalProducts = searchTerm === "" ? categories?.length || 0 : filteredCategories?.length || 0;
  const totalPages = Math.ceil(totalProducts / 10);

  // ===== EVENT HANDLERS =====
  /**
   * Handle creating a new category
   */
  const handleCreateNewCategory = () => {
    setCurrentCategory(null);
    setShowAddModal(true);
  };

  /**
   * Handle editing an existing category detail
   * @param {CategoryDetail} categoryDetail - Category detail to edit
   */
  const handleEditDetail = (categoryDetail: CategoryDetail) => {
    setCurrentCategoryDetail(categoryDetail);
    setShowAddDetailModal(true);
  };

  /**
   * Handle creating a new category detail
   * @param {Category} category - Parent category for the new detail
   */
  const handleCreateNewDetail = (category: Category) => {
    setCurrentCategoryDetail(null);
    setCurrentCategory(category);
    setShowAddDetailModal(true);
  };

  /**
   * Handle opening delete confirmation modal for category
   * @param {Category} category - Category to delete
   */
  const handleDeleteCategoryClick = (category: Category) => {
    setCurrentCategory(category);
    setCurrentCategoryDetail(null);
    setShowDeleteModal(true);
  };

  /**
   * Handle opening delete confirmation modal for category detail
   * @param {CategoryDetail} categoryDetail - Category detail to delete
   */
  const handleDeleteDetailClick = (categoryDetail: CategoryDetail) => {
    setCurrentCategoryDetail(categoryDetail);
    setCurrentCategory(null);
    setShowDeleteModal(true);
  };

  /**
   * Handle category deletion with refetch
   */
  const handleDeleteCategory = async () => {
    if (currentCategory) {
      await deleteCategory(currentCategory.id);
      setShowDeleteModal(false);
      setCurrentCategory(null);
      refetch();
    }
  };

  /**
   * Handle category detail deletion with refetch
   */
  const handleDeleteCategoryDetail = async () => {
    if (currentCategoryDetail) {
      await deleteDetail(currentCategoryDetail.id);
      setShowDeleteModal(false);
      setCurrentCategoryDetail(null);
      refetch();
    }
  };

  /**
   * Handle unified delete operation (category or detail based on current state)
   */
  const handleDelete = async () => {
    if (currentCategory) {
      await handleDeleteCategory();
    } else if (currentCategoryDetail) {
      await handleDeleteCategoryDetail();
    }
  };

  /**
   * Format date for display
   * @param {string | Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  /**
   * Get category status styling
   * @param {Category} category - Category object
   * @returns {string} CSS classes for category status
   */
  const getCategoryStatusStyle = (category: Category) => {
    const hasDetails = category.categoryDetails && category.categoryDetails.length > 0;
    return hasDetails
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  /**
   * Get category status text
   * @param {Category} category - Category object
   * @returns {string} Status text
   */
  const getCategoryStatusText = (category: Category) => {
    const hasDetails = category.categoryDetails && category.categoryDetails.length > 0;
    return hasDetails ? "Active" : "No Details";
  };

  /**
   * Get detail count for a category
   * @param {Category} category - Category object
   * @returns {number} Number of details in category
   */
  const getDetailCount = (category: Category) => {
    return category.categoryDetails?.length || 0;
  };

  // ===== RETURN INTERFACE =====
  return {
    // Data
    categories,
    filteredCategories,
    total,
    totalPages,
    totalProducts,
    currentCategory,
    currentCategoryDetail,

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
    showAddDetailModal,
    setShowAddDetailModal,

    // Pagination
    page,
    handlePageChange,

    // Event handlers
    handleCreateNewCategory,
    handleEditDetail,
    handleCreateNewDetail,
    handleDeleteCategoryClick,
    handleDeleteDetailClick,
    handleDelete,

    // Utility functions
    formatDate,
    getCategoryStatusStyle,
    getCategoryStatusText,
    getDetailCount,
    refetch,
  };
};
