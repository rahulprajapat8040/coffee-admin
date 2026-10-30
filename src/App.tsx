import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { DashboardPage } from "./app/dashboard-page";
import { APP_ROUTES } from "./lib/utils/constant/route-constant";
import { CategoryPage } from "./app/category/categories-page";
import { AuthLayout } from "./features/auth/layout/auth-layout";
import { LoginPage } from "./app/auth/login-page";
import { CoffeesPage } from "./app/coffee/coffees-page";

function App() {

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={APP_ROUTES.CATEGORY} element={<CategoryPage />} />
          <Route path={APP_ROUTES.COFFEE} element={<CoffeesPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
