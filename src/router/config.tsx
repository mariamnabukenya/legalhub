
import { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../pages/home/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const AdminLoginPage = lazy(() => import("../pages/admin/LoginPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
