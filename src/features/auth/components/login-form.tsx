import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Coffee, LoaderCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [developmentOtp, setDevelopmentOtp] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: requestOtp, isPending: isRequestingOtp } = useApiMutation(
    authApi.sendOTP,
    {
      onSuccess(response) {
        setDevelopmentOtp(import.meta.env.DEV ? response.data : "");
        toast.success(
          import.meta.env.DEV
            ? "Development sign-in code is ready"
            : "Check your inbox for the sign-in code",
        );
      },
      onError(error) {
        toast.error(error.message || "Couldn't request a sign-in code");
      },
    },
  );

  const { mutate: signIn, isPending: isSigningIn } = useApiMutation(
    authApi.login,
    {
      async onSuccess(response) {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        try {
          const profile = await authApi.me();
          if (profile.data.role !== "ADMIN") {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            toast.error("This account does not have admin access");
            return;
          }
          setUser(profile.data);
          await queryClient.invalidateQueries({ queryKey: ["me"] });
          navigate("/");
        } catch (error) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          toast.error(
            error instanceof Error ? error.message : "Couldn't verify admin access",
          );
        }
      },
      onError(error) {
        toast.error(error.message || "Couldn't sign in");
      },
    },
  );

  return (
    <div>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          signIn({
            email: email.trim(),
            otp: otp.trim(),
            deviceId: "coffee-admin-web",
            deviceType: "WEB",
          });
        }}
      >
        <div>
          <Label htmlFor="admin-email">Work email</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@youcafe.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={!email.trim() || isRequestingOtp}
              onClick={() => requestOtp(email.trim())}
            >
              {isRequestingOtp ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Mail />
              )}
              Send code
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="admin-otp">One-time code</Label>
          <Input
            id="admin-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            placeholder="Enter your 6-digit code"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
          />
          {import.meta.env.DEV && developmentOtp ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Development code: <span className="font-semibold">{developmentOtp}</span>
            </p>
          ) : null}
        </div>
        <Button className="mt-5 flex w-full" disabled={isSigningIn}>
          <Coffee />
          {isSigningIn ? "Signing in..." : "Unlock the counter"}
          {!isSigningIn && <ArrowRight />}
        </Button>
      </form>
    </div>
  );
}