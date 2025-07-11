import { FormField } from "@/components/form/form-register";
import { useForm } from "react-hook-form";
import { Category, CategoryDetail } from "@/types/category";
import { useAddDetail } from "@/hooks/queryClient/mutator/category/categoryDetail/add-detail";
import { useEditDetail } from "@/hooks/queryClient/mutator/category/categoryDetail/edit-detail";
import { useGetCategoriesDetail } from "@/hooks/queryClient/query/category";
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
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    // resolver: zodResolver(schema),
    defaultValues: {
      name: currentCategoryDetail?.name || "",
      description: currentCategoryDetail?.description || "",
      image: currentCategoryDetail?.image || [],
    },
  });
  const { mutateAsync: addDetail, isPending } = useAddDetail();
  const { mutateAsync: editDetail } = useEditDetail();
  const { refetch } = useGetCategoriesDetail();


  const onSubmit = async (data: any) => {
    console.log(data);
    if (currentCategoryDetail) {
      const response = await editDetail({
        ...data,
        categoryId: currentCategory?.id,
      });
      if (response.status === 200) {
        setShowAddModal(false);
        refetch();
      }
    } else {
      const response = await addDetail({
        ...data,
        categoryId: currentCategory?.id,
      });
      if (response.status === 200) {
        setShowAddModal(false);
        refetch();
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    if (files) {
      setValue("image", [...getValues("image"), ...files]);
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
                          error={errors.name?.message as any}
                          placeholder="Enter category name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("name")}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Description"
                          error={errors.description?.message as any}
                          placeholder="Enter description"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("description")}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Image"
                          type="file"
                          accept="image/*"
                          error={errors.image?.message as string}
                          placeholder="Enter image"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("image", {
                            onChange: handleImageChange,
                          })}
                        />
                      </div>
                      {currentCategoryDetail && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <img
                            src={currentCategoryDetail?.image || ""}
                            alt="Category Image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={!isDirty}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {isPending ? "Adding..." : "Add Category Detail"}
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
