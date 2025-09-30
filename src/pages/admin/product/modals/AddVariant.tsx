import { useGetCategoriesDetail } from "@/lib/hooks/queryClient/query/category/category.query";
import { useForm } from "react-hook-form";
import { FormField } from "@/shared/components/form/form-register";
import { useCreateProductVariant, useUpdateProductVariant } from "@/lib/hooks/queryClient/mutator/product-variant/product-variant.mutator";
import clsx from "clsx";
import { Product } from "@/shared/types/product";
import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { useEffect, useState } from "react";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useProducts } from "@/lib/hooks/queryClient/query/product/product.query";
import { ImageUploadField, CheckboxField, CategorySelector, ProductSelector } from "../components";
import { parseGlassesSize } from "@/lib/ultis/parseGlassesSize";

type AddVariantModalProps = {
  showAddVariantModal: boolean;
  setShowAddVariantModal: (show: boolean) => void;
  currentVariant?: ProductVariantResponse;
  selectedProduct?: Product;
  handleRefresh: () => void;
};

export type AddVariantForm = {
  productId: string;
  color: string;
  size: {
    lens: number;
    bridge: number;
    overallWidth: number;
    temple: number;
  } | string;
  price: number;
  stock: number;
  discount_percentage: number;
  images: (string | File)[];
  category: string[];
  status: boolean;
  isNew: boolean;
};

export const AddVariantModal = ({
  showAddVariantModal,
  setShowAddVariantModal,
  currentVariant,
  selectedProduct,
  handleRefresh,
}: AddVariantModalProps) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { data: categoriesDetails } = useGetCategoriesDetail();
  const { data: products } = useProducts({});
  const { mutateAsync: addVariant, isPending: isAdding } = useCreateProductVariant();
  const { mutateAsync: updateVariant, isPending: isUpdating } = useUpdateProductVariant();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm<AddVariantForm>({
    defaultValues: {
      productId: selectedProduct?.id || currentVariant?.product?.id || "",
      color: currentVariant?.color || "",
      size: parseGlassesSize(currentVariant?.size) || {
        lens: 0,
        bridge: 0,
        overallWidth: 0,
        temple: 0,
      },
      price: currentVariant?.price || 0,
      stock: currentVariant?.stock || 0,
      discount_percentage: currentVariant?.discount_percentage || 0,
      images: currentVariant?.images || [],
      category: currentVariant?.productCategories?.map(cat => cat.categoryDetail.name) || [],
      status: currentVariant?.status ?? true,
      isNew: currentVariant?.isNew ?? false,
    },
  });

  useEffect(() => {
    if (currentVariant) {
      reset({
        productId: currentVariant?.product?.id || "",
        color: currentVariant?.color || "",
        size: parseGlassesSize(currentVariant?.size) || {
          lens: 0,
          bridge: 0,
          overallWidth: 0,
          temple: 0,
        },
        price: currentVariant?.price || 0,
        stock: currentVariant?.stock || 0,
        discount_percentage: currentVariant?.discount_percentage || 0,
        images: currentVariant.images,
        category: currentVariant.productCategories?.map(cat => cat.categoryDetail.name) || [],
        status: currentVariant.status,
        isNew: currentVariant.isNew,
      });
    } else if (selectedProduct) {
      reset({
        productId: selectedProduct.id,
        color: "",
        size: { lens: 0, bridge: 0, overallWidth: 0, temple: 0 },
        price: 0,
        stock: 0,
        discount_percentage: 0,
        images: [],
        category: [],
        status: true,
        isNew: false,
      });
    }
    setIsUpdate(!!currentVariant);
  }, [currentVariant, selectedProduct, reset]);

  const onSubmit = async (data: AddVariantForm) => {
    if (!isDirty) return;

    console.log('Form data before processing:', data);
    console.log('Images data:', data.images);

    const validImages = (data.images || []).filter((img, index) => {
      console.log(`Processing image ${index}:`, img, 'Type:', typeof img, 'Is File:', img instanceof File);
      
      if (img instanceof File) {
        console.log(`File ${index}: ${img.name}, Size: ${img.size} bytes`);
        return img.size > 0;
      } else if (typeof img === 'string' && img.trim() !== '') {
        console.log(`Image ${index} is already a string URL: ${img}`);
        return true;
      } else {
        console.warn(`Invalid image data at index ${index}:`, img);
        return false;
      }
    });

    console.log('Valid images after filtering:', validImages);

    const variantData: AddVariantForm = {
      productId: data?.productId || "",
      color: data?.color || "",
      size: JSON.stringify(data?.size) || "",
      price: Number(data?.price || 0),
      stock: Number(data?.stock || 0),
      discount_percentage: Number(data?.discount_percentage || 0),
      images: validImages,
      category: data.category,
      status: data.status,
      isNew: data.isNew,
    };
    
    try {
      if (isUpdate && currentVariant) {
        await updateVariant({
          id: currentVariant.id,
          data: variantData,
        });
        handleRefresh();
        setShowAddVariantModal(false);
        reset();
      } else {
        await addVariant(variantData);
        handleRefresh();
        setValue('color', '');
        setValue('images', []);
      }
    } catch (error) {
      console.error("Error saving variant:", error);
    }
  };

  console.log('Current variant:', currentVariant);

  if (!showAddVariantModal) return null;

  return (
    <IsLoadingWrapper isLoading={isAdding || isUpdating}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isUpdate ? "Update Product Variant" : "Add New Product Variant"}
                  </h3>
                  
                  <div className="mt-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                      <ProductSelector
                        control={control}
                        name="productId"
                        products={products}
                        disabled={!!currentVariant}
                        label="Product"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <FormField
                          label="Color"
                          placeholder="Enter color (e.g., Black, Brown, Blue)"
                          error={errors.color?.message as string}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("color", { required: "Color is required" })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size Measurements (mm)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500">Lens Width</label>
                            <FormField
                              type="number"
                              placeholder="54"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              {...register("size.lens", { valueAsNumber: true })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">Bridge Width</label>
                            <FormField
                              type="number"
                              placeholder="19"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              {...register("size.bridge", { valueAsNumber: true })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">Overall Width</label>
                            <FormField
                              type="number"
                              placeholder="144"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              {...register("size.overallWidth", { valueAsNumber: true })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">Temple Length</label>
                            <FormField
                              type="number"
                              placeholder="145"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                              {...register("size.temple", { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Price ($)
                          </label>
                          <FormField
                            type="number"
                            step={0.01}
                            placeholder="89.00"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("price", { required: "Price is required", valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <FormField
                            type="number"
                            placeholder="100"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("stock", { required: "Stock is required", valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Discount (%)
                          </label>
                          <FormField
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("discount_percentage", { valueAsNumber: true })}
                          />
                        </div>
                      </div>

                      <CategorySelector
                        control={control}
                        name="category"
                        value={currentVariant?.productCategories?.map(cat => cat.categoryDetail.name) || []}
                        categories={categoriesDetails}
                        label="Categories"
                      />

                      <ImageUploadField
                        control={control}
                        name="images"
                        label="Variant Images"
                        multiple={true}
                        maxImages={10}
                      />

                      <div className="flex gap-6">
                        <CheckboxField
                          control={control}
                          name="status"
                          label="Active"
                        />
                        <CheckboxField
                          control={control}
                          name="isNew"
                          label="New Arrival"
                        />
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
                          {isUpdate ? "Update Variant" : "Add Variant"}
                        </button>
                        <button
                          type="button"
                          disabled={isAdding || isUpdating}
                          onClick={() => setShowAddVariantModal(false)}
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
  );
};
