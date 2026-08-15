import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!currentUser || !currentUser.userId) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser && !currentUser.profile) {
    return <Navigate to="/profile/new" replace />;
  }

  return <Outlet />;
};
