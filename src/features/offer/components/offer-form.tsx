import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { categoryApi } from "@/features/category/api/category.api";
import { coffeeApi } from "@/features/coffee/api/coffee.api";
import { UploadImage } from "@/features/files/components/upload-image";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { offerApi } from "@/features/offer/api/offer.api";
import type {
  IOffer,
  IOfferForm,
  OfferTargetType,
} from "@/features/offer/interfaces/offer.interface";
import { queryClient } from "@/api/query-client";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppSelect } from "@/components/ui/app-select";
import { CalendarDays } from "lucide-react";

const emptyValues = (): IOfferForm => ({
  title: "",
  description: "",
  image: "",
  targetType: "ALL_PRODUCTS",
  coffeeIds: [],
  categoryIds: [],
  discountPercentage: 10,
  startDate: "",
  endDate: null,
});

const dateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
};

const formValues = (offer?: IOffer): IOfferForm => {
  if (!offer) return emptyValues();
  return {
    title: offer.title,
    description: offer.description ?? "",
    image: offer.image ?? "",
    targetType: offer.targetType,
    coffeeIds: offer.coffeeIds ?? [],
    categoryIds: offer.categoryIds ?? [],
    discountPercentage: Number(offer.discountPercentage),
    startDate: dateInputValue(offer.startDate),
    endDate: dateInputValue(offer.endDate),
  };
};

