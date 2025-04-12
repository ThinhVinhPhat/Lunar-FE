import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import instance from "../api";
import LoadingSpinner from "../components/ui/LoadingSpinner";

type AuthContextType = {
  isAdmin: boolean;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken && refreshToken) {
      instance
        .post("/auth/refresh-token", { refreshToken })
        .then((res) => {
          Cookies.set("accessToken", res.data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
        })
        .catch(() => {
          Cookies.remove("accessToken");
          window.location.href = "/login";
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ isAdmin: true }}>
      {children}
    </AuthContext.Provider>
  );
};
