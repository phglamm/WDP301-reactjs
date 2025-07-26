import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import UserLayout from "./layouts/UserLayout/UserLayout";

import NurseLayout from "./layouts/NurseLayout/NurseLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

import { logout } from "./redux/features/userSlice";

import UnderM from "./pages/UnderMaintainance/UnderM";
import Login from "./pages/AuthPages/Login/Login";
import Register from "./pages/AuthPages/Register/Register";
import Homepage from "./pages/UserPages/Homepage/Homepage";
import HealthProfile from "./pages/UserPages/HealthProfile/HealthProfile";
import DrugInfo from "./pages/UserPages/DrugInfo/DrugInfo";
import VaccineReminder from "./pages/UserPages/VaccineReminder/VaccineReminder";
import HealthHistory from "./pages/UserPages/HealthHistory/HealthHistory";
import StudentListPage from "./pages/NursePages/StudentListPage/StudentListPage";
import ParentRequest from "./pages/NursePages/ParentRequest/ParentRequest";
import MedicineStorage from "./pages/NursePages/MedicineStorage/MedicineStorage";
import InjectionEvent from "./pages/NursePages/InjectionEvent/InjectionEvent";
import HealthEvent from "./pages/NursePages/HealthEvent/HealthEvent";
import Appointment from "./pages/NursePages/Appointment/Appointment";
import UserManagement from "./pages/AdminPages/UserManagement/UserManagement";
import ParentAppointment from "./pages/ParentAppointment/ParentAppointment";
import Profile from "./pages/Profile/ProfilePage";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.user?.role);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    // Dispatch logout action - adjust this based on your Redux store structure
    dispatch(logout()); // or dispatch(logout()) if you have a logout action creator

    // Clear any stored tokens/data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login will be handled by the Navigate component below
  }, [dispatch]);

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
  }, [isAuthenticated, userRole, allowedRoles, requireAuth, logOut]);

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
    }, // Protected User Routes
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["user", "parent"]}>
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
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <HealthProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "drug-information",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <DrugInfo />
            </ProtectedRoute>
          ),
        },
        {
          path: "vaccine-reminder",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <VaccineReminder />
            </ProtectedRoute>
          ),
        },
        {
          path: "health-history",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <HealthHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "parent-appointment",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <ParentAppointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute allowedRoles={["user", "parent"]}>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    }, // Protected Nurse Routes
    {
      path: "/nurse",
      element: (
        <ProtectedRoute allowedRoles={["nurse"]}>
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
            <ProtectedRoute allowedRoles={["nurse"]}>
              <StudentListPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "parentrequest",
          element: (
            <ProtectedRoute allowedRoles={["nurse"]}>
              <ParentRequest />
            </ProtectedRoute>
          ),
        },
        {
          path: "medicine",
          element: (
            <ProtectedRoute allowedRoles={["nurse"]}>
              <MedicineStorage />
            </ProtectedRoute>
          ),
        },
        {
          path: "injection-event",
          element: (
            <ProtectedRoute allowedRoles={["nurse"]}>
              <InjectionEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: "health-event",
          element: (
            <ProtectedRoute allowedRoles={["nurse"]}>
              <HealthEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: "appointment",
          element: (
            <ProtectedRoute allowedRoles={["nurse"]}>
              <Appointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <UnderM />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "userManagement",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "parentrequest",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <ParentRequest />
            </ProtectedRoute>
          ),
        },
        {
          path: "medicine",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <MedicineStorage />
            </ProtectedRoute>
          ),
        },
        {
          path: "injection-event",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <InjectionEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: "health-event",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <HealthEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: "appointment",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Appointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <UnderM />,
        },
      ],
    },

    // Catch all route for undefined paths
    {
      path: "*",
      element: <UnderM />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
