import { useForm } from "react-hook-form";
import { FormField } from "@/shared/components/form/form-register";
import { useAddProduct, useUpdateProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";
import clsx from "clsx";
import { Product } from "@/shared/types/product";
import { useEffect, useState } from "react";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { ImageUploadField, CheckboxField } from "../components";

type AddProductModalsProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentProduct?: Product;
  handleRefresh: () => void;
};

type AddProductForm = {
  name: string;
  description: string;
  category: string[];
  images: (string | File)[];
  isFreeShip: boolean;
  isFeatured: boolean;
  isNew: boolean;
  status: boolean;
  video?: string;
};


export const AddProductModal = ({
  showAddModal,
  setShowAddModal,
  currentProduct = undefined,
  handleRefresh,
}: AddProductModalsProps) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { mutateAsync: addProduct, isPending: isAdding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<AddProductForm>({
    defaultValues: {
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      category: [],
      images: currentProduct?.images || [],
      isFreeShip: currentProduct?.isFreeShip || false,
      isFeatured: currentProduct?.isFeatured || false,
      isNew: currentProduct?.isNew || false,
      status: currentProduct?.status ?? true,
      video: currentProduct?.video || "",
    },
  });


  useEffect(() => {
    if(currentProduct) {
      reset({
        name: currentProduct.name,
        description: currentProduct.description || "",
        category: [],
        images: currentProduct.images || [],
        isFreeShip: currentProduct.isFreeShip || false,
        isFeatured: currentProduct.isFeatured || false,
        isNew: currentProduct.isNew || false,
        status: currentProduct.status ?? true,
        video: currentProduct.video || "",
      });
    }
    else {
      reset({});
    }
    setIsUpdate(!!currentProduct);
  }, [currentProduct, reset]);
  
  const onSubmit = async (data: AddProductForm) => {
    if (!isDirty) return;
    
    const productData = {
      name: data.name,
      description: data.description,
      categoryId: data.category,
      images: data.images,
      isFreeShip: data.isFreeShip,
      isFeatured: data.isFeatured,
      isNew: data.isNew,
      status: data.status,
      video: data.video || null,
    };
    
    try {
      if (isUpdate) {
        await updateProduct({
          ...productData,
          id: currentProduct?.id || '',
        });
      } else {
        await addProduct(productData);
      }
      
      handleRefresh();
      // setShowAddModal(false);
      // reset();
    } catch (error) {
      console.error('Error saving product:', error);
      // Modal stays open on error so user can retry
    }
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
                      {/* <CategorySelector
                        control={control}
                        name="category"
                        categories={categoriesDetails}
                        label="Categories"
                      /> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Video URL (Optional)
                        </label>
                        <FormField
                          label="Video URL"
                          placeholder="Enter video URL"
                          error={errors.video?.message as string}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("video")}
                        />
                      </div>
                      <ImageUploadField
                        control={control}
                        name="images"
                        label="Product Images"
                        multiple={true}
                      />
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
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Product Settings
                        </label>
                        <div className="space-y-3">
                          <CheckboxField
                            control={control}
                            name="status"
                            label="Active Status"
                          />
                          <CheckboxField
                            control={control}
                            name="isFreeShip"
                            label="Free Shipping"
                          />
                          <CheckboxField
                            control={control}
                            name="isNew"
                            label="New Product"
                          />
                          <CheckboxField
                            control={control}
                            name="isFeatured"
                            label="Featured Product"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          disabled={!isDirty}
                          type="submit"
                          className={clsx(
                            "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm",
                            {
                              "bg-gray-400 cursor-not-allowed": !isDirty || isAdding || isUpdating,
                              "bg-[#C8A846] hover:bg-[#b39539]": isDirty && !isAdding && !isUpdating,
                            }
                          )}
                        >
                          {
                            isUpdate ? "Update" : "Add"
                          }
                        </button>
                        <button
                          type="button"
                          disabled={isAdding || isUpdating}
                          onClick={() => setShowAddModal(false)}
                          className={clsx(
                            "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
                            {
                              "bg-gray-200 text-gray-400 cursor-not-allowed": isAdding || isUpdating,
                              "bg-white text-gray-700 hover:bg-gray-50": !isAdding && !isUpdating,
                            }
                          )}
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
