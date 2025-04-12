import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useGetUser } from "../../../hooks/queryClient/query/user";
import { useForm } from "react-hook-form";
import { AuthType } from "@/types/user";
import { FormField } from "../../../components/form/form-register";
import { useRegister } from "../../../hooks/queryClient/mutator/auth/register";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: registerUser, isPending: isPendingRegister } =
    useRegister();
  const { data: me } = useGetUser();

  useEffect(() => {
    if (me) {
      navigate("/");
    }
  }, [me, navigate]);

  const onSubmit = async (data: AuthType) => {
    const response = await registerUser(data);
    if (response) {
      reset();
      navigate("/login");
    }
  };

  return (
    <>
      {isPendingRegister && <LoadingSpinner />}
      <div className="min-h-screen pt-32 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-600">Join the Lunar Shop community</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {[
                "firstName",
                "lastName",
                "email",
                "password",
                "confirmPassword",
              ].map((field) => (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <FormField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={
                      field === "password" || field === "confirmPassword"
                        ? isRevealPassword
                          ? "text"
                          : "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    isPassword={
                      field === "password" || field === "confirmPassword"
                    }
                    onClick={() =>
                      field === "password" || field === "confirmPassword"
                        ? setIsRevealPassword(!isRevealPassword)
                        : null
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    // error={errors[field as keyof typeof errors]}
                    {...register(
                      field as
                        | "email"
                        | "password"
                        | "confirmPassword"
                        | "first_name"
                        | "last_name",
                      { required: true }
                    )}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isPendingRegister}
                className={`w-full bg-[#C8A846] hover:bg-[#b69339] text-white py-3 rounded-md transition-colors ${
                  isPendingRegister
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#b69339]"
                }`}
              >
                {isPendingRegister ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
