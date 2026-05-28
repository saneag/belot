import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import GameTableScreen from "@/pages/game-table";
import PlayersSelectionPage from "@/pages/players-selection";
import StartingScreen from "@/pages/starting-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <StartingScreen />,
      },
      {
        path: "/players-selection",
        element: <PlayersSelectionPage />,
      },
      {
        path: "/game-table",
        element: <GameTableScreen />,
      },
    ],
  },
]);
