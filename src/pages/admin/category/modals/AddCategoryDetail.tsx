import { FormField } from "@/components/form/form-register";
import { useForm } from "react-hook-form";
import { Category, CategoryDetail } from "@/types/category";
import { useAddDetail } from "@/lib/hooks/queryClient/mutator/category/categoryDetail/categoryDetail.mutator";
import { useEditDetail } from "@/lib/hooks/queryClient/mutator/category/categoryDetail/categoryDetail.mutator";
import { useGetCategoriesDetail } from "@/lib/hooks/queryClient/query/category/category.query";
import { useEffect } from "react";
import {
  UpdateCategoryDetailInterface,
} from "@/lib/api/service/category.service";
type AddCategoryDetailProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentCategoryDetail?: CategoryDetail | null;
  currentCategory?: Category | null;
};

// const schema = z.object({
//   name: z.string().min(1, { message: "Category name is required" }),
//   description: z.string().min(1, { message: "Description is required" }),
//   image: z.instanceof(File).optional(),
// });

function AddCategoryDetail({
  showAddModal,
  setShowAddModal,
  currentCategoryDetail = null,
  currentCategory = null,
}: AddCategoryDetailProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    // resolver: zodResolver(schema),
    defaultValues: {
      name: currentCategoryDetail?.name || "",
      description: currentCategoryDetail?.description || "",
      image: currentCategoryDetail?.image || [],
      status: currentCategoryDetail?.status || false,
    },
  });
  const { mutateAsync: addDetail, isPending } = useAddDetail();
  const { mutateAsync: editDetail, isPending: isEditPending } = useEditDetail();
  const { refetch } = useGetCategoriesDetail();
  const images = watch("image");
  useEffect(() => {
    if (currentCategoryDetail) {
      reset({
        name: currentCategoryDetail?.name || "",
        description: currentCategoryDetail?.description || "",
        image: currentCategoryDetail?.image || [],
        status: currentCategoryDetail?.status || false,
      });
    }
  }, [currentCategoryDetail, reset]);

  const onSubmit = async (data: UpdateCategoryDetailInterface) => {
    if (currentCategoryDetail) {
      await editDetail({
        categoryId: currentCategoryDetail?.id || "",
        data,
      });
      setShowAddModal(false);
      refetch();
    } else {
      await addDetail({
        categoryId: currentCategory?.id || "",
        data,
      });
      setShowAddModal(false);
      refetch();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setValue("image", newFiles as unknown as string[]);
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
                    Add New Category
                  </h3>
                  <div className="mt-4">
                    <form
                      className="space-y-4"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div>
                        <FormField
                          label="Category Name"
                          error={errors.name?.message as string}
                          placeholder="Enter category name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("name")}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Description"
                          error={errors.description?.message as string}
                          placeholder="Enter description"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("description")}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-sm text-gray-700 mb-2">
                          Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              multiple
                              className="hidden"
                            />
                          </label>
                        </div>
                        {images instanceof FileList && images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {Array.from(images).map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(
                                    file as unknown as Blob
                                  )}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            {...register("status")}
                          />
                          <label
                            htmlFor="status"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {currentCategoryDetail?.status
                              ? "Active"
                              : "Inactive"}
                          </label>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={!isDirty}
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm ${
                            !isValid ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {currentCategoryDetail
                            ? isEditPending
                              ? "Updating..."
                              : "Update"
                            : isPending
                            ? "Adding..."
                            : "Add"}
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
}

export default AddCategoryDetail;
