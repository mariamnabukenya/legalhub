
import { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../pages/home/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const AdminLoginPage = lazy(() => import("../pages/admin/LoginPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const MarketplacePage = lazy(() => import("../pages/books/MarketplacePage"));
const PostBookPage = lazy(() => import("../pages/books/PostBookPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/books/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/books/post",
    element: <PostBookPage />,
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
