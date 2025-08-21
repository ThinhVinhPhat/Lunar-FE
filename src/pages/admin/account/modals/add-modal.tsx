import {
  useCreateUser,
  useUpdateUserAdmin,
} from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import { UserType } from "@/types/user";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/form/form-register";
import { useEffect } from "react";
import {
  CreateUserParams,
  UpdateUserAdminParams,
} from "@/lib/api/service/user.service";

type AddModalProps = {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
  currentAccount: UserType | null;
  refetch: () => void;
};

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

function AddModal({
  showAddModal,
  setShowAddModal,
  currentAccount,
  refetch,
}: AddModalProps) {
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUserAdmin } = useUpdateUserAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "Inactive",
    },
  });

  useEffect(() => {
    if (currentAccount) {
      reset({
        firstName: currentAccount.firstName,
        lastName: currentAccount.lastName,
        email: currentAccount.email,
        role: currentAccount.role,
        status: currentAccount.status ? "Active" : "Inactive",
      });
    }
  }, [currentAccount, reset]);

  if (showAddModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const onSubmit = async (data: CreateUserParams | UpdateUserAdminParams) => {
    const result: CreateUserParams | UpdateUserAdminParams = {
      ...data,
      status: data?.status === "Active" ? true : false,
    };

    if (currentAccount) {
      await updateUserAdmin(result as UpdateUserAdminParams);
      refetch();
    } else {
      await createUser(result as CreateUserParams);
      refetch();
    }
  };
  return (
    showAddModal && (
      <div className="fixed  inset-0 z-50 overflow-y-auto">
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
                    {currentAccount ? "Edit Account" : "Add New Account"}
                  </h3>
                  <div className="mt-4">
                    <form
                      className="space-y-4"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div>
                        <FormField
                          label="First Name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("firstName", {
                            required: true,
                          })}
                          error={errors.firstName?.message}
                        />
                      </div>

                      <div>
                        <FormField
                          label="Last Name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          {...register("lastName", {
                            required: true,
                          })}
                          error={errors.lastName?.message}
                        />
                      </div>

                      <div>
                        {!currentAccount && (
                          <FormField
                            label="Email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("email", {
                              required: true,
                            })}
                            error={errors.email?.message}
                          />
                        )}
                      </div>
                      {!currentAccount && (
                        <div>
                          <FormField
                            type="password"
                            label="Password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                            {...register("password", { required: true })}
                            error={errors.password?.message}
                          />
                        </div>
                      )}
                      <div>
                        <FormField
                          label="Role"
                          type="select"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          options={["Admin", "Customer"]}
                          {...register("role", {
                            required: true,
                          })}
                          error={errors.role?.message}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Status"
                          type={"select"}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
                          options={["Active", "Inactive"]}
                          {...register("status", {
                            required: true,
                          })}
                          error={errors.status?.message}
                        />
                      </div>

                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={!isDirty}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#C8A846] text-base font-medium text-white hover:bg-[#b39539] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Save Changes
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

export default AddModal;
