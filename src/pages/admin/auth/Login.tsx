import React, { useEffect, useState } from "react";
import { useLogin } from "../../../hooks/queryClient/mutator/auth/login";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useGetUser } from "../../../hooks/queryClient/query/user";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useContextProvider } from "../../../hooks/useContextProvider";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: mutate, isPending } = useLogin();
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { setIsAdmin } = useContextProvider();

  useEffect(() => {
    if (user?.role === "Admin") {
      setIsAdmin(true);
      navigate("/admin/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await mutate({ email, password });
    if (res) {
      if (user?.role === "Admin") {
        enqueueSnackbar("Login Success", { variant: "success" });
        setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        enqueueSnackbar(
          "Login Failed! You are not authorized to access this page",
          { variant: "error" }
        );
        setIsAdmin(false);
        navigate("/admin/login");
      }
    }
  };
  return (
    <>
      {isPending && <LoadingSpinner />}
      <div className="min-h-screen mt-20 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-gray-600">Lunar Shop Admin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                  required
                />
              </div>

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
                disabled={isPending}
                className={`w-full bg-[#C8A846] text-white py-3 rounded-md transition-colors ${
                  isPending
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#ae923e]"
                }`}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
