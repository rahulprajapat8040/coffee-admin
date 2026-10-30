import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@/api/axios/interceptors.ts"; // Registers interceptors once
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/query-provider.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster richColors />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
