import React, { useState, useEffect } from "react";
import { UserType } from "../../../types/user";
import { enqueueSnackbar } from "notistack";
import { FiUser, FiEdit2, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUpdateUser } from "../../../hooks/queryClient/mutator/user/update";
import FormField from "../../../components/form/form-field";
import { useGetUser } from "../../../hooks/queryClient/query/user";

const Profile: React.FC = () => {
  const { data: me } = useGetUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: updateUser } = useUpdateUser();

  useEffect(() => {
    if (me) {
      setFormData(me);
    } else {
      navigate("/login");
    }
  }, [me, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setLoading(true);
      await updateUser(formData);
      enqueueSnackbar("Profile information updated successfully!", {
        variant: "success",
      });
      setIsEditing(false);
    } catch (error) {
      enqueueSnackbar("An error occurred while updating your information.", {
        variant: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 mt-20 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#C8A846] text-white px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Account Information</h1>
                <p className="mt-2 text-gray-300">
                  Manage your personal information
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                {isEditing == false && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <>
                      <FiEdit2 className="mr-2" /> Edit
                    </>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    <FiUser className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {me?.firstName} {me?.lastName}
                  </h2>
                  <p className="text-gray-600">{me?.role}</p>
                </div>

                {Object.keys(formData).map((field) => {
                  if (field === "id" || field === "role") return null;
                  return (
                    <FormField
                      key={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={formData[field as keyof UserType]}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  );
                })}
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(me);
                      setIsEditing(false);
                    }}
                    className="mr-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
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

          <div className="border-t border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#C8A846] mb-4">
              Order History
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">You don't have any orders yet.</p>
              <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#C8A846] mb-4">
                  Favorite Products
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">
                    You don't have any favorite products yet.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                    Explore Products
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#C8A846] mb-4">
                  Your Reviews
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">
                    You haven't reviewed any products yet.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                    View Purchased Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Need help? Contact us at: thinhvinhp@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
