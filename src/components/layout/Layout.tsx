import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { useContextProvider } from "@/hooks/useContextProvider";
import { UserHeader } from "./UserHeader";
import ScrollToTop from "@/ultis/ScrollToTop";

export const Layout = () => {
  const { isLogin } = useContextProvider();
  return (
    <div>
      <ScrollToTop />
      {isLogin ? (
        <>
          <UserHeader />
        </>
      ) : (
        <Header />
      )}
      <Outlet />
      <Footer />
    </div>
  );
};
