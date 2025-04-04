import { QueryProvider } from "./providers/query-provider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/index.tsx";
import { ContextProvider } from "./context/context-provider.tsx";
import { SnackbarProvider } from "notistack";

const AppWrapper = () => {

  return (
    <QueryProvider>
      <ContextProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ContextProvider>
    </QueryProvider>
  );
};

export default AppWrapper;
