import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import NurseLayout from "./layouts/NurseLayout/NurseLayout";
import StudentListPage from "./pages/Nurse/StudentListPage/StudentListPage";
import ParentRequest from "./pages/Nurse/ParentRequest/ParentRequest";
import MedicineStorage from "./pages/Nurse/MedicineStorage/MedicineStorage";

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
          path:"studentlist",
          element: <StudentListPage/>
        },
         {
          path:"parentrequest",
          element: <ParentRequest/>
        },
        {
          path: "medicine",
          element: <MedicineStorage/>
        }
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
