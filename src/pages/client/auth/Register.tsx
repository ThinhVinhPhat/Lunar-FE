
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "@/components/form/form-register";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRegister } from "@/lib/hooks/queryClient/mutator/auth/auth.mutator";
import { AuthProps, isAlreadyLoginAuth } from "@/components/wrapper/withAuth";
import { RegisterInterface } from "@/lib/api/service/auth.service";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm password is required" }),
});

const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  return score;
};

const getStrengthColor = (score: number): string => {
  switch (score) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-400";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

const Register: React.FC<AuthProps> = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: registerUser, isPending: isPendingRegister } =
    useRegister();
  const passwordValue = watch("password");
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(passwordValue),
    [passwordValue]
  );

  const onSubmit = async (data: RegisterInterface) => {
    await registerUser(data);
    reset();
    navigate(`/verify-register/${data.email}`);
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
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <FormField
                    label={field}
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
                    {...register(
                      field as
                        | "email"
                        | "password"
                        | "confirmPassword"
                        | "firstName"
                        | "lastName"
                    )}
                  />
                  {field === "password" && (
                    <div className="mt-2 h-2 w-full bg-gray-200 rounded-md overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor(
                          passwordStrength
                        )} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  )}

                  {errors[field as keyof typeof errors] && (
                    <p className="text-red-700 text-sm mt-1">
                      {errors[field as keyof typeof errors]?.message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isPendingRegister}
                className={`w-full bg-[#C8A846] hover:bg-[#b69339] text-white py-3 rounded-md transition-colors ${
                  isPendingRegister ? "opacity-70 cursor-not-allowed" : ""
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

const WRegister = isAlreadyLoginAuth(Register);

export default WRegister;
