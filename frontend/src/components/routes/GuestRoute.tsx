import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router";

export const GuestRoute = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (currentUser && currentUser.userId) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
