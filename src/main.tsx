import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { QueryProvider } from "./providers/query-provider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/index.tsx";
import { ContextProvider } from "./context/context-provider.tsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ContextProvider>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
      </ContextProvider>
    </QueryProvider>
  </StrictMode>
);
