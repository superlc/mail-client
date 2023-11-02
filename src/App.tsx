import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
