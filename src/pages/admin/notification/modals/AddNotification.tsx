import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import {
  NotificationType,
  NotificationTemplate,
} from "@/types/notification";
import { useEffect } from "react";
import { CreateNotificationParams, UpdateNotificationParams } from "@/lib/api/service/notification.service";
import { Role } from "@/types";
type AddNotificationModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentNotification?: NotificationTemplate | undefined;
  onSubmitNotification: (data: CreateNotificationParams) => void;
  onUpdateNotification: (data: UpdateNotificationParams) => void;
};

export const AddNotificationModal = ({
  showModal,
  setShowModal,
  currentNotification,
  onSubmitNotification,
  onUpdateNotification,
}: AddNotificationModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<CreateNotificationParams>({
    defaultValues: {
      title: currentNotification?.title || "",
      message: currentNotification?.message || "",
      type: currentNotification?.type || NotificationType.NEW_MESSAGE,
      targetRoles: currentNotification?.targetRoles || [],
      image: currentNotification?.image || [],
    },
  });

  useEffect(() => {
    if (currentNotification) {
      reset({
        title: currentNotification.title,
        message: currentNotification.message,
        type: currentNotification.type,
        targetRoles: currentNotification.targetRoles || [],
        image: currentNotification.image || [],
      });
    }
  }, [currentNotification]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setValue("image", newFiles as unknown as string[]);
  };

  const onSubmit = (data: CreateNotificationParams) => {
    if (currentNotification) {
      onUpdateNotification({
        ...data,
        status: currentNotification.status || false,
      });
    } else {
      onSubmitNotification(data);
    }
    reset();
    setShowModal(false);
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-xl z-50 w-full max-w-xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Create Notification</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium text-sm text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                  placeholder="Enter notification title"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">
                  Message
                </label>
                <textarea
                  rows={3}
                  {...register("message", { required: "Message is required" })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                  placeholder="Enter message"
                />
                {errors.message && (
                  <p className="text-red-600 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  {Object.values(NotificationType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-sm text-gray-700">
                  Target Roles
                </label>
                <Controller
                  control={control}
                  name="targetRoles"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.values(Role).map((role) => (
                        <label key={role} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            value={role}
                            checked={field.value?.includes(role) || false}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), role]
                                : field.value?.filter((r) => r !== role) || [];
                              field.onChange(newValue);
                            }}
                          />
                          {role}
                        </label>
                      ))}
                    </div>
                  )}
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
                        <span className="font-semibold">Click to upload</span>{" "}
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
              </div>

              {currentNotification && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <img
                    src={currentNotification?.image?.[0] || ""}
                    alt="Notification Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={clsx(
                    "px-4 py-2 rounded-md text-white",
                    isDirty
                      ? "bg-[#C8A846] hover:bg-[#897334]"
                      : "bg-[#C8A846] cursor-not-allowed"
                  )}
                  disabled={!isDirty}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};
