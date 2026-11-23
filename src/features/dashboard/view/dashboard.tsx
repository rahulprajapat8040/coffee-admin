import { useQuery } from "@tanstack/react-query";
import {
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
import { OrderBreakdown, RecentOrders, RevenueChart, TopProducts } from "../components";
import { dashboardApi } from "../api/dashboard.api";
import type { IDashboardCards } from "../interfaces/dashboard.interface";
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
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-34 border-roast/40" />
        <div className="absolute -bottom-28 right-28 h-48 w-48 rounded-full border-24 border-roast/25" />
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
