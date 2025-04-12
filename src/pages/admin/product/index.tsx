import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queryClient/query/product/products";
import { Product } from "@/types/product";
import { DeleteProductModal, AddProductModal } from "./modals";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useContextProvider } from "../../../hooks/useContextProvider";
import Pagination from "../../../components/admin/pagination";
import { useDeleteProduct } from "../../../hooks/queryClient/mutator/product/delete-product";

const AdminProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 5;
  const navigate = useNavigate();
  const { isAdmin } = useContextProvider();
  const { data: products, isLoading } = useProducts({ offset, limit: 5 });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin]);

  const filteredProducts = products?.data?.products?.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCategories.some((category: any) =>
        category.categoryDetails.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );
  const totalProducts =
    searchTerm === "" ? products?.data?.productCount : filteredProducts?.length;
  const totalPages = Math.ceil(totalProducts / 5);

  // const handleEdit = (product: any) => {
  //   setCurrentProduct(product);
  //   setShowEditModal(true);
  // };

  const handleDelete = async () => {
    const response = await deleteProduct(currentProduct?.id);
    if (response.status === 200) {
      setShowDeleteModal(false);
      products?.refetch();
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
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filters
            </button>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
              <option value="">All Categories</option>
              <option value="Sunglasses">Sunglasses</option>
              <option value="Eyeglasses">Eyeglasses</option>
              <option value="Readers">Readers</option>
              <option value="Sports">Sports</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div> */}
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
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
                        // onClick={() => handleEdit(product)}
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
      )}
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
      />
      <DeleteProductModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
};

export default AdminProduct;
