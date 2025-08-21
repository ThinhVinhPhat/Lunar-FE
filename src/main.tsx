import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/lib/css/index.css";
import AppWrapper from "./App.tsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
