import { useEffect, useState } from "react";
import { useUpdateUser } from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import { useForm } from "react-hook-form";
import OrderHistory from "./OrderHistory";
import UserProduct from "./UserProduct";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useNavigate } from "react-router-dom";
import FormProfile from "@/components/form/form-profile";
import { UserType } from "@/types/user";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
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

  const onSubmit = async (data: UserType) => {
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
          <FormProfile
            user={user}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            register={register}
            setValue={setValue}
            formState={{ isDirty, isSubmitting: isUpdating }}
            isEditing={isEditing}
            isUpdating={isUpdating}
            setIsEditing={setIsEditing}
          />
          <OrderHistory />
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
