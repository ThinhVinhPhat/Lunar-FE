import { Product } from "@/shared/types/product";
import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { Edit, Plus, Trash2, Package, Palette, Eye, EyeOff } from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import Pagination from "@/components/admin/pagination";
import SearchComponent from "@/components/admin/ui/Search";
import { AuthProps, isLoginAdminAuth } from "@/shared/components/wrapper/withAuth";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useProductManagement } from "./hooks/useProductManagement";
import { AddProductModal } from "./modals/AddProduct";
import { AddVariantModal } from "./modals/AddVariant";
import { useState } from "react";
import { formatGlassesSize } from "@/lib/ultis/parseGlassesSize";



const AdminProduct: React.FC<AuthProps> = () => {
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariantResponse | undefined>();
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | undefined>();
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  
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
    showDeleteVariantModal,
    setShowDeleteVariantModal,
    currentProduct,
    setCurrentProduct,
    handleDeleteVariant,
    page,
    handlePageChange,
    handleRefresh,
    handleDeleteVariantClick,
  } = useProductManagement();
  

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const handleAddVariant = (product: Product) => {
    setSelectedProductForVariant(product);
    setCurrentVariant(undefined);
    setShowAddVariantModal(true);
  };

  const handleEditVariant = (variant: ProductVariantResponse) => {
    setCurrentVariant(variant);
    setSelectedProductForVariant(undefined);
    setShowAddVariantModal(true);
  };


  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products & Variants</h1>
          <p className="text-gray-600">Manage your product inventory and variants</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => {
              setCurrentProduct(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
          >
            <Package size={16} className="mr-2" />
            Add Product
          </button>
          <button
            onClick={() => {
              setSelectedProductForVariant(undefined);
              setCurrentVariant(undefined);
              setShowAddVariantModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Palette size={16} className="mr-2" />
            Add Variant
          </button>
        </div>
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
        <div className="space-y-4">
          {filteredProducts?.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-22 flex-shrink-0">
                      <img
                        className="h-16 w-22 rounded-lg object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status ? "Active" : "Inactive"}
                        </span>
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            New
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        <span>ID: {product.id.slice(0, 8)}...</span>
                        <span>Variants: {product.variants?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleProductExpansion(product.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={expandedProducts.has(product.id) ? "Hide variants" : "Show variants"}
                    >
                      {expandedProducts.has(product.id) ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={() => handleAddVariant(product)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Add variant"
                    >
                      <Palette size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                      title="Edit product"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentProduct(product);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              {expandedProducts.has(product.id) && (
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Product Variants ({product.variants?.length || 0})
                    </h4>
                    <button
                      onClick={() => handleAddVariant(product)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Variant
                    </button>
                  </div>
                  
                  {product.variants && product.variants.length > 0 ? (
                    <div className="grid gap-3">
                      {product.variants.map((variant: ProductVariantResponse) => (
                        <div
                          key={variant.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-18 flex-shrink-0">
                                <img
                                  className="h-12 w-18 rounded-md object-cover"
                                  src={variant.images[0] || product.images[0]}
                                  alt={`${variant.color} variant`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                  />
                                  <span className="font-medium text-gray-900 capitalize">
                                    {variant.color}
                                  </span>
                                  {variant.size && (
                                    <span className="text-sm text-gray-500">
                                      Size: {formatGlassesSize(variant.size)}
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      variant.status
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {variant.status ? "Active" : "Inactive"}
                                  </span>
                                  {variant.isNew && (
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                  <span>ID: {variant.id.slice(0, 8)}...</span>
                                  <span className="font-medium text-gray-900">
                                    ${variant.discount_percentage > 0 ? (
                                      <>
                                        <span className="text-red-600">
                                          ${(variant.price * (1 - variant.discount_percentage / 100)).toFixed(2)}
                                        </span>
                                        <span className="line-through ml-1">${variant.price}</span>
                                        <span className="text-red-600 ml-1">(-{variant.discount_percentage}%)</span>
                                      </>
                                    ) : (
                                      `${variant.price}`
                                    )}
                                  </span>
                                  <span className={variant.stock > 0 ? "text-green-600" : "text-red-600"}>
                                    Stock: {variant.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditVariant(variant)}
                                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                                title="Edit variant"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteVariantClick(variant)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete variant"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Palette size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No variants yet</p>
                      <p className="text-sm mb-4">Create variants to manage different colors, sizes, and pricing</p>
                      <button
                        onClick={() => handleAddVariant(product)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} className="mr-2" />
                        Add First Variant
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {(!filteredProducts || filteredProducts.length === 0) && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first product</p>
              <button
                onClick={() => {
                  setCurrentProduct(null);
                  setShowAddModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Product
              </button>
            </div>
          )}
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
      
      <AddVariantModal
        showAddVariantModal={showAddVariantModal}
        setShowAddVariantModal={setShowAddVariantModal}
        currentVariant={currentVariant}
        selectedProduct={selectedProductForVariant}
        handleRefresh={handleRefresh}
      />
      
      <DeleteConfirmModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onDelete={handleDelete}
      />
      
      <DeleteConfirmModal
        showDeleteModal={showDeleteVariantModal}
        setShowDeleteModal={setShowDeleteVariantModal}
        onDelete={handleDeleteVariant}
      />
    </>
  );
};

const WAdminProduct = isLoginAdminAuth(AdminProduct);

export default WAdminProduct;
