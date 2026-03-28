import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import PlayersSelectionPage from "@/pages/players-selection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <PlayersSelectionPage />,
      },
      {
        path: "/game-table",
        // TODO: add game table page
        element: <div>Not found</div>,
      },
    ],
  },
]);
