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
import AdminAccount from "../pages/admin/Account";
import AdminCategory from "../pages/admin/Catrgory";
import Permissions from "../pages/admin/Premission";
import AdminProduct from "../pages/admin/Product";
import AdminLayout from "../components/admin/layout/Layout";

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
        path: "/products/:type",
        element: <ProductList />,
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
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/accounts",
        element: <AdminAccount />,
      },
      {
        path: "/admin/categories",
        element: <AdminCategory />,
      },
      {
        path: "/admin/products",
        element: <AdminProduct />,
      },
      {
        path: "/admin/permissions",
        element: <Permissions />,

      }
    ],
  },
  {
    path: "/api/v1/payment/success",
    element: <PaymentResult status={"success"} />,
  },
  {
    path: "/payment/failed",
    element: <PaymentResult status={"failed"} />,
  },
]);
