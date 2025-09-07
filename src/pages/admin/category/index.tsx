import React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddCategoryModal from "./modals/AddCategory";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import SearchComponent from "@/components/admin/ui/Search";
import { Category, CategoryDetail } from "@/shared/types/category";
import Pagination from "@/components/admin/pagination";
import AddCategoryDetail from "./modals/AddCategoryDetail";
import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useCategoryManagement } from "./hooks/useCategoryManagement";

const AdminCategory: React.FC<AuthProps> = () => {
  const {
    // Data
    filteredCategories,
    total,
    totalPages,
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
    // formatDate,
    // getCategoryStatusStyle,
    // getCategoryStatusText,
    // getDetailCount,
  } = useCategoryManagement();

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <button
            onClick={handleCreateNewCategory}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </button>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search categories..."
          />
        </div>
        <div className="space-y-8 mb-6">
          {filteredCategories.map((category: Category) => (
            <>
              <div
                key={category.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {category.description}
                      </p>

                      <button
                        onClick={() => handleDeleteCategoryClick(category)}
                        className="p-1 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Category Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.categoryDetails &&
                      category.categoryDetails.map((detail: CategoryDetail) => (
                        <div
                          key={detail.id}
                          className="border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {detail.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {detail.description}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditDetail(detail)}
                                className="p-1 rounded-md hover:bg-gray-100 text-blue-600"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteDetailClick(detail)}
                                className="p-1 rounded-md hover:bg-gray-100 text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Created: {detail.createdAt || category.createdAt}
                          </div>
                        </div>
                      ))}

                    <div className="border border-dashed border-gray-300 rounded-md p-3 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                      <button
                        onClick={() => handleCreateNewDetail(category)}
                        className="text-[#C8A846] flex items-center"
                      >
                        <Plus size={16} className="mr-1" />
                        <span>Add Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>

        <Pagination
          filteredProducts={filteredCategories}
          setPage={handlePageChange}
          page={page}
          totalItems={total}
          totalPages={totalPages}
        />

        <AddCategoryModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
        <AddCategoryDetail
          showAddModal={showAddDetailModal}
          setShowAddModal={setShowAddDetailModal}
          currentCategoryDetail={currentCategoryDetail}
          currentCategory={currentCategory}
        />
        <DeleteConfirmModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          onDelete={handleDelete}
        />
      </>
    </IsLoadingWrapper>
  );
};

const WAdminCategory = isLoginAdminAuth(AdminCategory);

export default WAdminCategory;
