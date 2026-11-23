import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "@/lib/utils/constant/route-constant";
import { useAuthStore } from "@/lib/stores/auth.store";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Checking staff access...
      </div>
    );
  }
  if (!user || user.role !== "ADMIN") {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
