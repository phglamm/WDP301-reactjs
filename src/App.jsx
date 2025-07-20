import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HealthProfile from "./pages/HealthProfile/HealthProfile";
import DrugInfo from "./pages/DrugInfo/DrugInfo";
import VaccineReminder from "./pages/VaccineReminder/VaccineReminder";
import NurseLayout from "./layouts/NurseLayout/NurseLayout";
import StudentListPage from "./pages/Nurse/StudentListPage/StudentListPage";
import ParentRequest from "./pages/Nurse/ParentRequest/ParentRequest";
import MedicineStorage from "./pages/Nurse/MedicineStorage/MedicineStorage";
import HealthHistory from "./pages/HealthHistory/HealthHistory";
import { logout } from "./redux/features/userSlice";
import InjectionEvent from "./pages/Nurse/InjectionEvent/InjectionEvent";
import Appointment from "./pages/Nurse/Appointment/Appointment";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.user?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user needs to be authenticated
    if (requireAuth && !isAuthenticated) {
      logOut();
      return;
    }

    // Check if user has the required role
    if (
      isAuthenticated &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(userRole)
    ) {
      logOut();
      return;
    }
  }, [isAuthenticated, userRole, allowedRoles, requireAuth, dispatch]);

  const logOut = () => {
    // Dispatch logout action - adjust this based on your Redux store structure
    dispatch(logout()); // or dispatch(logout()) if you have a logout action creator

    // Clear any stored tokens/data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login will be handled by the Navigate component below
  };

  // If not authenticated and auth is required, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but doesn't have required role, redirect to login
  if (
    isAuthenticated &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const router = createBrowserRouter([
    // Public routes (no authentication required)
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    // Protected User Routes
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["user", "parent", "admin"]}>
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "health-profile",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent", "admin"]}>
              <HealthProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "drug-information",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent", "admin"]}>
              <DrugInfo />
            </ProtectedRoute>
          ),
        },
        {
          path: "vaccine-reminder",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent", "admin"]}>
              <VaccineReminder />
            </ProtectedRoute>
          ),
        },
        {
          path: "health-history",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent", "admin"]}>
              <HealthHistory />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Protected Nurse Routes
    {
      path: "/nurse",
      element: (
        <ProtectedRoute allowedRoles={["nurse", "admin"]}>
          <NurseLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "studentlist",
          element: (
            <ProtectedRoute allowedRoles={["nurse", "admin"]}>
              <StudentListPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "parentrequest",
          element: (
            <ProtectedRoute allowedRoles={["nurse", "admin"]}>
              <ParentRequest />
            </ProtectedRoute>
          ),
        },
        {
          path: "medicine",
          element: (
            <ProtectedRoute allowedRoles={["nurse", "admin"]}>
              <MedicineStorage />
            </ProtectedRoute>
          ),
        },
        {
          path: "injection-event",
          element: (
            <ProtectedRoute allowedRoles={["nurse", "admin"]}>
              <InjectionEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: "appointment",
          element: (
            <ProtectedRoute allowedRoles={["nurse", "admin"]}>
              <Appointment />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/manager",
      element: (
        // <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerLayout />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: "manager-slot",
          element: <ManagerSlotPage />,
        },
      ],
    },

    // Catch all route - redirect to login if not authenticated, otherwise to home
  ]);

  return <RouterProvider router={router} />;
}

export default App;
