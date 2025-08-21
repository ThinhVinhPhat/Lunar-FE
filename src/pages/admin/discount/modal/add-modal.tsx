import { useCreateDiscount } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import { useUpdateDiscount } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import {
  DiscountInterface,
  DiscountValueType,
  DiscountType,
} from "@/types/discount";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/form/form-register";
import { useEffect, useState } from "react";
import { useFindUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useProductAction } from "@/lib/hooks/useProductAction";
import { Product } from "@/types/product";
import { UserType } from "@/types/user";
import { CreateDiscountInterface } from "@/lib/api/service/discount.service";
import { Role } from "@/types";

type AddDiscountModalProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentDiscount: DiscountInterface | null;
  refetch: () => void;
};

const schema = z.object({
  name: z.string().min(1, { message: "Discount name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  value: z
    .number()
    .min(0.01, { message: "Value must be greater than 0" })
    .max(100000, { message: "Value cannot exceed 100,000" }),
  valueType: z.enum(Object.values(DiscountValueType) as [string, ...string[]], {
    message: "Value type is required",
  }),
  discountType: z.enum(Object.values(DiscountType) as [string, ...string[]], {
    message: "Discount type is required",
  }),
  thresholdAmount: z
    .number()
    .min(0, { message: "Threshold amount must be 0 or greater" }),
  usageLimit: z.number().min(1, { message: "Usage limit must be at least 1" }),
  startAt: z.string().min(1, { message: "Start date is required" }),
  expireAt: z.string().min(1, { message: "Expiry date is required" }),
  isActive: z.boolean(),
  productIds: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

function AddDiscountModal({
  showAddModal,
  setShowAddModal,
  currentDiscount,
  refetch,
}: AddDiscountModalProps) {
  const { mutateAsync: createDiscount } = useCreateDiscount();
  const { mutateAsync: updateDiscount } = useUpdateDiscount();
  const [productPage, setProductPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const { products } = useProductAction(productPage, 10, { category: null });
  const { data: users } = useFindUser({
    role: [Role.CUSTOMER],
    page: userPage,
    limit: 10,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      value: 0,
      valueType: DiscountValueType.PERCENTAGE,
      discountType: DiscountType.ALL_PRODUCTS,
      thresholdAmount: 0,
      usageLimit: 1,
      startAt: new Date().toISOString().split("T")[0],
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      isActive: true,
      productIds: [],
      userIds: [],
    },
  });

  const valueType = watch("valueType");

  useEffect(() => {
    if (currentDiscount) {
      reset({
        name: currentDiscount.name,
        description: currentDiscount.description,
        value: currentDiscount.value,
        valueType: currentDiscount.valueType as DiscountValueType,
        discountType: currentDiscount.discountType as DiscountType,
        thresholdAmount: currentDiscount.thresholdAmount,
        usageLimit: currentDiscount.usageLimit,
        startAt: new Date(currentDiscount.startAt).toISOString().split("T")[0],
        expireAt: new Date(currentDiscount.expireAt)
          .toISOString()
          .split("T")[0],
        isActive: currentDiscount.isActive,
        productIds: currentDiscount?.discountProduct?.map(
          (product) => product.product.id
        ),
        userIds: currentDiscount?.userDiscounts?.map((user) => user.user.id),
      });
    }
  }, [currentDiscount, reset]);

  if (showAddModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const onSubmit = async (data: FormData) => {
    const result: CreateDiscountInterface = {
      ...data,
      startAt: new Date(data.startAt),
      expireAt: new Date(data.expireAt),
      valueType: data.valueType as DiscountValueType,
      discountType: data.discountType as DiscountType,
    };

    try {
      if (currentDiscount) {
        await updateDiscount({ id: currentDiscount.id, data: result });
      } else {
        await createDiscount(result);
      }
      refetch();
      setShowAddModal(false);
      reset();
    } catch (error) {
      console.error("Error saving discount:", error);
    }
  };

  const handleClose = () => {
    setShowAddModal(false);
    reset();
  };

  return (
    showAddModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentDiscount ? "Edit Discount" : "Create New Discount"}
                  </h3>
                  <div className="mt-4">
                    <form
                      className="space-y-4"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Discount Name
                          </label>
                          <FormField
                            placeholder="Enter discount name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("name")}
                            error={errors.name?.message}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="isActive"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Is Active
                          </label>
                          <FormField
                            type="select"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            options={["true", "false"]}
                            {...register("isActive", {
                              setValueAs: (value) => value === "true",
                            })}
                            error={errors.isActive?.message}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <FormField
                          type="textarea"
                          placeholder="Enter discount description"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("description")}
                          error={errors.description?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="valueType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Value Type
                          </label>
                          <FormField
                            type="select"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            options={[
                              DiscountValueType.PERCENTAGE,
                              DiscountValueType.FIXED,
                            ]}
                            {...register("valueType")}
                            error={errors.valueType?.message}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="value"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Discount{" "}
                            {valueType === "PERCENTAGE"
                              ? "Percentage"
                              : "Amount"}
                          </label>
                          <FormField
                            label={`Discount ${
                              valueType === "PERCENTAGE"
                                ? "Percentage"
                                : "Amount"
                            }`}
                            type="number"
                            step={valueType === "PERCENTAGE" ? "0.1" : "0.01"}
                            min="0"
                            max={valueType === "PERCENTAGE" ? "100" : "100000"}
                            placeholder={
                              valueType === "PERCENTAGE" ? "10" : "50.00"
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("value", {
                              setValueAs: (value) => parseFloat(value) || 0,
                            })}
                            error={errors.value?.message}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="discountType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Discount Type
                          </label>
                          <FormField
                            type="select"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            options={[
                              DiscountType.ALL_PRODUCTS,
                              DiscountType.DISCOUNT,
                              DiscountType.FREE_SHIP,
                            ]}
                            {...register("discountType")}
                            error={errors.discountType?.message}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="thresholdAmount"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Minimum Order Amount ($)
                          </label>
                          <FormField
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("thresholdAmount", {
                              setValueAs: (value) => parseFloat(value) || 0,
                            })}
                            error={errors.thresholdAmount?.message}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="usageLimit"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Usage Limit
                          </label>
                          <FormField
                            type="number"
                            min="1"
                            placeholder="100"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("usageLimit", {
                              setValueAs: (value) => parseInt(value) || 1,
                            })}
                            error={errors.usageLimit?.message}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="products"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Products
                          </label>
                          <select
                            multiple
                            {...register("productIds")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          >
                            {products?.map((product: Product) => (
                              <option
                                selected={currentDiscount?.discountProduct?.some(
                                  (p) => p.product.id === product.id
                                )}
                                key={product.id}
                                value={product.id}
                              >
                                {product.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border rounded-md mr-2"
                              onClick={() =>
                                setProductPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={productPage === 1}
                            >
                              Previous
                            </button>
                            <span className="text-sm p-2 ml-[-5px]">
                              {" "}
                              {productPage}{" "}
                            </span>
                            {products?.length > 8 && (
                              <button
                                type="button"
                                className="px-2 py-1 text-sm border rounded-md"
                                onClick={() =>
                                  setProductPage((prev) => prev + 1)
                                }
                                disabled={products?.length < 10}
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="users"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Users
                          </label>
                          <select
                            multiple
                            {...register("userIds")}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          >
                            {users?.map((user: UserType) => (
                              <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border rounded-md mr-2"
                              onClick={() =>
                                setUserPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={userPage === 1}
                            >
                              Previous
                            </button>
                            <span className="text-sm p-2 ml-[-5px]">
                              {" "}
                              {userPage}{" "}
                            </span>
                            {users?.length > 8 && (
                              <button
                                type="button"
                                className="px-2 py-1 text-sm border rounded-md"
                                onClick={() => setUserPage((prev) => prev + 1)}
                                disabled={users?.length < 10}
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="startAt"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Start Date
                          </label>
                          <FormField
                            type="datetime-local"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("startAt")}
                            error={errors.startAt?.message}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="expireAt"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expiry Date
                          </label>
                          <FormField
                            {...register("expireAt")}
                            type="datetime-local"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            error={errors.expireAt?.message}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6 -mx-4 -mb-4 sm:-mx-6 sm:-mb-4">
                        <button
                          type="submit"
                          disabled={!isDirty}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-[#C8A846] to-[#d4b851] text-base font-medium text-white hover:from-[#b39539] hover:to-[#c5a942] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {currentDiscount
                            ? "Update Discount"
                            : "Create Discount"}
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default AddDiscountModal;
