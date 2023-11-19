import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Users from "./pages/users";
import Downloads from "./pages/downloads";
import PrivateRoute from "./components/PrivateRoute";

import "react-loading-skeleton/dist/skeleton.css";
import Rules from "./pages/rules";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/emails",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/downloads",
    element: (
      <PrivateRoute>
        <Downloads />
      </PrivateRoute>
    ),
  },
  {
    path: "rules",
    element: (
      <PrivateRoute>
        <Rules />
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
