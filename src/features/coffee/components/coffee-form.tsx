import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import type React from "react";
import type { ICoffeeForm } from "../interface/coffee-form.interface";
import { Controller, useForm } from "react-hook-form";
import { UploadImage } from "@/features/files/components/upload-image";
import { Validation } from "@/lib/utils/helper/validation.helper";
import { ErrorMessage } from "@/components/ui/error-message";
import { CoffeeVariant } from "./coffee-variants";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { coffeeApi } from "../api/coffee.api";
import { toast } from "sonner";
import { CategorySelect } from "@/features/category/components/category-select";
import { useEffect } from "react";

interface Props {
  id?: string;
  title: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues: ICoffeeForm;
}

export const CoffeeForm = ({
  id,
  title,
  open,
  onOpenChange,
  defaultValues,
}: Props) => {
  const form = useForm({ defaultValues });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        image: defaultValues.image ?? "",
        categoryId: defaultValues.categoryId,
        variants: defaultValues.variants ?? [],
      });
    }
  }, [open, defaultValues, reset]);

  const { mutate: addMutate, isPending: addPending } = useApiMutation(
    coffeeApi.createCoffee,
    {
      onSuccess() {
        toast.success("Coffee added successfully");
        onOpenChange(false);
      },
      onError(err) {
        toast.error(err.message || "Error in adding coffee. Try again!");
      },
    },
  );

  const onSubmit = (data: ICoffeeForm) => {
    if (id) {
    } else {
      addMutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="e.g. Flat White"
              {...register("name", {
                ...Validation.required({ fieldName: "Name" }),
              })}
            />
            <ErrorMessage message={errors?.name?.message} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              {...register("description", {
                ...Validation.required({ fieldName: "Description" }),
              })}
            />
            <ErrorMessage message={errors?.description?.message} />
          </div>
          <div>
            <Label>Coffee Image</Label>
            <Controller
              name="image"
              control={control}
              render={({ field, fieldState }) => (
                <UploadImage
                  value={field.value}
                  errorMessage={fieldState.error?.message}
                  onUpload={field.onChange}
                  onDelete={() => field.onChange("")}
                />
              )}
            />
          </div>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => {
              return (
                <CategorySelect value={field.value} onChange={field.onChange} />
              );
            }}
          />
          <CoffeeVariant form={form} />
          <div className="flex items-center justify-end gap-5">
            <Button disabled={addPending} type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button disabled={addPending}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
