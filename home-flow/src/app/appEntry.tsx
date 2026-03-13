import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/shared/index.css";
import { RouterProvider } from "react-router";
import { appRouter } from "./appRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>,
);
