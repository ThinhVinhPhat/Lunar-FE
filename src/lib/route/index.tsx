import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/layout/Layout";
import { RequireRole } from "@/shared/components/wrapper/withAuth";
import { Role } from "@/shared/types";
import React from "react";

// Lazy-loaded components
const Home = React.lazy(() => import("@/pages/client/dashbroad/Home"));
const ProductDetail = React.lazy(() => import("@/pages/client/product/ProductDetail"));
const Login = React.lazy(() => import("@/pages/client/auth/Login"));
const Register = React.lazy(() => import("@/pages/client/auth/Register"));
const ForgotPassword = React.lazy(() => import("@/pages/client/auth/ForgotPassword"));
const Profile = React.lazy(() => import("@/pages/client/user/Profile"));
const ProductList = React.lazy(() => import("@/pages/client/product/ProductList"));
const Explore = React.lazy(() => import("@/pages/client/Explore"));
const PaymentResult = React.lazy(() => import("@/pages/client/PaymentResult"));
const CollectionList = React.lazy(() => import("@/pages/client/product/CollectionList"));
const OrderList = React.lazy(() => import("@/pages/client/order/OrderList"));
const NotFound = React.lazy(() => import("@/pages/client/NotFound"));
const VerifyRegister = React.lazy(() => import("@/pages/client/auth/VerifyRegister"));
const OrderTrack = React.lazy(() => import("@/pages/client/order/OrderTrack"));

const AdminLogin = React.lazy(() => import("@/pages/admin/auth/Login"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
const AdminAccount = React.lazy(() => import("@/pages/admin/account"));
const AdminCategory = React.lazy(() => import("@/pages/admin/category"));
const AdminProduct = React.lazy(() => import("@/pages/admin/product"));
const Setting = React.lazy(() => import("@/pages/admin/Setting"));
const Order = React.lazy(() => import("@/pages/admin/Order"));
const MessagePage = React.lazy(() => import("@/pages/admin/MessagePage"));
const AdminProfile = React.lazy(() => import("@/pages/admin/user/Profile"));
const NotificationPage = React.lazy(() => import("@/pages/admin/notification/NotificationPage"));
const Unauthorized = React.lazy(() => import("@/pages/admin/Unauthorized"));
const Discount = React.lazy(() => import("@/pages/client/user/DiscountPage"));
const DiscountAdmin = React.lazy(() => import("@/pages/admin/discount/index"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <React.Suspense fallback={<div>Loading...</div>}><Home /></React.Suspense>,
      },
      {
        path: "/product/:id",
        element: <React.Suspense fallback={<div>Loading...</div>}><ProductDetail /></React.Suspense>,
      },
      {
        path: "/login",
        element: <React.Suspense fallback={<div>Loading...</div>}><Login /></React.Suspense>,
      },
      {
        path: "/profile",
        element: <React.Suspense fallback={<div>Loading...</div>}><Profile /></React.Suspense>,
      },
      {
        path: "/orders",
        element: <React.Suspense fallback={<div>Loading...</div>}><OrderList /></React.Suspense>,
      },
      {
        path: "/products/:type",
        element: <React.Suspense fallback={<div>Loading...</div>}><ProductList /></React.Suspense>,
      },
      {
        path: "/collections/:type",
        element: <React.Suspense fallback={<div>Loading...</div>}><CollectionList /></React.Suspense>,
      },
      {
        path: "/register",
        element: <React.Suspense fallback={<div>Loading...</div>}><Register /></React.Suspense>,
      },
      {
        path: "/forgot-password",
        element: <React.Suspense fallback={<div>Loading...</div>}><ForgotPassword /></React.Suspense>,
      },
      {
        path: "/admin/login",
        element: <React.Suspense fallback={<div>Loading...</div>}><AdminLogin /></React.Suspense>,
      },
      {
        path: "/explore",
        element: <React.Suspense fallback={<div>Loading...</div>}><Explore /></React.Suspense>,
      },
      {
        path: "/*",
        element: <React.Suspense fallback={<div>Loading...</div>}><NotFound /></React.Suspense>,
      },
      {
        path: "/verify-register/:email",
        element: <React.Suspense fallback={<div>Loading...</div>}><VerifyRegister /></React.Suspense>,
      },
      {
        path: "/order/track/:id",
        element: <React.Suspense fallback={<div>Loading...</div>}><OrderTrack /></React.Suspense>,
      },
      {
        path: "/discount",
        element: <React.Suspense fallback={<div>Loading...</div>}><Discount /></React.Suspense>,
      },
      {
        path: "/api/v1/payment/success",
        element: <React.Suspense fallback={<div>Loading...</div>}><PaymentResult status={"success"} /></React.Suspense>,
      },
      {
        path: "/api/v1/payment/failed",
        element: <React.Suspense fallback={<div>Loading...</div>}><PaymentResult status={"failed"} /></React.Suspense>,
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
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN]}>
              <AdminDashboard />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/accounts",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN]}>
              <AdminAccount />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/categories",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
              <AdminCategory />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
              <AdminProduct />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
              <Order />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/settings",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN]}>
              <Setting />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/message/:id",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
              <MessagePage />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
              <AdminProfile />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/notifications",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN]}>
              <NotificationPage />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/discounts",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RequireRole allowedRoles={[Role.ADMIN]}>
              <DiscountAdmin />
            </RequireRole>
          </React.Suspense>
        ),
      },
      {
        path: "/admin/unauthorized",
        element: <React.Suspense fallback={<div>Loading...</div>}><Unauthorized /></React.Suspense>,
      },
    ],
  },
  {
    path: "/api/v1/payment/success",
    element: <React.Suspense fallback={<div>Loading...</div>}><PaymentResult status={"success"} /></React.Suspense>,
  },
  {
    path: "/api/v1/payment/failed",
    element: <React.Suspense fallback={<div>Loading...</div>}><PaymentResult status={"failed"} /></React.Suspense>,
  },
]);


