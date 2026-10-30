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

interface Props {
  title: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues: ICoffeeForm;
}

export const CoffeeForm = ({
  title,
  open,
  onOpenChange,
  defaultValues,
}: Props) => {
  const form = useForm({ defaultValues });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: ICoffeeForm) => {
    console.log("dataa", data);
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
          <CoffeeVariant form={form} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
