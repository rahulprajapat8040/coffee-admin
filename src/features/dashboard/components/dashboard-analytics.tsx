import { ArrowUpRight, Coffee } from "lucide-react";
import type {
  DashboardOrderStatus,
  IDashboardAnalytics,
} from "../interfaces/dashboard.interface";

const statusNames: Record<DashboardOrderStatus, string> = {
  PREPARING: "Preparing",
  ON_THE_WAY: "On the way",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusColors: Record<DashboardOrderStatus, string> = {
  PREPARING: "#C67C4E",
  ON_THE_WAY: "#718C78",
  COMPLETED: "#A68A62",
  CANCELLED: "#B46D63",
};

const money = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-roast" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

export function RevenueChart({ analytics }: { analytics: IDashboardAnalytics }) {
  const values = analytics.revenueTrend.map((point) => point.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = analytics.revenueTrend.map((point, index) => {
    const x = 28 + (index * 584) / Math.max(analytics.revenueTrend.length - 1, 1);
    const y = 172 - ((point.revenue - min) / range) * 132;
    return { ...point, x, y };
  });
  const line = points.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <Panel title="Revenue trend" subtitle="Completed order revenue · last 7 days">
      <div className="mt-5">
        <svg
          viewBox="0 0 640 205"
          role="img"
          aria-label="Daily revenue over the last seven days"
          className="h-52 w-full overflow-visible"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C67C4E" stopOpacity=".22" />
              <stop offset="100%" stopColor="#C67C4E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 82, 124, 166].map((y) => (
            <line
              key={y}
              x1="24"
              x2="616"
              y1={y}
              y2={y}
              stroke="#EEE8E2"
              strokeDasharray="4 6"
            />
          ))}
          {points.length > 1 && (
            <polygon points={`28,178 ${line} 612,178`} fill="url(#revenue-fill)" />
          )}
          {points.length > 0 && (
            <polyline
              points={line}
              fill="none"
              stroke="#9A684A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {points.map((point) => (
            <circle
              key={point.date}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#fff"
              stroke="#9A684A"
              strokeWidth="2.5"
            >
              <title>{`${point.date}: ${money(point.revenue)} · ${point.orders} orders`}</title>
            </circle>
          ))}
        </svg>
        <div className="mt-1 grid grid-cols-7 text-center text-[11px] text-muted-foreground">
          {analytics.revenueTrend.map((point) => (
            <span key={point.date}>
              {new Date(`${point.date}T00:00:00`).toLocaleDateString(undefined, {
                weekday: "short",
              })}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function OrderBreakdown({ analytics }: { analytics: IDashboardAnalytics }) {
  const total = analytics.orderStatuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <Panel title="Order status" subtitle="A breakdown of orders by their current stage">
      <div className="mt-6 space-y-5">
        {analytics.orderStatuses.map(({ status, count }) => (
          <div key={status}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-soft">{statusNames[status]}</span>
              <span className="tabular-nums text-muted-foreground">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.max((count / total) * 100, count ? 3 : 0) : 0}%`,
                  backgroundColor: statusColors[status],
                }}
              />
            </div>
          </div>
        ))}
        {!total && (
          <p className="py-5 text-center text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </Panel>
  );
}

export function TopProducts({ analytics }: { analytics: IDashboardAnalytics }) {
  const max = Math.max(...analytics.topProducts.map((item) => item.quantity), 1);

  return (
    <Panel title="Popular coffees" subtitle="Best sellers by units sold">
      <div className="mt-5 space-y-4">
        {analytics.topProducts.map((product, index) => (
          <div key={product.name} className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream text-xs font-semibold text-roast">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-ink-soft">{product.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {product.quantity}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-roast"
                  style={{ width: `${(product.quantity / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {!analytics.topProducts.length && (
          <p className="py-5 text-center text-sm text-muted-foreground">Sales will appear here.</p>
        )}
      </div>
    </Panel>
  );
}

export function RecentOrders({ analytics }: { analytics: IDashboardAnalytics }) {
  return (
    <Panel title="Recent orders" subtitle="The latest activity from your customers">
      <div className="mt-4 divide-y">
        {analytics.recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-1 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream text-roast">
                <Coffee className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-soft">
                  {order.customerName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  color: statusColors[order.status],
                  backgroundColor: `${statusColors[order.status]}18`,
                }}
              >
                {statusNames[order.status]}
              </span>
              <span className="min-w-16 text-right text-sm font-semibold tabular-nums">
                {money(order.total)}
              </span>
            </div>
          </div>
        ))}
        {!analytics.recentOrders.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">New orders will show up here.</p>
        )}
      </div>
    </Panel>
  );
}
