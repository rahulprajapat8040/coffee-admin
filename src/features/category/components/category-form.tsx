import { useForm, Controller } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { UploadImage } from "@/features/files/components/upload-image";
import type { ICategoryForm } from "../interfaces/category-form";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { categoryApi } from "../api/category.api";
import { toast } from "sonner";
import { queryClient } from "@/api/query-client";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { useEffect } from "react";

interface Props {
  id?: string;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues: ICategoryForm;
}

export const CategoryForm = ({
  id,
  title = "Create category",
  open,
  defaultValues,
  setOpen,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICategoryForm>({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        image: defaultValues.image ?? "",
      });
    }
  }, [open, defaultValues, reset]);

  const { mutate: addCategoryMutate, isPending: addCategoryPending } =
    useApiMutation(categoryApi.addCategory, {
      onSuccess() {
        toast.success("Category added successfully");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST],
        });
      },
      onError(err) {
        toast.error(err.message || "Error in create category");
      },
    });

  const { mutate: editCategoryMutate, isPending: editCategoryPending } =
    useApiMutation(categoryApi.editCategory, {
      onSuccess() {
        toast.success("Category edited successfully");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST],
        });
      },
      onError(err) {
        toast.error(err.message || "Error in edit category");
      },
    });

  const submitForm = async (values: ICategoryForm) => {
    if (id) {
      editCategoryMutate({ id, ...values });
    } else {
      addCategoryMutate(values);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Americano"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={4}
              placeholder="Describe this category..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label>Category Image</Label>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={editCategoryPending || addCategoryPending}
            >
              {editCategoryPending || addCategoryPending
                ? "Saving..."
                : "Save category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
