import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BadgePercent,
  Coffee,
  Package,
  ReceiptText,
  Users,
  MapPin,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/common/page/page-header";
import { dashboardApi } from "../api/dashboard.api";
import type {
  DashboardOrderStatus,
  IDashboardAnalytics,
  IDashboardCards,
} from "../interfaces/dashboard.interface";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";

const countCards: Array<{
  key: keyof IDashboardCards["counts"];
  label: string;
  icon: LucideIcon;
}> = [
  { key: "users", label: "Customers", icon: Users },
  { key: "orders", label: "Orders", icon: ReceiptText },
  { key: "coffees", label: "Coffee menu", icon: Coffee },
  { key: "categories", label: "Categories", icon: Boxes },
  { key: "variants", label: "Variants", icon: Package },
  { key: "offers", label: "Offers", icon: BadgePercent },
  { key: "addresses", label: "Saved addresses", icon: MapPin },
];

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

export const Dashboard = () => {
  const cardsQuery = useQuery({
    queryKey: [QUERY_KEY.DASHBOARD, "cards"],
    queryFn: dashboardApi.getCards,
  });
  const analyticsQuery = useQuery({
    queryKey: [QUERY_KEY.DASHBOARD, "analytics"],
    queryFn: dashboardApi.getAnalytics,
  });

  if (cardsQuery.isLoading || analyticsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Store overview" title="Your coffee business, at a glance" />
        <div className="h-52 animate-pulse rounded-3xl bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {countCards.map((card) => (
            <div key={card.key} className="h-32 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      </div>
    );
  }

  if (
    cardsQuery.isError ||
    analyticsQuery.isError ||
    !cardsQuery.data ||
    !analyticsQuery.data
  ) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Store overview" title="Your coffee business, at a glance" />
        <div className="rounded-2xl border border-destructive/20 bg-card p-6 text-sm text-destructive">
          Could not load dashboard analytics. Please refresh the page to try again.
        </div>
      </div>
    );
  }

  const cards = cardsQuery.data.data;
  const analytics = analyticsQuery.data.data;

  return (
    <div className="space-y-7 pb-8">
      <PageHeader eyebrow="Store overview" title="Your coffee business, at a glance" />

      <section className="relative overflow-hidden rounded-3xl bg-espresso p-6 text-cream shadow-[0_20px_55px_-34px_rgba(69,43,27,0.65)] sm:p-8">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[34px] border-roast/40" />
        <div className="absolute -bottom-28 right-28 h-48 w-48 rounded-full border-[24px] border-roast/25" />
        <div className="relative">
          <div>
            <p className="text-sm font-medium text-cream-active">Completed order revenue</p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {money(cards.revenue)}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-active">
              A live snapshot of your store, from customer activity to the latest orders.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Store totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {countCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-[0_12px_30px_-24px_rgba(69,43,27,0.5)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-roast">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">
              {cards.counts[key].toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Current total</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <RevenueChart analytics={analytics} />
        <OrderBreakdown analytics={analytics} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.4fr]">
        <TopProducts analytics={analytics} />
        <RecentOrders analytics={analytics} />
      </div>
    </div>
  );
};

function Panel({
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

function RevenueChart({ analytics }: { analytics: IDashboardAnalytics }) {
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
            <polygon
              points={`28,178 ${line} 612,178`}
              fill="url(#revenue-fill)"
            />
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

function OrderBreakdown({ analytics }: { analytics: IDashboardAnalytics }) {
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

function TopProducts({ analytics }: { analytics: IDashboardAnalytics }) {
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

function RecentOrders({ analytics }: { analytics: IDashboardAnalytics }) {
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
