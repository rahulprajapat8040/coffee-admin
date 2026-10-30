import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/lib/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],

    queryFn: authApi.me,

    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (data) {
      setUser(data.data);
    } else {
      clearUser();
    }
  }, [data, isError, setUser, clearUser, isLoading]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return children;
}
