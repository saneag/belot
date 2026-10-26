import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { ThemeContextProvider } from "@belot/components";

import { AuthProvider } from "@/auth/authContext";
import { readInitialTheme } from "@/helpers/themeHelpers";
import { router } from "@/routes/router.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeContextProvider initialTheme={readInitialTheme()}>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </AuthProvider>
  </StrictMode>,
);
