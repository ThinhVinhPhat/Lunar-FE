import React, { useEffect, useState } from "react";
import { FiUser, FiEdit2, FiSave, FiCamera } from "react-icons/fi";
import { useUpdateUser } from "../../../hooks/queryClient/mutator/user/update";
import { useForm } from "react-hook-form";
import { FormField } from "../../../components/form/form-register";
import { useGetOrderList } from "../../../hooks/queryClient/query/order/use-get-list";
import OrderHistory from "./OrderHistory";
import UserProduct from "./UserProduct";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useGetUser } from "../../../hooks/queryClient/query/user";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      company: user?.company,
      city: user?.city,
      role: user?.role,
      avatar: user?.avatar ? [user.avatar] : [],
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const { data: orderList } = useGetOrderList("Confirmed", 0, 10);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ? user.avatar.toString() : null
  );
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue("avatar", [file], { shouldDirty: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (isDirty) {
        await updateUser(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 mt-20 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#C8A846] text-white px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {t("profile.account_information")}
                </h1>
                <p className="mt-2 text-gray-300">
                  {t("profile.manage_your_personal_information")}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                {isEditing == false && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <>
                      <FiEdit2 className="mr-2" /> {t("profile.edit")}
                    </>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4 relative group">
                    <input
                      type="file"
                      disabled={!isEditing}
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-16 h-16 text-gray-400" />
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiCamera className="text-white text-2xl" />
                    </label>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.role}</p>
                </div>

                {[
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "address",
                  "company",
                  "city",
                ].map((field) => {
                  const label =
                    t(`profile_fields.${field}`).charAt(0).toUpperCase() +
                    t(`profile_fields.${field}`).slice(1);
                  return (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <FormField
                          key={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          className={`pl-10 w-full py-3 border ${
                            isEditing
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-50"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          {...register(
                            field as
                              | "firstName"
                              | "lastName"
                              | "email"
                              | "phone"
                              | "address"
                              | "company"
                              | "city",
                            { required: true }
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="mr-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isDirty}
                    className={clsx(
                      "px-6 py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors flex items-center",
                      {
                        "bg-gray-200 text-gray-400 cursor-not-allowed":
                          !isDirty,
                      }
                    )}
                  >
                    {isUpdating ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          <OrderHistory orderList={orderList} />
          <UserProduct />
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Need help? Contact us at: thinhvinhp@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
