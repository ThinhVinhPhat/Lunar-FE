import React, { useState, useEffect } from "react";
import { UserType } from "../../../types/user";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiEdit2,
  FiSave,
  FiPhone,
} from "react-icons/fi";
import { useContextProvider } from "../../../hooks/useContextProvider";
import { useNavigate } from "react-router-dom";
import { useUpdateUser } from "../../../hooks/queryClient/mutator/user/update";

const Profile: React.FC = () => {
  const { currentUser } = useContextProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: updateUser } = useUpdateUser();

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    } else {
      navigate("/login");
    }
  }, [currentUser]);

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
      toast.success("Profile information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("An error occurred while updating your information.");
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
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <FiSave className="mr-2" /> Save Information
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="mr-2" /> Edit
                    </>
                  )}
                </button>
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
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  <p className="text-gray-600">{currentUser?.role}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={currentUser?.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={currentUser?.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={currentUser?.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      value={currentUser?.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={currentUser?.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="city"
                      value={currentUser?.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={currentUser?.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full py-3 border ${
                        isEditing
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(currentUser);
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
