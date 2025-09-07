import { UserType } from "@/shared/types/user";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FiUser, FiCamera, FiSave, FiEdit2 } from "react-icons/fi";
import { isDirty } from "zod";
import { FormField } from "./form-register";
import { useState } from "react";
import PhotoUploadWidget from "../PhotoUploadWidget";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
type FormProfileProps = {
  user: UserType;
  onSubmit: (data: UserType) => void;
  handleSubmit: (onSubmit: (data: any) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: any;
  setValue: any;
  formState: { isDirty: boolean; isSubmitting: boolean };
  isEditing: boolean;
  isUpdating: boolean;
  setIsEditing: (value: boolean) => void;
};

export default function FormProfile({
  user,
  onSubmit,
  handleSubmit,
  register,
  setValue,
  isEditing,
  isUpdating,
  setIsEditing,
}: FormProfileProps) {
  const { t } = useTranslation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ? user.avatar.toString() : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handlePhotoUpload = (blob: Blob) => {
    setIsUploading(true);
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    setValue("avatar", [file], { shouldDirty: true });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setIsUploading(false);
      setShowPhotoUpload(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
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
                  type="button"
                  disabled={!isEditing}
                  id="avatar-upload"
                  className="hidden"
                  onClick={() => setShowPhotoUpload(true)}
                />
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A846]"></div>
                  </div>
                ) : avatarPreview ? (
                  <Zoom>
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </Zoom>
                ) : (
                  <FiUser className="w-16 h-16 text-gray-400" />
                )}
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FiCamera className="text-white text-2xl" />
                  </label>
                )}
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
                    "bg-gray-200 text-gray-400 cursor-not-allowed": !isDirty,
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

      <Dialog 
        open={showPhotoUpload} 
        onClose={() => setShowPhotoUpload(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t("profile.upload_profile_photo")}
          <IconButton onClick={() => setShowPhotoUpload(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PhotoUploadWidget onUpload={handlePhotoUpload} />
        </DialogContent>
      </Dialog>
    </>
  );
}
