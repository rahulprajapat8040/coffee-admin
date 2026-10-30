import {  Outlet } from "react-router-dom";
import { AuthLeftInfo } from "./left-info";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AuthLeftInfo />
      <Outlet />
    </div>
  );
};
