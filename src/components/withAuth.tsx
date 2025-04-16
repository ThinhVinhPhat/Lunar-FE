import { useGetUser } from "../hooks/queryClient/query/user";
import { UserType } from "@/types/user";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./ui/LoadingSpinner";

export type AuthProps = {
  user: UserType;
};

export const isLoginAuth = <P extends AuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { data: user, isLoading } = useGetUser();
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return <WrappedComponent {...props} user={user} />;
  };
};

export const isLoginAdminAuth = <P extends AuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { data: user } = useGetUser();
    if (user?.role !== "Admin") {
      return <Navigate to="/admin/login" />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

export const isAlreadyLoginAuth = <P extends AuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { data: user } = useGetUser();
    if (user?.role == "Admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    if (user) {
      return <Navigate to="/" />;
    }
    return <WrappedComponent {...props} user={user} />;
  };
};
