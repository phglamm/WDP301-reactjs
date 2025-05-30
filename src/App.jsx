import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HealthProfile from "./pages/HealthProfile/HealthProfile";
import DrugInfo from "./pages/DrugInfo/DrugInfo";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/health-profile",
          element: <HealthProfile />,
        },
        {
          path: "/drug-information",
          element: <DrugInfo/>,
        }
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
