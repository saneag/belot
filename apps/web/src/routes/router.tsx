import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "@/App";

const GameTablePage = lazy(() => import("@/pages/game-table"));
const PlayersSelectionPage = lazy(() => import("@/pages/players-selection"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const StartingPage = lazy(() => import("@/pages/starting-page"));

export const router = createBrowserRouter([
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
    ],
  },
]);
