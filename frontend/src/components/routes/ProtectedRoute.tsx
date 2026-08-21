import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!currentUser || !currentUser.userId) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.profile && location.pathname !== "/profile/new") {
    return <Navigate to="/profile/new" replace />;
  }

  return <Outlet />;
};
