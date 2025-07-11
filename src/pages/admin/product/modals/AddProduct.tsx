import { useGetCategoriesDetail } from "@/hooks/queryClient/query/category";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/form/form-register";
import { useAddProduct } from "@/hooks/queryClient/mutator/product/add-product";
import clsx from "clsx";
import { Product } from "@/types/product";
import { CategoryDetail } from "@/types/category";
import { useEffect, useState } from "react";

type AddProductModalsProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentProduct?: Product;
};

type AddProductForm = {
  name: string;
  price: number;
  stock: number;
  discount: number;
  description: string;
  categoryId: string[];
  images: (string | File)[];
  isFreeShip: boolean;
  isFeatured: boolean;
  isNew: boolean;
};

export const AddProductModal = ({
  showAddModal,
  setShowAddModal,
  currentProduct = undefined,
}: AddProductModalsProps) => {
  const [product, setProduct] = useState<Product | undefined>(currentProduct);

  useEffect(() => {
    setProduct(currentProduct);
  }, [currentProduct]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { isDirty, errors },
  } = useForm<AddProductForm>({
    defaultValues: {
      name: product?.name || "",
      price: Number(product?.price) || 0,
      stock: Number(product?.stock) || 0,
      description: product?.description || "",
      discount: Number(product?.discount_percentage) || 0,
      categoryId:
        product?.productCategories?.map(
          (category: any) => category.categoryDetails.id
        ) || [],
      images: product?.images || [],
      isFreeShip: product?.isFreeShip,
      isFeatured: product?.isFeatured,
      isNew: product?.isNew,
    },
  });

  const { data: categoriesDetails } = useGetCategoriesDetail();
  const { mutateAsync: addProduct, isPending: isAdding } = useAddProduct();

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!isDirty) return;
    const res = await addProduct(data);
    if (res.status === 201) {
      reset();
      setShowAddModal(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const currentImages = getValues("images") || [];
      const newFiles = Array.from(e.target.files);
      setValue("images", [...currentImages, ...newFiles]);
    }
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
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New Product
                  </h3>
                  <div className="mt-4">
                    <form
                      className="space-y-4"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <FormField
                          label="Product Name"
                          value={product?.name}
                          placeholder="Enter product name"
                          error={errors.name?.message as any}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("name")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <div className="flex flex-col space-y-2">
                          {categoriesDetails?.map(
                            (category: CategoryDetail) => (
                              <div
                                key={category.id}
                                className="flex items-center"
                              >
                                <Controller
                                  control={control}
                                  name="categoryId"
                                  render={({ field }) => (
                                    <input
                                      type="checkbox"
                                      value={category.id}
                                      checked={product?.productCategories?.some(
                                        (productCategory: any) =>
                                          productCategory.categoryDetails.id ===
                                          category.id
                                      )}
                                      onChange={(e) => {
                                        const newValue = e.target.checked
                                          ? [...field.value, category.id]
                                          : field.value.filter(
                                              (id) => id !== category.id
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  )}
                                />

                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="ml-2 block text-sm text-gray-900"
                                >
                                  {category.name}
                                </label>
                                {errors.categoryId?.message}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Price ($)
                          </label>
                          <FormField
                            type="number"
                            label="price"
                            step={0.01}
                            value={product?.price}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter price"
                            error={errors.price?.message as any}
                            {...register("price")}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <FormField
                            type="number"
                            value={product?.stock}
                            label="Stock"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter stock"
                            {...register("stock")}
                            error={errors.stock?.message as any}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Discount
                          </label>
                          <FormField
                            type="number"
                            value={product?.discount_percentage}
                            label="Discount"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter discount"
                            {...register("discount")}
                            error={errors.discount?.message as any}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <div className="input-holder flex flex-col items-center space-x-2">
                            <div className="w-full flex p-2 items-center space-x-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Images
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const inputHolder =
                                    document.querySelector(".input-holder");
                                  if (!inputHolder) return;

                                  const newInputContainer =
                                    document.createElement("div");
                                  newInputContainer.className =
                                    "w-full flex p-2 items-center space-x-2";

                                  const fileInput =
                                    document.createElement("input");
                                  fileInput.type = "file";
                                  fileInput.className =
                                    "flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]";
                                  fileInput.accept = "image/*";
                                  fileInput.onchange = (e: Event) => {
                                    const inputEvent =
                                      e as unknown as React.ChangeEvent<HTMLInputElement>;
                                    handleImageChange(inputEvent);
                                  };

                                  const removeButton =
                                    document.createElement("button");
                                  removeButton.type = "button";
                                  removeButton.className =
                                    "px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
                                  removeButton.textContent = "Remove";
                                  removeButton.onclick = function () {
                                    inputHolder.removeChild(newInputContainer);
                                  };

                                  newInputContainer.appendChild(fileInput);
                                  newInputContainer.appendChild(removeButton);
                                  inputHolder.appendChild(newInputContainer);
                                }}
                                className="px-3 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          <div className="image-holder flex flex-wrap items-center space-x-2">
                            {product?.images?.map((image: any) => {
                              return image instanceof File ? (
                                <img
                                  src={URL.createObjectURL(image)}
                                  className="w-1/4 h-1/4 object-cover"
                                  alt="Product Image"
                                />
                              ) : (
                                <img
                                  src={image}
                                  className="w-1/4 h-1/4 object-cover"
                                  alt="Product Image"
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={product?.description}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("description")}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        {["isFreeShip", "isNew", "isFeatured"].map((status) => (
                          <div className="flex flex-col space-y-2">
                            <FormField
                              type="checkbox"
                              label={status}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              checked={
                                product?.[status as keyof Product] as boolean
                              }
                              {...register(status as keyof AddProductForm)}
                            />
                            <label htmlFor={status}>{status}</label>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          disabled={!isDirty}
                          type="submit"
                          className={clsx(
                            "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm",
                            {
                              "bg-[#b39539] cursor-not-allowed": isAdding,
                              "bg-[#C8A846]": !isAdding,
                            }
                          )}
                        >
                          {isAdding ? "Adding..." : "Add Product"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
};
