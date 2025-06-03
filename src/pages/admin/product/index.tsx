import { Product } from "@/types/product";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmModal } from "../../../components/admin/modal/DeleteConfirm";
import Pagination from "../../../components/admin/pagination";
import SearchComponent from "../../../components/admin/ui/Search";
import { useDeleteProduct } from "../../../hooks/queryClient/mutator/product/delete-product";
import { AddProductModal } from "./modals/AddProduct";
import {
  AuthProps,
  isLoginAdminAuth,
} from "../../../components/wrapper/withAuth";
import { useProductAction } from "../../../hooks/useProductAction";
import IsLoadingWrapper from "../../../components/wrapper/isLoading";

const AdminProduct: React.FC<AuthProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 5;
  const { products, isLoading, refetch, total } = useProductAction(offset, 5);

  const filteredProducts = products?.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCategories.some((category: any) =>
        category.categoryDetails.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );
  const totalProducts =
    searchTerm === "" ? total : filteredProducts?.length;
  const totalPages = Math.ceil(totalProducts / 5);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    const response = await deleteProduct(currentProduct?.id);
    if (response.status === 200) {
      setShowDeleteModal(false);
      refetch();
    }
  };

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
                            (category: any) => category.categoryDetails.name
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
        products={products}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
      />

      <AddProductModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
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
