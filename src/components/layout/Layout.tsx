import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { useContextProvider } from "../../../src/hooks/useContextProvider";
import { UserHeader } from "./UserHeader";

export const Layout = () => {
  const { currentUser } = useContextProvider();
  return (
    <div>
      {currentUser ? (
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
