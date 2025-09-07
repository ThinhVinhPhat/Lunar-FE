import { useGetCategoriesDetail } from "@/lib/hooks/queryClient/query/category/category.query";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/shared/components/form/form-register";
import { useAddProduct, useUpdateProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";
import clsx from "clsx";
import { Product, ProductCategory } from "@/shared/types/product";
import { CategoryDetail } from "@/shared/types/category";
import { useEffect, useState } from "react";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";

type AddProductModalsProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentProduct?: Product;
  handleRefresh: () => void;
};

type AddProductForm = {
  name: string;
  price: number;
  stock: number;
  discount: number;
  description: string;
  category: string[];
  images: (string | File)[];
  isFreeShip: boolean;
  isFeatured: boolean;
  isNew: boolean;
};


export const AddProductModal = ({
  showAddModal,
  setShowAddModal,
  currentProduct = undefined,
  handleRefresh,
}: AddProductModalsProps) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { data: categoriesDetails } = useGetCategoriesDetail();
  const { mutateAsync: addProduct, isPending: isAdding, isSuccess: isSuccessAdd } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating, isSuccess: isSuccessUpdate } = useUpdateProduct();

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
      name: currentProduct?.name || "",
      price: Number(currentProduct?.price) || 0,
      stock: Number(currentProduct?.stock) || 0,
      description: currentProduct?.description || "",
      discount: Number(currentProduct?.discount_percentage) || 0,
      category:
        currentProduct?.productCategories?.map(
          (category: ProductCategory) => category.categoryDetails.id
        ) || [],
      images: currentProduct?.images || [],
      isFreeShip: currentProduct?.isFreeShip,
      isFeatured: currentProduct?.isFeatured,
      isNew: currentProduct?.isNew,
    },
  });


  useEffect(() => {
    if(currentProduct) {
      reset({
        name: currentProduct.name,
        price: Number(currentProduct.price) || 0,
        stock: Number(currentProduct.stock) || 0,
        description: currentProduct.description || "",
        discount: Number(currentProduct.discount_percentage) || 0,
        category:
          currentProduct.productCategories?.map(
            (category: ProductCategory) => category.categoryDetails.id
          ) || [],
        images: currentProduct.images || [],
        isFreeShip: currentProduct.isFreeShip,
        isFeatured: currentProduct.isFeatured,
        isNew: currentProduct.isNew,
      });
    }    
    setIsUpdate(!!currentProduct);
  }, [currentProduct]);
  
  const onSubmit = async (data: AddProductForm) => {
    if (!isDirty) return;
    
    const baseData = {
      ...data,
      categoryId: data.category,
      images: data.images, // Giữ nguyên File objects, không convert thành string
      discount: Number(data.discount)
    };
    
    isUpdate ? await updateProduct({
      ...baseData,
      id: currentProduct?.id || '',
    }) : await addProduct(baseData);
 
     if(isSuccessAdd || isSuccessUpdate) {
      handleRefresh();
      setShowAddModal(false);
      reset();
     }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = getValues("images") || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue("images", updatedImages, { shouldDirty: true });
  };

  return (
    showAddModal && (
      <IsLoadingWrapper isLoading={isAdding || isUpdating}>
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
                    {isUpdate ? "Update Product" : "Add New Product"}
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
                          placeholder="Enter product name"
                          error={errors.name?.message as string}
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
                                key={category.name  }
                                className="flex items-center"
                              >
                                <Controller
                                  control={control}
                                  name="category"
                                  render={({ field }) => (
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(category.name)}
                                      onChange={(e) => {
                                        const newValue = e.target.checked
                                          ? [...field.value, category.name]
                                          : field.value.filter(
                                              (name) => name !== category.name
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  )}
                                />

                                <label
                                  htmlFor={`category-${category.name}`}
                                  className="ml-2 block text-sm text-gray-900"
                                >
                                  {category.name}
                                </label>
                                {errors.category?.message}
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter price"
                            error={errors.price?.message as string}
                            {...register("price")}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <FormField
                            type="number"
                            label="Stock"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter stock"
                            {...register("stock")}
                            error={errors.stock?.message as string}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Discount
                          </label>
                          <FormField
                            type="number"
                            label="Discount"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            placeholder="Enter discount"
                            {...register("discount")}
                            error={errors.discount?.message as string}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images
                        </label>
                        <Controller
                          control={control}
                          name="images"
                          render={({ field }) => (
                            <div className="space-y-4">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const newFiles = Array.from(e.target.files);
                                    field.onChange([...field.value, ...newFiles]);
                                  }
                                }}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              />
                              
                              {field.value && field.value.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                  {field.value.map((image: string | File, index: number) => (
                                    <div key={index} className="relative">
                                      <img
                                        src={image instanceof File ? URL.createObjectURL(image) : image}
                                        className="w-full h-20 object-cover rounded-md"
                                        alt={`Product Image ${index + 1}`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          rows={3}
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
                                currentProduct?.[status as keyof Product] as boolean
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
                          {
                            isUpdate ? "Update" : "Add"
                          }
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
      </IsLoadingWrapper>
    )
  );
};
