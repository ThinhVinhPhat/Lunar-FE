import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useContextProvider } from "../../../../src/hooks/useContextProvider";
import { useForm } from "react-hook-form";
import { AuthType } from "@/types/user";
import { FormField } from "../../../components/form/form-register";
import { useLogin } from "../../../hooks/queryClient/mutator/auth/login";
import SocialLogin from "./SocialLogin";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthProps, isAlreadyLoginAuth } from "../../../components/withAuth";

const schema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const Login: React.FC<AuthProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const {  setIsLogin } = useContextProvider();
  const [isRevealPassword, setIsRevealPassword] = useState(false);

  const { mutateAsync: login, isPending: isPendingLogin } = useLogin();
  const navigate = useNavigate();


  const onSubmit = async (data: AuthType) => {
    const res = await login(data);
    console.log(res);
    if (res) {
      navigate("/");
      setIsLogin(true);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href =
      "https://glasses-store-be.onrender.com/api/v1/auth/google/login";
  };
  return (
    <>
      {isPendingLogin && <LoadingSpinner />}
      <div className="min-h-screen pt-32 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-gray-600">Welcome back to Lunar Shop</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {["email", "password"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <FormField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={
                      field === "password"
                        ? isRevealPassword
                          ? "text"
                          : "password"
                        : "text"
                    }
                    isPassword={field === "password"}
                    onClick={() => setIsRevealPassword(!isRevealPassword)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    {...register(field as "email" | "password", {
                      required: true,
                    })}
                    // error={errors[field as keyof typeof errors]}
                  />
                  {errors[field as keyof typeof errors] && (
                    <p className="text-red-700">
                      {errors[field as keyof typeof errors]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-gray-700 hover:text-gray-900 bg-primary-color"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPendingLogin}
                className={`w-full bg-[#C8A846] hover:bg-[#b69339] text-white py-3 rounded-md transition-colors ${
                  isPendingLogin
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#b69339]"
                }`}
              >
                {isPendingLogin ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#C8A846] hover:underline font-medium"
                >
                  Create one
                </Link>
              </p>
              <SocialLogin onGoogleLogin={handleGoogleLogin} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const WLogin = isAlreadyLoginAuth(Login);

export default WLogin;
