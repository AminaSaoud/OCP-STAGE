import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/AuthPage";
import AdminLogin from "../pages/Admin/AdminAuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
   {
    path: "/login", 
    element: <Login />,
  },



  {
    path: "/admin/login", 
    element: <AdminLogin />,
  }
]);
