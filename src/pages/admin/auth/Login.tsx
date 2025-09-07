import { zodResolver } from "@hookform/resolvers/zod";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "@/shared/components/form/form-register";
import { AuthProps, isAlreadyLoginAuth } from "@/shared/components/wrapper/withAuth";
import { login } from "@/lib/api/service/auth.service";
import Cookies from "js-cookie";
import { UserService } from "@/lib/api/service/user.service";
import { Role } from "@/shared/types";
const schema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }),
});

const AdminLogin: React.FC<AuthProps> = () => {
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await login({
      email: data.email,
      password: data.password,
    });

    Cookies.set("accessToken", response.accessToken);
    Cookies.set("refreshToken", response.refreshToken);

    const user = await UserService.getUser();
    if (user) {
      if (user.data.role === Role.ADMIN || user.data.role === Role.ENGINEER) {
        navigate(
          user.data.role === Role.ADMIN ? "admin/dashboard" : "admin/products"
        );
        enqueueSnackbar("Login Success", { variant: "success" });
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        enqueueSnackbar(
          "Login Failed! You are not authorized to access this page",
          {
            variant: "error",
          }
        );
      }
    }
  };
  return (
    <>
      <div className="min-h-screen mt-20 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-gray-600">Lunar Shop Admin</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {["email", "password"].map((field) => (
                <div>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <FormField
                    isPassword={field === "password"}
                    onClick={() => setIsRevealPassword(!isRevealPassword)}
                    className="w-full border-none bg-gray-100 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                    type={field === "password" ? "password" : "text"}
                    placeholder={field === "password" ? "Password" : "Email"}
                    {...register(field as "email" | "password", {
                      required: true,
                    })}
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
                    className="h-4 w-4 border-gray-300 rounded text-[#C8A846] focus:ring-[#C8A846]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isDirty}
                className={`w-full bg-[#C8A846] text-white py-3 rounded-md transition-colors ${
                  !isDirty
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#ae923e]"
                }`}
              >
                {!isDirty ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const WAdminProduct = isAlreadyLoginAuth(AdminLogin);

export default WAdminProduct;
