import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PlayersSelectionPage from './pages/players-selection';
import Layout from './components/layout';
import GameTablePage from './pages/game-table';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PlayersSelectionPage />,
      },
      {
        path: '/game-table',
        element: <GameTablePage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
