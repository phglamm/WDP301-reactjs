import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HealthProfile from "./pages/HealthProfile/HealthProfile";
import DrugInfo from "./pages/DrugInfo/DrugInfo";
import VaccineReminder from "./pages/VaccineReminder/VaccineReminder";
import HealthHistory from "./pages/HealthHistory/HealthHistory";
import Profile from "./pages/Profile/ProfilePage";

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
        },
        {
          path: "/vaccine-reminder",
          element: <VaccineReminder/>,
        },
        {
          path: "/health-history",
          element: <HealthHistory/>,
        },
        {
          path: "/profile",
          element: <Profile/>,
        }
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
