import { Product, ProductCategory } from "@/shared/types/product";
import { Edit, Plus, Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import Pagination from "@/components/admin/pagination";
import SearchComponent from "@/components/admin/ui/Search";
import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useProductManagement } from "./hooks/useProductManagement";
import { AddProductModal } from "./modals/AddProduct";



const AdminProduct: React.FC<AuthProps> = () => {
  const {
    isLoading,
    filteredProducts,
    totalPages,
    total,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete,
    showAddModal,
    setShowAddModal,
    showDeleteModal,
    setShowDeleteModal,
    currentProduct,
    setCurrentProduct,
    page,
    handlePageChange,
    handleRefresh,
  } = useProductManagement();
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            setCurrentProduct(() => null);
            setShowAddModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search products..."
          />
        </div>
      </div>
      <IsLoadingWrapper isLoading={isLoading}>
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts?.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.images[0]}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product?.productCategories
                          ?.map(
                            (category: ProductCategory) => category.categoryDetails.name
                          )
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === true
                            ? "bg-green-100 text-green-800"
                            : product.status === false
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentProduct(product);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </IsLoadingWrapper>

      <Pagination
        filteredProducts={filteredProducts}
        setPage={handlePageChange}
        page={page}
        totalItems={total}
        totalPages={totalPages}
      />

      <AddProductModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        handleRefresh={handleRefresh}
        currentProduct={currentProduct || undefined}
      />
      <DeleteConfirmModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
};

const WAdminProduct = isLoginAdminAuth(AdminProduct);

export default WAdminProduct;
