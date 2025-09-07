import { useState } from "react";
import { UserType } from "@/shared/types/user";
import { Role } from "@/shared/types";
import { useFindUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useDeleteUser } from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import usePagination from "@/shared/hooks/usePagination";

/**
 * Comprehensive hook for managing user accounts in admin panel
 * 
 * Features:
 * - User data fetching with pagination and filtering
 * - Search functionality across user fields
 * - Modal state management (Add, Edit, Delete, Permissions)
 * - Role-based filtering
 * - CRUD operations with proper error handling
 * 
 * @returns {Object} All account management functionality and state
 */
export const useAccountManagement = () => {
  // ===== PAGINATION & SEARCH STATE =====
  const { page, handlePageChange } = usePagination();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRole, setCurrentRole] = useState<Role>(Role.CUSTOMER);

  // ===== MODAL STATE MANAGEMENT =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<UserType | null>(null);

  // ===== API HOOKS =====
  const {
    data: accounts,
    isLoading,
    refetch,
    total,
  } = useFindUser({
    email: "",
    role: [currentRole],
    page: page,
    limit: page * 10,
  });

  const { mutate: deleteUser } = useDeleteUser();

  // ===== COMPUTED VALUES =====
  /**
   * Filter accounts based on search term across multiple fields
   */
  const filteredAccounts = accounts?.filter((account: UserType) =>
    account?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Calculate total pages for pagination
   */
  const totalPages = Math.ceil(total / (page * 10));

  // ===== EVENT HANDLERS =====
  /**
   * Handle editing an existing account
   * @param {UserType} account - Account to edit
   */
  const handleEdit = (account: UserType) => {
    setCurrentAccount(account);
    // Use setTimeout to ensure state is set before modal opens
    setTimeout(() => {
      setShowAddModal(true);
    }, 0);
  };

  /**
   * Handle creating a new account
   */
  const handleCreateNew = () => {
    setCurrentAccount(null);
    setShowAddModal(true);
  };

  /**
   * Handle opening delete confirmation modal
   * @param {UserType} account - Account to delete
   */
  const handleDeleteClick = (account: UserType) => {
    setCurrentAccount(account);
    setShowDeleteModal(true);
  };

  /**
   * Handle account deletion with refetch
   */
  const handleDelete = () => {
    if (currentAccount) {
      deleteUser(currentAccount.id as string);
      setShowDeleteModal(false);
      refetch();
    }
  };

  /**
   * Handle opening permissions modal
   * @param {UserType} account - Account to manage permissions for
   */
  const handlePermissions = (account: UserType) => {
    setCurrentAccount(account);
    setShowPermissionsModal(true);
  };

  /**
   * Get status badge styling based on account status
   * @param {string | boolean} status - Account status
   * @returns {string} CSS classes for status badge
   */
  const getStatusBadgeStyle = (status: string | boolean) => {
    const isActive = typeof status === 'boolean' ? status : status === 'true' || status === 'Active';
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  /**
   * Get status text based on account status
   * @param {string | boolean} status - Account status
   * @returns {string} Status text
   */
  const getStatusText = (status: string | boolean) => {
    const isActive = typeof status === 'boolean' ? status : status === 'true' || status === 'Active';
    return isActive ? "Active" : "Inactive";
  };

  /**
   * Format date for display
   * @param {string | Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  // ===== RETURN INTERFACE =====
  return {
    // Data
    accounts,
    filteredAccounts,
    total,
    totalPages,
    currentAccount,

    // Loading state
    isLoading,

    // Search & Filter state
    searchTerm,
    setSearchTerm,
    currentRole,
    setCurrentRole,

    // Modal states
    showAddModal,
    setShowAddModal,
    showDeleteModal,
    setShowDeleteModal,
    showPermissionsModal,
    setShowPermissionsModal,

    // Pagination
    page,
    handlePageChange,

    // Event handlers
    handleEdit,
    handleCreateNew,
    handleDeleteClick,
    handleDelete,
    handlePermissions,

    // Utility functions
    getStatusBadgeStyle,
    getStatusText,
    formatDate,
    refetch,
  };
};
