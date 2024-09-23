import { Outlet, useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthGuard from "../wrapper/AuthGuard";
import Guard from "../wrapper/Guard";
import Chart from "../pages/Chart";

export default function Main() {
  return useRoutes([
    {
      path: "/",
      element: (
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/chart",
          element: <Chart />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <Guard>
          <Outlet />
        </Guard>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },

    {
      path: "*",
      element: <h1>Not Found</h1>,
    },
  ]);
}
