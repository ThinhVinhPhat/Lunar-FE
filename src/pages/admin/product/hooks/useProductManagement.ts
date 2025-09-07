import { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/shared/types/product";
import { useProductAction } from "@/shared/hooks/useProductAction";
import { useDeleteProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";
import usePagination from "@/shared/hooks/usePagination";
import { formatDate } from "@/lib/ultis/formatDate";

/**
 * Comprehensive hook for managing product administration
 * 
 * Features:
 * - Product listing with pagination
 * - Search and filtering functionality
 * - CRUD operations (Create, Read, Update, Delete)
 * - Modal state management
 * - Product statistics and analytics
 * - Category-based filtering
 * - Status management
 * - Bulk operations support
 * 
 * @returns {Object} All product management functionality and computed data
 */
export const useProductManagement = () => {
  // ===== STATE MANAGEMENT =====
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // ===== MODAL STATE MANAGEMENT =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // ===== PAGINATION =====
  const { page, handlePageChange } = usePagination();
  const itemsPerPage = 10;

  // ===== API HOOKS =====
  const { products, isLoading, refetch, total } = useProductAction(page, itemsPerPage);
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // ===== COMPUTED DATA =====
  /**
   * Filter and search products
   */
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCategories.some((category: ProductCategory) =>
          category.categoryDetails.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      // Category filter
      const matchesCategory = filterCategory === "all" || 
        product.productCategories.some((category: ProductCategory) => 
          category.categoryDetails.name.toLowerCase() === filterCategory.toLowerCase()
        );

      // Status filter
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "active" && product.status) ||
        (filterStatus === "inactive" && !product.status);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  /**
   * Sort filtered products
   */
  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    return [...filteredProducts].sort((a: Product, b: Product) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "stock":
          aValue = a.stock;
          bValue = b.stock;
          break;
        case "views":
          aValue = a.views;
          bValue = b.views;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredProducts, sortBy, sortOrder]);

  /**
   * Paginate sorted products
   */
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, page, itemsPerPage]);

  /**
   * Calculate product statistics
   */
  const productStats = useMemo(() => {
    if (!products) return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      lowStockProducts: 0,
      totalValue: 0,
      averagePrice: 0,
      totalViews: 0
    };

    const totalProducts = products.length;
    const activeProducts = products.filter((product: Product) => product.status).length;
    const inactiveProducts = totalProducts - activeProducts;
    const lowStockProducts = products.filter((product: Product) => product.stock < 10).length;
    
    const totalValue = products.reduce((sum: number, product: Product) => 
      sum + (parseFloat(product.price) * product.stock), 0
    );
    const averagePrice = totalProducts > 0 ? 
      products.reduce((sum: number, product: Product) => sum + parseFloat(product.price), 0) / totalProducts : 0;
    const totalViews = products.reduce((sum: number, product: Product) => sum + product.views, 0);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      totalValue,
      averagePrice,
      totalViews
    };
  }, [products]);

  /**
   * Get unique categories from products
   */
  const availableCategories = useMemo(() => {
    if (!products) return [];
    
    const categories = new Set<string>();
    products.forEach((product: Product) => {
      product.productCategories.forEach((category: ProductCategory) => {
        categories.add(category.categoryDetails.name);
      });
    });
    
    return Array.from(categories);
  }, [products]);

  // ===== UTILITY FUNCTIONS =====

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    await refetch();
  };

  /**
   * Format currency value
   * @param {number} value - Value to format
   * @returns {string} Formatted currency
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  /**
   * Get product status badge color
   * @param {Product} product - Product object
   * @returns {string} CSS classes for status badge
   */
  const getProductStatusBadgeColor = (product: Product) => {
    return product.status 
      ? "bg-green-100 text-green-600" 
      : "bg-red-100 text-red-600";
  };

  /**
   * Get product status text
   * @param {Product} product - Product object
   * @returns {string} Status text
   */
  const getProductStatusText = (product: Product) => {
    return product.status ? "Active" : "Inactive";
  };

  /**
   * Get stock status color
   * @param {number} stock - Stock quantity
   * @returns {string} CSS classes for stock status
   */
  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "text-red-600";
    if (stock < 10) return "text-yellow-600";
    return "text-green-600";
  };

  /**
   * Get product categories as string
   * @param {Product} product - Product object
   * @returns {string} Categories joined by comma
   */
  const getProductCategories = (product: Product) => {
    return product.productCategories
      .map((category: ProductCategory) => category.categoryDetails.name)
      .join(", ");
  };

  /**
   * Check if product is selected
   * @param {string} productId - Product ID
   * @returns {boolean} Whether product is selected
   */
  const isProductSelected = (productId: string) => {
    return selectedProducts.includes(productId);
  };

  // ===== EVENT HANDLERS =====
  /**
   * Handle search term change
   * @param {string} term - New search term
   */
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    handlePageChange(1); // Reset to first page
  };

  /**
   * Handle category filter change
   * @param {string} category - New category filter
   */
  const handleCategoryFilterChange = (category: string) => {
    setFilterCategory(category);
    handlePageChange(1); // Reset to first page
  };

  /**
   * Handle status filter change
   * @param {string} status - New status filter
   */
  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    handlePageChange(1); // Reset to first page
  };

  /**
   * Handle sort change
   * @param {string} field - Field to sort by
   */
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  /**
   * Handle creating a new product
   */
  const handleCreateNew = () => {
    setCurrentProduct(null);
    setShowAddModal(true);
  };

  /**
   * Handle editing an existing product
   * @param {Product} product - Product to edit
   */
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowAddModal(true);
  };

  /**
   * Handle opening delete confirmation modal
   * @param {Product} product - Product to delete
   */
  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  /**
   * Handle product deletion
   */
  const handleDelete = async () => {
    if (!currentProduct) return;
    
    try {
      const response = await deleteProduct(currentProduct.id);
      if (response.status === 200) {
        setShowDeleteModal(false);
        setCurrentProduct(null);
        handleRefresh();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  /**
   * Handle product selection for bulk operations
   * @param {string} productId - Product ID to toggle
   */
  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  /**
   * Handle select all products
   */
  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((product: Product) => product.id));
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    if (selectedProducts.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  /**
   * Confirm bulk delete
   */
  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedProducts.map(productId => deleteProduct(productId))
      );
      setShowBulkDeleteModal(false);
      setSelectedProducts([]);
      refetch();
    } catch (error) {
      console.error("Error bulk deleting products:", error);
    }
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setShowBulkDeleteModal(false);
    setCurrentProduct(null);
  };

  /**
   * Handle successful product save
   */
  const handleProductSave = () => {
    setShowAddModal(false);
    setCurrentProduct(null);
    refetch();
  };

  // ===== COMPUTED VALUES =====
  const totalItems = searchTerm === "" ? total : filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasSelectedProducts = selectedProducts.length > 0;
  const isAllSelected = selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0;

  // ===== RETURN INTERFACE =====
  return {
    // Data
    products: paginatedProducts,
    filteredProducts,
    sortedProducts,
    productStats,
    availableCategories,
    total,
    
    // Pagination
    page,
    totalPages,
    totalItems,
    itemsPerPage,
    
    // Loading states
    isLoading,
    isDeleting,
    
    // Filter and search state
    searchTerm,
    filterCategory,
    filterStatus,
    sortBy,
    sortOrder,
    
    // Modal state
    showAddModal,
    showDeleteModal,
    showBulkDeleteModal,
    currentProduct,
    setShowAddModal,
    setShowDeleteModal,
    setShowBulkDeleteModal,
    
    // Selection state
    selectedProducts,
    hasSelectedProducts,
    isAllSelected,
    setSearchTerm,
    setCurrentProduct,

    // Event handlers
    handleSearchChange,
    handleCategoryFilterChange,
    handleStatusFilterChange,
    handleSortChange,
    handlePageChange,
    handleCreateNew,
    handleEdit,
    handleDeleteClick,
    handleDelete,
    handleProductSelect,
    handleSelectAll,
    handleBulkDelete,
    confirmBulkDelete,
    handleModalClose,
    handleProductSave,
    handleRefresh,
    
    // Utility functions
    formatCurrency,
    getProductStatusBadgeColor,
    getProductStatusText,
    getStockStatusColor,
    getProductCategories,
    isProductSelected,
    formatDate,
  };
};
