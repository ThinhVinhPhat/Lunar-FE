import { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/shared/types/product";
import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { useProductAction } from "@/shared/hooks/useProductAction";
import { useDeleteProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";
import { useDeleteProductVariant } from "@/lib/hooks/queryClient/mutator/product-variant/product-variant.mutator";
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
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentVariant, setCurrentVariant] = useState<ProductVariantResponse | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // ===== PAGINATION =====
  const { page, handlePageChange } = usePagination();
  const itemsPerPage = 10;

  // ===== API HOOKS =====
  const { products, isLoading, refetch, total } = useProductAction(page, itemsPerPage);
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutateAsync: deleteVariant, isPending: isDeletingVariant } = useDeleteProductVariant();

  // ===== COMPUTED DATA =====
  /**
   * Filter and search products
   */
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      // Search filter
      const matchesSearch = 
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.variants?.some(variant => 
          variant.productCategories?.some((category: ProductCategory) =>
            category?.categoryDetail?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) || false;

      // Category filter
      const matchesCategory = filterCategory === "all" || 
        product?.variants?.some(variant => 
          variant.productCategories?.some((category: ProductCategory) => 
            category?.categoryDetail?.name?.toLowerCase() === filterCategory.toLowerCase()
          )
        ) || false;

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
          aValue = a?.name?.toLowerCase();
          bValue = b?.name?.toLowerCase();
          break;
        case "price":
          // Get minimum price from variants
          aValue = Math.min(...(a?.variants?.map(v => Number(v.price)) || [0]));
          bValue = Math.min(...(b.variants?.map(v => Number(v.price)) || [0]));
          break;
        case "stock":
          // Get total stock from all variants
          aValue = a.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
          bValue = b.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
          break;
        case "variants":
          aValue = a.variants?.length || 0;
          bValue = b.variants?.length || 0;
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
      totalVariants: 0
    };

    const totalProducts = products.length;
    const activeProducts = products.filter((product: Product) => product.status).length;
    const inactiveProducts = totalProducts - activeProducts;
    const lowStockProducts = products.filter((product: Product) => {
      const totalStock = (product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0);
      return totalStock < 10;
    }).length;
    
    const totalValue = products.reduce((sum: number, product: Product) => {
      const productValue = product.variants?.reduce((variantSum, variant) => 
        variantSum + (Number(variant.price) * variant.stock), 0
      ) || 0;
      return sum + productValue;
    }, 0);
    
    const allVariants = products.flatMap(product => product.variants || []);
    const averagePrice = allVariants.length > 0 ? 
      allVariants.reduce((sum, variant) => sum + Number(variant.price), 0) / allVariants.length : 0;
    
    // Remove totalViews as it's not available in the new structure
    const totalVariants = allVariants.length;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      totalValue,
      averagePrice,
      totalVariants
    };
  }, [products]);

  /**
   * Get unique categories from products
   */
  const availableCategories = useMemo(() => {
    if (!products) return [];
    
    const categories = new Set<string>();
    products.forEach((product: Product) => {
      const variants = product.variants || [];
      variants.forEach(variant => {
        variant.productCategories?.forEach((category: ProductCategory) => {
          categories.add(category.categoryDetail.name);
        });
      });
    });
    
    return Array.from(categories);
  }, [products]);

  // ===== UTILITY FUNCTIONS =====

  /**
   * Get all variants from a product
   * @param {Product} product - Product object
   * @returns {ProductVariantResponse[]} Array of variants
   */
  const getProductVariants = (product: Product): ProductVariantResponse[] => {
    return product.variants || [];
  };

  /**
   * Get minimum price from product variants
   * @param {Product} product - Product object
   * @returns {number} Minimum price
   */
  const getProductMinPrice = (product: Product): number => {
    const variants = product.variants || [];
    if (variants.length === 0) return 0;
    return Math.min(...variants.map(v => Number(v.price)));
  };

  /**
   * Get maximum price from product variants
   * @param {Product} product - Product object
   * @returns {number} Maximum price
   */
  const getProductMaxPrice = (product: Product): number => {
    const variants = product.variants || [];
    if (variants.length === 0) return 0;
    return Math.max(...variants.map(v => Number(v.price)));
  };

  /**
   * Get total stock from all product variants
   * @param {Product} product - Product object
   * @returns {number} Total stock
   */
  const getProductTotalStock = (product: Product): number => {
    const variants = product.variants || [];
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

  /**
   * Get total value (price * stock) from all product variants
   * @param {Product} product - Product object
   * @returns {number} Total value
   */
  const getProductTotalValue = (product: Product): number => {
    const variants = product.variants || [];
    return variants.reduce((sum, variant) => sum + (Number(variant.price) * variant.stock), 0);
  };

  /**
   * Check if product has low stock (total stock < 10)
   * @param {Product} product - Product object
   * @returns {boolean} Whether product has low stock
   */
  const hasLowStock = (product: Product): boolean => {
    const totalStock = (product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0);
    return totalStock < 10;
  };

  /**
   * Get unique categories from product variants
   * @param {Product} product - Product object
   * @returns {string[]} Array of unique category names
   */
  const getProductUniqueCategories = (product: Product): string[] => {
    const allCategories = new Set<string>();
    const variants = product.variants || [];
    
    variants.forEach(variant => {
      variant.productCategories?.forEach((category: ProductCategory) => {
        allCategories.add(category.categoryDetail.name);
      });
    });
    
    return Array.from(allCategories);
  };

  /**
   * Get price display string for product (range if multiple prices)
   * @param {Product} product - Product object
   * @returns {string} Price display string
   */
  const getProductPriceDisplay = (product: Product): string => {
    const variants = product.variants || [];
    if (variants.length === 0) return "No variants";
    
    const prices = variants.map(v => Number(v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) return formatCurrency(minPrice);
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  };

  /**
   * Get stock status text for product
   * @param {Product} product - Product object
   * @returns {string} Stock status text
   */
  const getProductStockStatus = (product: Product): string => {
    const totalStock = (product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0);
    if (totalStock === 0) return "Out of stock";
    if (totalStock < 10) return `Low stock (${totalStock})`;
    return `In stock (${totalStock})`;
  };

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
    const allCategories = new Set<string>();
    const variants = product.variants || [];
    
    variants.forEach(variant => {
      variant.productCategories?.forEach((category: ProductCategory) => {
        allCategories.add(category.categoryDetail.name);
      });
    });
    
    return Array.from(allCategories).join(", ");
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
   * Handle opening variant delete confirmation modal
   * @param {ProductVariantResponse} variant - Variant to delete
   */
  const handleDeleteVariantClick = (variant: ProductVariantResponse) => {
    setCurrentVariant(variant);
    setShowDeleteVariantModal(true);
  };

  /**
   * Handle variant deletion
   */
  const handleDeleteVariant = async () => {
    if (!currentVariant) return;
    
    try {
      await deleteVariant(currentVariant.id);
      setShowDeleteVariantModal(false);
      setCurrentVariant(null);
      handleRefresh();
    } catch (error) {
      console.error("Error deleting variant:", error);
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
    setShowDeleteVariantModal(false);
    setCurrentProduct(null);
    setCurrentVariant(null);
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
    isDeletingVariant,
    
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
    showDeleteVariantModal,
    currentProduct,
    currentVariant,
    setShowAddModal,
    setShowDeleteModal,
    setShowBulkDeleteModal,
    setShowDeleteVariantModal,
    setCurrentVariant,
    
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
    handleDeleteVariantClick,
    handleDeleteVariant,
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
    
    // Variant helper functions
    getProductVariants,
    getProductMinPrice,
    getProductMaxPrice,
    getProductTotalStock,
    getProductTotalValue,
    hasLowStock,
    getProductUniqueCategories,
    getProductPriceDisplay,
    getProductStockStatus,
  };
};
