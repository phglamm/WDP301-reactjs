import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
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
        }
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
