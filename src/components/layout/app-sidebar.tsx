import { APP_ROUTES } from "@/lib/utils/constant/route-constant";
import {
  Coffee,
  LayoutGrid,
  Tags,
  Package,
  Receipt,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: APP_ROUTES.CATEGORY, label: "Categories", icon: Tags },
  { to: APP_ROUTES.COFFEE, label: "coffees", icon: Package },
  { to: "/orders", label: "Orders", icon: Receipt },
] as const;

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar px-4 py-6 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-sidebar-accent-foreground">
              Bean&nbsp;Counter
            </p>
            <p className="text-xs text-sidebar-foreground">Store admin</p>
          </div>
          <button
            className="ml-auto text-sidebar-foreground lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/70">
          Menu
        </p>
        <nav className="mt-3 flex flex-col gap-1">
          {nav.map((n) => {
            return (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-4 h-6 w-1 rounded-r bg-primary" />
                    )}

                    <n.icon
                      className={`h-4.5 w-4.5 ${
                        isActive ? "text-primary" : ""
                      }`}
                    />

                    {n.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-espresso p-4">
          <p className="font-display text-sm font-semibold text-cream">
            Today's roast
          </p>
          <p className="mt-1 text-xs leading-relaxed text-cream-active">
            Ethiopia Guji — floral, stone fruit, honey finish.
          </p>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}


export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pt-16"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
