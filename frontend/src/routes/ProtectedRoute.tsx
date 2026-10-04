import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router";
import { paths } from "../components/routes/paths";

export const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

  if (!currentUser || !currentUser.userId) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.profile && location.pathname !== paths.profile.new) {
    return <Navigate to={paths.profile.new} replace />;
  }

  if (currentUser.profile && location.pathname === paths.profile.new) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <Outlet />;
};
