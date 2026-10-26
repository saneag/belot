import { lazy } from "react";

import { createBrowserRouter } from "react-router-dom";

import App from "@/App";

const GameTablePage = lazy(() => import("@/pages/game-table"));
const DevToolsPage = lazy(() => import("@/pages/dev-tools"));
const PlayersSelectionPage = lazy(() => import("@/pages/players-selection"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const StartingPage = lazy(() => import("@/pages/starting-page"));
const AuthPage = lazy(() => import("@/pages/auth"));

export const router = createBrowserRouter([
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <StartingPage />,
      },
      {
        path: "/players-selection",
        element: <PlayersSelectionPage />,
      },
      {
        path: "/game-table",
        element: <GameTablePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/dev-tools",
        element: <DevToolsPage />,
      },
    ],
  },
]);
