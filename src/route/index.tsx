import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import AdminLogin from "../pages/admin/auth/Login";
import AdminDashboard from "../pages/admin/dashboard";
import Login from "../pages/client/auth/Login";
import Home from "../pages/client/dashbroad/Home";
import ProductDetail from "../pages/client/product/ProductDetail";
import Register from "../pages/client/auth/Register";
import ForgotPassword from "../pages/client/auth/ForgotPassword";
import Profile from "../pages/client/user/Profile";
import ProductList from "../pages/client/product/ProductList";
import Explore from "../pages/client/Explore";
import PaymentResult from "../pages/client/PaymentResult";
import AdminAccount from "../pages/admin/account";
import AdminCategory from "../pages/admin/category";
import AdminProduct from "../pages/admin/product";
import AdminLayout from "../components/admin/layout/Layout";
import CollectionList from "../pages/client/product/CollectionList";
import OrderList from "../pages/client/order/OrderList";
import NotFound from "../pages/client/NotFound";
import Setting from "../pages/admin/Setting";
import Order from "../pages/admin/Order";
import VerifyRegister from "../pages/client/auth/VerifyRegister";
import OrderTrack from "../pages/client/order/OrderTrack";
import MessagePage from "../pages/admin/MessagePage";
import AdminProfile from "../pages/admin/user/Profile";
import NotificationPage from "../pages/admin/notification/NotificationPage";
import { RequireRole } from "../components/wrapper/withAuth";
import { Role } from "../types/notification";
import Unauthorized from "../pages/admin/Unauthorized";
import WAdminDiscount from "@/pages/admin/discount";
import DiscountPage from "@/pages/client/user/DiscountPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/orders",
        element: <OrderList />,
      },
      {
        path: "/products/:type",
        element: <ProductList />,
      },
      {
        path: "/collections/:type",
        element: <CollectionList />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
      {
        path: "/verify-register/:email",
        element: <VerifyRegister />,
      },
      {
        path: "/order/track/:id",
        element: <OrderTrack />,
      },
      {
        path: "/discount",
        element: <DiscountPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN]}>
            <AdminDashboard />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/accounts",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN]}>
            <AdminAccount />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/categories",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
            <AdminCategory />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
            <AdminProduct />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
            <Order />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/settings",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN]}>
            <Setting />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/message/:id",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
            <MessagePage />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
            <AdminProfile />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/notifications",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN]}>
            <NotificationPage />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/discounts",
        element: (
          <RequireRole allowedRoles={[Role.ADMIN]}>
            <WAdminDiscount />,
          </RequireRole>
        ),
      },
      {
        path: "/admin/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: "/api/v1/payment/success",
    element: <PaymentResult status={"success"} />,
  },
  {
    path: "/api/v1/payment/failed",
    element: <PaymentResult status={"failed"} />,
  },
]);
