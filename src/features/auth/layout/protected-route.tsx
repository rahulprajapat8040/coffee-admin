import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/lib/data/routes.data";
import { useAuthStore } from "@/stores/auth.store";
import { FullScreenLoader } from "@/components/common/loader";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore(); // Replace with real auth state
  if (isLoading) {
    return <FullScreenLoader />;
  }
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
