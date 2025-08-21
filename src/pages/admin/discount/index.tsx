import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  Calendar,
  Percent,
} from "lucide-react";
import AddDiscountModal from "./modal/add-modal";
import { DeleteConfirmModal } from "@/components/admin/modal/DeleteConfirm";
import SearchComponent from "@/components/admin/ui/Search";
import {
  DiscountInterface,
  DiscountProductInterface,
  DiscountValueType,
  UserDiscountInterface,
} from "@/types/discount";
import Pagination from "@/components/admin/pagination";
import { AuthProps, isLoginAdminAuth } from "@/components/wrapper/withAuth";
import { useDeleteDiscount } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import { useGetAllDiscounts } from "@/lib/hooks/queryClient/query/discount/discount.query";
import IsLoadingWrapper from "@/components/wrapper/isLoading";
import { useTranslation } from "react-i18next";

const AdminDiscount: React.FC<AuthProps> = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [_, setShowAddProductModal] = useState(false);
  const [currentDiscount, setCurrentDiscount] =
    useState<DiscountInterface | null>(null);
  const [currentDiscountProduct, setCurrentDiscountProduct] =
    useState<DiscountProductInterface | null>(null);
  const {
    data: discounts,
    total: totalItems,
    isLoading,
    refetch,
  } = useGetAllDiscounts(page, 10, "All Discount", searchTerm);
  const { mutateAsync: deleteDiscount } = useDeleteDiscount();
  const { mutateAsync: deleteDiscountProduct } = useDeleteDiscount();

  const filteredDiscounts = discounts?.filter(
    (discount: DiscountInterface) =>
      discount?.discountProduct?.some((item: DiscountProductInterface) =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || discount.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDiscounts =
    searchTerm === "" ? discounts?.length : filteredDiscounts?.length;
  const totalPages = Math.ceil(totalDiscounts / 10);

  const handleEditProduct = (discountProduct: DiscountProductInterface) => {
    setCurrentDiscountProduct(discountProduct);
    setShowAddProductModal(true);
  };

  const handleDelete = async (discount: DiscountInterface) => {
    setCurrentDiscount(discount);
    setShowDeleteModal(true);
    await deleteDiscount(discount.id);
    refetch();
  };

  const handleDeleteProduct = async (
    discountProduct: DiscountProductInterface
  ) => {
    setCurrentDiscountProduct(discountProduct);
    setShowDeleteModal(true);
    await deleteDiscountProduct(discountProduct.product.id);
    refetch();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountBadgeColor = (discount: DiscountInterface) => {
    if (!discount.isActive) return "bg-gray-100 text-gray-600";
    const now = new Date();
    const startDate = new Date(discount.startAt);
    const endDate = new Date(discount.expireAt);

    if (now < startDate) return "bg-blue-100 text-blue-600";
    if (now > endDate) return "bg-red-100 text-red-600";
    return "bg-green-100 text-green-600";
  };

  const getDiscountStatus = (discount: DiscountInterface) => {
    if (!discount.isActive) return "Inactive";
    const now = new Date();
    const startDate = new Date(discount.startAt);
    const endDate = new Date(discount.expireAt);

    if (now.getTime() < startDate.getTime()) return "Scheduled";
    if (now.getTime() > endDate.getTime()) return "Expired";
    return "Active";
  };

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("discount.discountManagement")}
            </h1>
            <p className="text-gray-600">
              {t("discount.manageProductDiscounts")}
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentDiscount(null);
              setShowAddModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C8A846] to-[#d4b851] text-white rounded-lg hover:from-[#b39539] hover:to-[#c5a942] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            {t("discount.addDiscount")}
          </button>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={t("discount.searchDiscounts")}
          />
        </div>

        <div className="space-y-6 mb-6">
          {filteredDiscounts?.map((discount: DiscountInterface) => (
            <div
              key={discount.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {discount.name} - {discount.slug}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDiscountBadgeColor(
                          discount
                        )}`}
                      >
                        {getDiscountStatus(discount)}
                      </span>
                      <div className="flex items-center text-[#C8A846] bg-[#C8A846]/10 px-2 py-1 rounded-md">
                        <Percent size={14} className="mr-1" />
                        <span className="text-sm font-medium">
                          {discount.valueType === DiscountValueType.PERCENTAGE
                            ? `${discount.value}%`
                            : `$${discount.value}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{discount.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={14} className="mr-2 text-[#C8A846]" />
                        <span>Start: {formatDate(discount.startAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar size={14} className="mr-2 text-red-400" />
                        <span>End: {formatDate(discount.expireAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users size={14} className="mr-2 text-blue-400" />
                        <span>
                          Usage: {discount.userDiscounts?.length || 0}/
                          {discount.usageLimit}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Package size={14} className="mr-2 text-green-400" />
                        <span>
                          Products: {discount.discountProduct?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setCurrentDiscount(discount);
                        setShowAddModal(true);
                      }}
                      className="ml-4 p-2 rounded-lg hover:bg-red-50 text-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(discount)}
                      className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Applied Products
                  </h3>
                  <span className="text-sm text-gray-500">
                    Minimum order: ${discount.thresholdAmount}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {discount?.discountProduct &&
                    discount?.discountProduct?.map(
                      (discountProduct: DiscountProductInterface) => (
                        <div
                          key={discountProduct.product.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 hover:border-[#C8A846]/30"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 mb-1">
                                {discountProduct.product.name}
                              </h4>
                              {discountProduct.customDiscountRate && (
                                <div className="flex items-center mb-2">
                                  <span className="text-xs bg-[#C8A846] text-white px-2 py-1 rounded-md">
                                    Custom: {discountProduct.customDiscountRate}
                                    %
                                  </span>
                                </div>
                              )}
                              <p className="text-sm text-gray-500">
                                Applied:{" "}
                                {discountProduct.appliedAt
                                  ? formatDate(discountProduct.appliedAt)
                                  : "Not applied"}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={() =>
                                  handleEditProduct(discountProduct)
                                }
                                className="p-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(discountProduct)
                                }
                                className="p-2 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                  <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:bg-[#C8A846]/5 hover:border-[#C8A846] cursor-pointer transition-all duration-200">
                    <button
                      onClick={() => {
                        setCurrentDiscountProduct(null);
                        setCurrentDiscount(discount);
                        setShowAddProductModal(true);
                      }}
                      className="text-[#C8A846] flex items-center font-medium"
                    >
                      <Plus size={16} className="mr-2" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {discount.userDiscounts &&
                  discount.userDiscounts.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Recent Usage
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {discount.userDiscounts
                          .slice(0, 5)
                          .map((userDiscount: UserDiscountInterface, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                            >
                              {userDiscount.user.firstName}{" "}
                              {userDiscount.user.lastName} (
                              {userDiscount.quantity} x)
                            </span>
                          ))}
                        {discount.userDiscounts.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{discount.userDiscounts.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        <Pagination
          filteredProducts={filteredDiscounts}
          setPage={setPage}
          page={page}
          totalItems={totalItems}
          totalPages={totalPages}
        />

        <AddDiscountModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          currentDiscount={currentDiscount}
          refetch={refetch}
        />

        <DeleteConfirmModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          onDelete={() => {
            if (currentDiscount) {
              handleDelete(currentDiscount);
            } else if (currentDiscountProduct) {
              handleDeleteProduct(currentDiscountProduct);
            }
          }}
        />
      </>
    </IsLoadingWrapper>
  );
};

const WAdminDiscount = isLoginAdminAuth(AdminDiscount);

export default WAdminDiscount;
