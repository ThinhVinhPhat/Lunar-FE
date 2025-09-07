import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import { UserHeader } from "./UserHeader";
import ScrollToTop from "@/lib/ultis/ScrollToTop";
import { Box } from "@mui/material";

export const Layout = () => {
  const { isLogin } = useContextProvider();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {isLogin ? (
        <UserHeader />
      ) : (
        <Header />
      )}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};


