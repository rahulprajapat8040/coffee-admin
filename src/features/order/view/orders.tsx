import { Pagination } from "@/components/common/table/pagination";
import { Table, type Column } from "@/components/common/table/table";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { orderApi } from "@/features/order/api/order.api";
import type { IOrder, OrderStatus } from "@/features/order/interfaces/order.interface";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSelect } from "@/components/ui/app-select";
import { OrderDetails, StatusBadge } from "../components";
import { dateTime, money, readableStatus, statuses } from "../components/order-utils";

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const rawStatus = searchParams.get("status");
  const status = statuses.includes(rawStatus as OrderStatus)
    ? (rawStatus as OrderStatus)
    : undefined;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEY.ORDER, QUERY_KEY.LIST, page, status],
    queryFn: () => orderApi.getOrders({ page, limit: 10, status }),
  });
  const orders = data?.data.data ?? [];
  const columns: Column<IOrder>[] = [
    {
      key: "order",
      header: "Order",
      render: (order) => (
        <div>
          <p className="font-semibold text-foreground">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{dateTime(order.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <div>
          <p className="font-medium">{order.user?.name ?? "Deleted account"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{order.user?.email}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order) => `${order.items.length} ${order.items.length === 1 ? "item" : "items"}`,
    },
    {
      key: "location",
      header: "Delivery location",
      render: (order) => (
        <span className="inline-flex max-w-56 items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{order.deliveryAddressLabel || order.deliveryAddress}</span>
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (order) => <span className="font-semibold">{money(order.total)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => <StatusBadge status={order.status} />,
    },
  ];

  const updateFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (value) next.set("status", value);
    else next.delete("status");
    setSearchParams(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Fulfillment
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review customer orders, delivery details, and status history.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm font-medium">
          Filter by status
          <AppSelect
            value={status ?? "ALL"}
            onValueChange={(value) => updateFilter(value === "ALL" ? "" : value)}
            className="h-10 min-w-48 rounded-lg bg-card"
            placeholder="All statuses"
            options={[
              { label: "All statuses", value: "ALL" },
              ...statuses.map((item) => ({
                label: readableStatus(item),
                value: item,
              })),
            ]}
          />
        </label>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Couldn't load orders."}
        </div>
      ) : (
        <>
          <Table
            data={orders}
            columns={columns}
            getRowId={(order) => order.id}
            loading={isLoading}
            emptyMessage="No orders match this filter."
            onRowClick={(order) => setSelectedId(order.id)}
          />
          {data?.data.pageInfo ? (
            <Pagination paginationData={data.data.pageInfo} />
          ) : null}
        </>
      )}

      <OrderDetails
        id={selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
};
