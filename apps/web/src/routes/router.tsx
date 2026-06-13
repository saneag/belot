import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import GameTablePage from "@/pages/game-table";
import PlayersSelectionPage from "@/pages/players-selection";
import SettingsPage from "@/pages/settings";
import StartingPage from "@/pages/starting-page";

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
