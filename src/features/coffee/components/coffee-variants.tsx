import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { ICoffeeForm } from "../interface/coffee-form.interface";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export const CoffeeVariant = ({
  form,
}: {
  form: UseFormReturn<ICoffeeForm>;
}) => {
  const { register, control } = form;
  const { append, remove, fields } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = () => {
    append({ size: "", price: "0" });
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
  };

  return (
    <div className="rounded-xl border border-cream-active bg-cream p-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Variants</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a size and price for this coffee
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddVariant()}
          className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-cream-active/50"
        >
          <Plus size={15} /> Add variant
        </button>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_1fr_2.25rem] gap-3">
        <Label className="text-xs text-primary">Size / name</Label>
        <Label className="text-xs text-primary">Price</Label>
        <span aria-hidden="true" />
      </div>
      <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_1fr_2.25rem] items-center gap-3"
            >
              <Input
                placeholder="e.g. S"
                className="bg-white"
                {...register(`variants.${index}.size`)}
              />
              <Input
                className="bg-white"
                {...register(`variants.${index}.price`)}
                type="number"
                step={0.001}
              />
              <button
                type="button"
                aria-label={`Remove variant ${index + 1}`}
                className="grid size-9 place-items-center rounded-lg text-primary transition-colors hover:bg-cream-active"
                onClick={() => handleRemoveVariant(index)}
              >
                <X size={17} />
              </button>
            </div>
          );
        })}
        {fields.length === 0 ? (
          <p className="rounded-lg border border-dashed border-cream-active bg-white/60 px-3 py-4 text-center text-xs text-muted-foreground">
            No variants yet. Add one above.
          </p>
        ) : null}
      </div>
    </div>
  );
};
