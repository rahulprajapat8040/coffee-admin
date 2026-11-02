import { Outlet } from "react-router-dom"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header";

export const AppLayout = ()=> {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto px-5 py-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    );
}