export const OfferForm = ({
  open,
  onOpenChange,
  offer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: IOffer;
}) => {
  const {
    data: coffeeResponse,
    isLoading: isLoadingCoffees,
    isError: coffeesFailed,
  } = useQuery({
    queryKey: [QUERY_KEY.COFFEE, "offer-selection"],
    queryFn: () => coffeeApi.getCoffees({ page: 1, limit: 100 }),
  });
  const {
    data: categoryResponse,
    isLoading: isLoadingCategories,
    isError: categoriesFailed,
  } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY, "offer-selection"],
    queryFn: () => categoryApi.getCategories({ page: 1, limit: 100 }),
  });
  const coffees = coffeeResponse?.data.data ?? [];
  const categories = categoryResponse?.data.data ?? [];
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IOfferForm>({ defaultValues: formValues(offer) });
  const targetType = useWatch({ control, name: "targetType" });
  const coffeeIds = useWatch({ control, name: "coffeeIds" }) ?? [];
  const categoryIds = useWatch({ control, name: "categoryIds" }) ?? [];
  const startDate = useWatch({ control, name: "startDate" });
  const selectedIds =
    targetType === "SELECTED_COFFEES" ? coffeeIds : categoryIds;

  useEffect(() => {
    if (open) reset(formValues(offer));
  }, [open, offer, reset]);

  const onSaved = async () => {
    toast.success(offer ? "Offer updated" : "Offer created");
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OFFER, QUERY_KEY.LIST] });
    await queryClient.invalidateQueries({ queryKey: ["home"] });
    onOpenChange(false);
  };
  const { mutate: createOffer, isPending: isCreating } = useApiMutation(
    offerApi.createOffer,
    {
      onSuccess: onSaved,
      onError: (error) => toast.error(error.message || "Couldn't create offer"),
    },
  );
  const { mutate: updateOffer, isPending: isUpdating } = useApiMutation(
    offerApi.updateOffer,
    {
      onSuccess: onSaved,
      onError: (error) => toast.error(error.message || "Couldn't update offer"),
    },
  );

  const submit = (values: IOfferForm) => {
    if (
      (values.targetType === "SELECTED_COFFEES" && !values.coffeeIds.length) ||
      (values.targetType === "SELECTED_CATEGORIES" && !values.categoryIds.length)
    ) {
      toast.error("Choose at least one product or category for this offer");
      return;
    }
    const payload = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      startDate: new Date(values.startDate).toISOString(),
      endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
      coffeeIds:
        values.targetType === "SELECTED_COFFEES" ? values.coffeeIds : [],
      categoryIds:
        values.targetType === "SELECTED_CATEGORIES" ? values.categoryIds : [],
    };
    if (offer) updateOffer({ id: offer.id, ...payload });
    else createOffer(payload);
  };

  const changeTarget = (value: OfferTargetType) => {
    setValue("targetType", value, { shouldDirty: true });
    setValue("coffeeIds", [], { shouldDirty: true });
    setValue("categoryIds", [], { shouldDirty: true });
  };

  const toggleTarget = (id: string) => {
    const field = targetType === "SELECTED_COFFEES" ? "coffeeIds" : "categoryIds";
    const current = targetType === "SELECTED_COFFEES" ? coffeeIds : categoryIds;
    setValue(
      field,
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit offer" : "Create an offer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="offer-title">Offer title</Label>
              <Input
                id="offer-title"
                placeholder="e.g. Your afternoon pick-me-up"
                maxLength={100}
                {...register("title", { required: "Give this offer a title" })}
              />
              {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="offer-description">Banner copy</Label>
              <Textarea
                id="offer-description"
                rows={2}
                maxLength={500}
                placeholder="A short message customers will see on the home screen"
                {...register("description")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-discount">Discount percentage</Label>
              <div className="relative">
                <Input
                  id="offer-discount"
                  className="pr-10"
                  type="number"
                  min={1}
                  max={100}
                  step={0.01}
                  {...register("discountPercentage", {
                    required: "Enter a discount",
                    valueAsNumber: true,
                    min: { value: 1, message: "Discount must be at least 1%" },
                    max: { value: 100, message: "Discount cannot exceed 100%" },
                  })}
                />
                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
              </div>
              {errors.discountPercentage ? (
                <p className="text-xs text-destructive">{errors.discountPercentage.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-target">Applies to</Label>
              <AppSelect
                value={targetType}
                onValueChange={(value) => changeTarget(value as OfferTargetType)}
                className="h-10.5 rounded-xl bg-card"
                placeholder="Choose offer target"
                options={[
                  { label: "All products", value: "ALL_PRODUCTS" },
                  { label: "Selected coffees", value: "SELECTED_COFFEES" },
                  { label: "Selected categories", value: "SELECTED_CATEGORIES" },
                ]}
              />
            </div>
            {targetType !== "ALL_PRODUCTS" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label>
                  {targetType === "SELECTED_COFFEES" ? "Choose coffees" : "Choose categories"}
                </Label>
                <div className="grid max-h-44 gap-2 overflow-y-auto rounded-xl border p-3 sm:grid-cols-2">
                  {targetType === "SELECTED_COFFEES"
                    ? coffeesFailed
                      ? <p className="text-sm text-destructive">Couldn't load coffees.</p>
                      : isLoadingCoffees
                      ? <p className="text-sm text-muted-foreground">Loading coffees...</p>
                      : coffees.map((coffee) => (
                          <label key={coffee.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(coffee.id)}
                              onChange={() => toggleTarget(coffee.id)}
                              className="accent-primary"
                            />
                            <span className="truncate">{coffee.name}</span>
                          </label>
                        ))
                    : categoriesFailed
                      ? <p className="text-sm text-destructive">Couldn't load categories.</p>
                      : isLoadingCategories
                      ? <p className="text-sm text-muted-foreground">Loading categories...</p>
                      : categories.map((category) => (
                          <label key={category.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(category.id)}
                              onChange={() => toggleTarget(category.id)}
                              className="accent-primary"
                            />
                            <span className="truncate">{category.name}</span>
                          </label>
                        ))}
                </div>
                {selectedIds.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Select at least one {targetType === "SELECTED_COFFEES" ? "coffee" : "category"}.
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="offer-start-date">Starts at</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3 size-4 text-primary" />
                <Input
                  id="offer-start-date"
                  type="datetime-local"
                  className="date-field pl-10"
                  {...register("startDate", { required: "Choose a start date" })}
                />
              </div>
              {errors.startDate ? <p className="text-xs text-destructive">{errors.startDate.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-end-date">Ends at (optional)</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3 size-4 text-primary" />
                <Input
                  id="offer-end-date"
                  type="datetime-local"
                  className="date-field pl-10"
                  {...register("endDate", {
                    validate: (value) =>
                      !value || !startDate || value > startDate ||
                      "End date must be after the start date",
                  })}
                />
              </div>
              {errors.endDate ? <p className="text-xs text-destructive">{errors.endDate.message}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Label>Banner image</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <UploadImage
                    value={field.value}
                    onUpload={field.onChange}
                    onDelete={() => field.onChange("")}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : offer ? "Save changes" : "Create offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
