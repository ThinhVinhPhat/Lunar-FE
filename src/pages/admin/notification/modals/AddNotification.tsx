import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import {
  NotificationType,
  NotificationTemplate,
  Role,
} from "@/types/notification";
import { useEffect } from "react";

type AddNotificationModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentNotification?: NotificationTemplate | undefined;
  onSubmitNotification: (data: NotificationTemplate) => void;
  onUpdateNotification: (data: NotificationTemplate) => void;
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
  } = useForm<NotificationTemplate>({
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
    console.log(newFiles);
    setValue("image", newFiles as unknown as string[]);
  };

  const onSubmit = (data: NotificationTemplate) => {
    console.log(data);

    if (currentNotification) {
      onUpdateNotification(data);
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
                <label className="block font-medium text-sm text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
              </div>

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
