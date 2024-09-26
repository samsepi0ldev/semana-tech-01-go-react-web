import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
