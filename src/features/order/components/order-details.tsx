import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppSelect } from "@/components/ui/app-select";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { orderApi } from "@/features/order/api/order.api";
import type { IOrder, OrderStatus } from "@/features/order/interfaces/order.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, MapPin, PackageCheck, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { dateTime, money, readableStatus } from "./order-utils";

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PREPARING: ["ON_THE_WAY", "CANCELLED"],
  ON_THE_WAY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const streetAddress = (order: IOrder) => {
  const labelPrefix = order.deliveryAddressLabel
    ? `${order.deliveryAddressLabel} - `
    : "";
  return labelPrefix && order.deliveryAddress.startsWith(labelPrefix)
    ? order.deliveryAddress.slice(labelPrefix.length)
    : order.deliveryAddress;
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      status === "COMPLETED"
        ? "bg-emerald-100 text-emerald-800"
        : status === "CANCELLED"
          ? "bg-rose-100 text-rose-800"
          : status === "ON_THE_WAY"
            ? "bg-sky-100 text-sky-800"
            : "bg-amber-100 text-amber-800"
    }`}
  >
    {readableStatus(status)}
  </span>
);

export const OrderDetails = ({
  id,
  onOpenChange,
}: {
  id: string | null;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEY.ORDER, QUERY_KEY.DETAIL, id],
    queryFn: () => orderApi.getOrder(id!),
    enabled: Boolean(id),
  });
  const { mutate: updateStatus, isPending } = useApiMutation(orderApi.updateStatus, {
    onSuccess: async () => {
      toast.success("Order status updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDER, QUERY_KEY.LIST] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDER, QUERY_KEY.DETAIL, id] }),
      ]);
    },
    onError: (updateError) => toast.error(updateError.message || "Couldn't update order"),
  });
  const order = data?.data;

  return (
    <Dialog open={Boolean(id)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="size-5 text-primary" />
            {order ? `Order #${order.id.slice(0, 8).toUpperCase()}` : "Order details"}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading order details...</div>
        ) : isError || !order ? (
          <div className="py-8 text-sm text-destructive">
            {error instanceof Error ? error.message : "Couldn't load this order."}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-sm font-semibold">Placed {dateTime(order.createdAt)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.paymentMethod.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} />
                {nextStatuses[order.status].length > 0 ? (
                  <AppSelect
                    disabled={isPending}
                    value=""
                    ariaLabel="Update order status"
                    onValueChange={(value) => {
                      if (value) {
                        updateStatus({
                          id: order.id,
                          status: value as OrderStatus,
                        });
                      }
                    }}
                    className="h-9 w-36 rounded-lg bg-card"
                    placeholder="Update status"
                    options={nextStatuses[order.status].map((nextStatus) => ({
                      label: readableStatus(nextStatus),
                      value: nextStatus,
                    }))}
                  />
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 text-sm font-semibold">Customer</h3>
                <p className="font-medium">{order.user?.name ?? "Deleted account"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{order.user?.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.user?.phoneNo || "No phone number"}
                </p>
              </section>
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-primary" />
                  Delivery location
                </h3>
                {order.deliveryAddressLabel ? (
                  <p className="font-medium">{order.deliveryAddressLabel}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">{streetAddress(order)}</p>
                {order.deliveryLatitude != null && order.deliveryLongitude != null ? (
                  <a
                    href={`https://www.google.com/maps?q=${order.deliveryLatitude},${order.deliveryLongitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open map
                  </a>
                ) : null}
                {order.note ? (
                  <p className="mt-3 border-t pt-3 text-sm">
                    <span className="font-medium">Courier note:</span> {order.note}
                  </p>
                ) : null}
              </section>
            </div>

            <section>
              <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                <PackageCheck className="size-4 text-primary" />
                Items ({order.items.reduce((quantity, item) => quantity + item.quantity, 0)})
              </h3>
              <div className="divide-y rounded-xl border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.quantity} × {item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.size}{item.offerTitle ? ` · ${item.offerTitle}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      {Number(item.discountAmount) > 0 ? (
                        <p className="text-xs text-muted-foreground line-through">
                          {money(Number(item.originalPrice) * item.quantity)}
                        </p>
                      ) : null}
                      <p className="text-sm font-semibold">
                        {money(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-auto mt-4 grid max-w-sm gap-2 text-sm">
                <Amount label="Subtotal" value={money(order.subtotal)} />
                {Number(order.discountTotal) > 0 ? (
                  <Amount label="Offer savings" value={`−${money(order.discountTotal)}`} />
                ) : null}
                <Amount label="Delivery fee" value={money(order.deliveryFee)} />
                <Amount label="Service fee" value={money(order.serviceFee)} />
                <Amount label="Total" value={money(order.total)} strong />
              </div>
            </section>

            <section>
              <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="size-4 text-primary" />
                Status history
              </h3>
              <ol className="space-y-3 border-l border-border pl-4">
                {(order.statusHistory ?? []).map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-5.25 top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-sm font-medium">{readableStatus(entry.status)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {dateTime(entry.createdAt)} ·{" "}
                      {entry.changedByUser?.name ??
                        (entry.changedBy === order.user?.id ? "Customer" : "System")}
                    </p>
                  </li>
                ))}
                {!order.statusHistory?.length ? (
                  <li className="text-sm text-muted-foreground">No status updates recorded.</li>
                ) : null}
              </ol>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Amount = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className={`flex justify-between ${strong ? "border-t pt-2 text-base font-semibold" : "text-muted-foreground"}`}>
    <span>{label}</span>
    <span className={strong ? "text-foreground" : "text-foreground"}>{value}</span>
  </div>
);
