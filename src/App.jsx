import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HealthProfile from "./pages/HealthProfile/HealthProfile";
import DrugInfo from "./pages/DrugInfo/DrugInfo";
import VaccineReminder from "./pages/VaccineReminder/VaccineReminder";
import "./App.css";
import NurseLayout from "./layouts/NurseLayout/NurseLayout";
import StudentListPage from "./pages/Nurse/StudentListPage/StudentListPage";
import ParentRequest from "./pages/Nurse/ParentRequest/ParentRequest";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout />,
      children: [
        {
          path: "",
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
          element: <DrugInfo />,
        },
        {
          path: "/vaccine-reminder",
          element: <VaccineReminder />,
        },
      ],
    },
    {
      path: "/nurse",
      element: <NurseLayout />,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "studentlist",
          element: <StudentListPage />,
        },
        {
          path: "parentrequest",
          element: <ParentRequest />,
        },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
