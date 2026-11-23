import { LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signOut = () => {
    sessionStorage.removeItem("accessToken");
    clearUser();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center gap-3 border-b bg-card px-5 lg:px-8">
      <button className="lg:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <p className="text-sm text-muted-foreground">Coffee shop operations</p>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="grid h-9 w-9 place-items-center rounded-full border text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};