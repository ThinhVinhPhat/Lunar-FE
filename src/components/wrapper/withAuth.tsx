import { useGetUser } from "../../hooks/queryClient/query/user";
import { UserType } from "@/types/user";
import { Navigate } from "react-router-dom";
import IsLoadingWrapper from "./isLoading";

export type AuthProps = {
  user?: UserType;
};

export const isLoginAuth = <P extends AuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { data: user, isLoading } = useGetUser();
    if (!user) {
      return <Navigate to="/login" />;
    }
    return (
      <IsLoadingWrapper isLoading={isLoading}>
        <WrappedComponent {...props} user={user} />
      </IsLoadingWrapper>
    );
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
