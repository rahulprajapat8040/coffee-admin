import { Pagination } from "@/components/common/table/pagination";
import { Table, type Column } from "@/components/common/table/table";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { offerApi } from "@/features/offer/api/offer.api";
import { OfferForm } from "@/features/offer/components/offer-form";
import type { IOffer } from "@/features/offer/interfaces/offer.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Edit2, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const dateLabel = (value: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "No end date";

const imageUrl = (value: string) =>
  value.startsWith("uploads")
    ? `${import.meta.env.VITE_API_URL}/${value}`
    : value;

const targetLabel = (offer: IOffer) => {
  if (offer.targetType === "ALL_PRODUCTS") return "All products";
  if (offer.targetType === "SELECTED_COFFEES") {
    return `${offer.coffeeIds.length} selected ${offer.coffeeIds.length === 1 ? "coffee" : "coffees"}`;
  }
  return `${offer.categoryIds.length} selected ${offer.categoryIds.length === 1 ? "category" : "categories"}`;
};

const offerState = (offer: IOffer) => {
  if (!offer.isActive) return "Paused";
  const now = Date.now();
  if (new Date(offer.startDate).getTime() > now) return "Scheduled";
  if (offer.endDate && new Date(offer.endDate).getTime() < now) return "Expired";
  return "Live";
};

export const Offers = () => {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [open, setOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<IOffer | undefined>();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEY.OFFER, QUERY_KEY.LIST, page],
    queryFn: () => offerApi.getOffers({ page, limit: 10 }),
  });
  const offers = data?.data.data ?? [];
  const invalidateOffers = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OFFER, QUERY_KEY.LIST] });
  const { mutate: toggleStatus } = useApiMutation(offerApi.updateOfferStatus, {
    onSuccess: async () => {
      toast.success("Offer status updated");
      await Promise.all([invalidateOffers(), queryClient.invalidateQueries({ queryKey: ["home"] })]);
    },
    onError: (updateError) => toast.error(updateError.message || "Couldn't update offer"),
  });
  const { mutate: deleteOffer } = useApiMutation(offerApi.deleteOffer, {
    onSuccess: async () => {
      toast.success("Offer deleted");
      await Promise.all([invalidateOffers(), queryClient.invalidateQueries({ queryKey: ["home"] })]);
    },
    onError: (deleteError) => toast.error(deleteError.message || "Couldn't delete offer"),
  });

  const columns: Column<IOffer>[] = [
    {
      key: "offer",
      header: "Offer",
      render: (offer) => (
        <div className="flex items-center gap-3">
          {offer.image ? (
            <img src={imageUrl(offer.image)} alt="" className="size-12 rounded-lg object-cover" />
          ) : (
            <div className="grid size-12 place-items-center rounded-lg bg-cream text-roast">
              <ImagePlus className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{offer.title}</p>
            <p className="mt-1 max-w-56 truncate text-xs text-muted-foreground">
              {offer.description || "No banner description"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (offer) => (
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
          {Number(offer.discountPercentage)}% off
        </span>
      ),
    },
    {
      key: "target",
      header: "Applies to",
      render: (offer) => targetLabel(offer),
    },
    {
      key: "schedule",
      header: "Schedule",
      render: (offer) => (
        <span className="inline-flex items-start gap-2 text-xs text-muted-foreground">
          <CalendarClock className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Starts {dateLabel(offer.startDate)}
            <br />
            Ends {dateLabel(offer.endDate)}
          </span>
        </span>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (offer) => (
        <button
          type="button"
          aria-label={`${offer.isActive ? "Pause" : "Enable"} ${offer.title}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleStatus({ id: offer.id, isActive: !offer.isActive });
          }}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            offerState(offer) === "Live"
              ? "bg-emerald-100 text-emerald-800"
              : offerState(offer) === "Scheduled"
                ? "bg-sky-100 text-sky-800"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {offerState(offer)}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (offer) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${offer.title}`}
            onClick={(event) => {
              event.stopPropagation();
              setEditingOffer(offer);
              setOpen(true);
            }}
          >
            <Edit2 />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${offer.title}`}
            onClick={(event) => {
              event.stopPropagation();
              if (window.confirm(`Delete "${offer.title}"? This cannot be undone.`)) {
                deleteOffer(offer.id);
              }
            }}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Campaigns
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Offers</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Schedule discounts, choose which coffees or categories qualify, and publish the offer banners customers see at home.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingOffer(undefined);
            setOpen(true);
          }}
        >
          <Plus />
          Create offer
        </Button>
      </div>

      <div className="rounded-2xl bg-espresso p-5 text-cream md:flex md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">One offer is applied per product</p>
          <p className="mt-1 max-w-2xl text-sm text-cream-active">
            When promotions overlap, the customer automatically receives the best eligible discount. Offers never stack.
          </p>
        </div>
        <p className="mt-3 text-sm text-cream-active md:mt-0">
          {data?.data.pageInfo.total ?? 0} total offers
        </p>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Couldn't load offers."}
        </div>
      ) : (
        <>
          <Table
            data={offers}
            columns={columns}
            getRowId={(offer) => offer.id}
            loading={isLoading}
            emptyMessage="No offers yet. Create your first offer to start a campaign."
          />
          {data?.data.pageInfo ? (
            <Pagination paginationData={data.data.pageInfo} />
          ) : null}
        </>
      )}
      <OfferForm
        open={open}
        offer={editingOffer}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setEditingOffer(undefined);
        }}
      />
    </div>
  );
};
