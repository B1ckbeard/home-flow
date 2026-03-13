import { LoginPage } from "@/pages/auth/login";
import { RegistrationPage } from "@/pages/auth/registration";
import { MainPage } from "@/pages/main";
import { NotFoundPage } from "@/pages/notFound";
import { createBrowserRouter } from "react-router";
import { BaseLayout } from "./layouts/BaseLayout";

export const appRouter = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/register", element: <RegistrationPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);
