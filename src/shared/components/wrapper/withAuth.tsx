import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { UserType } from "@/shared/types/user";
import { Navigate } from "react-router-dom";
import IsLoadingWrapper from "./isLoading";
import { Role } from "@/shared/types";

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
    const { data: user, isLoading } = useGetUser();
    if (user?.role !== "Engineer" && user?.role !== "Admin") {
      return <Navigate to="/admin/login" />;
    }

    return (
      <IsLoadingWrapper isLoading={isLoading}>
        <WrappedComponent {...props} user={user} />
      </IsLoadingWrapper>
    );
  };
};

export const isAlreadyLoginAuth = <P extends AuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { data: user, isLoading } = useGetUser();

    const pathname = location.pathname;

    if (
      pathname === "/admin/login" &&
      (user?.role === "Admin" || user?.role === "Engineer")
    ) {
      return (
        <IsLoadingWrapper isLoading={isLoading}>
          <Navigate
            to={user?.role === "Admin" ? "/admin/dashboard" : "/admin/products"}
          />
        </IsLoadingWrapper>
      );
    }

    if ((pathname === "/login" || pathname === "/register") && user) {
      return (
        <IsLoadingWrapper isLoading={isLoading}>
          <Navigate to="/" />
        </IsLoadingWrapper>
      );
    }
    return (
      <IsLoadingWrapper isLoading={isLoading}>
        <WrappedComponent {...props} user={user} />
      </IsLoadingWrapper>
    );
  };
};

type RequireRoleProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { data: user, isLoading } = useGetUser();

  if (isLoading == false) {
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/admin/unauthorized" replace />;
    }
  }

  return children;
}
