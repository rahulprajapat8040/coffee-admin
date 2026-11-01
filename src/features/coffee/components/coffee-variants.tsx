import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { ICoffeeForm } from "../interface/coffee-form.interface";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";

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
    <div className="bg-cream py-6 px-4 rounded-md">
      <div className="flex items-center justify-between text-xs">
        <Label>Variants</Label>
        <button
          type="button"
          onClick={() => handleAddVariant()}
          className="flex items-center gap-1 text-primary font-semiboldk"
        >
          <Plus size={15} /> Add variant
        </button>
      </div>
      <div className="">
        <div className="grid grid-cols-[1fr_1fr_0.3fr] gap-x-4 mt-3">
          <div>
            <Label className="text-primary">Size/Name</Label>
          </div>
          <div>
            <Label className="text-primary">Price</Label>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr_0.3fr] items-center gap-x-4 mt-1 space-y-2">
          {fields.map((field, index) => {
            return (
              <React.Fragment key={field.id}>
                <div>
                  <Input
                    placeholder="e.g. S"
                    className="bg-white rounded-md"
                    {...register(`variants.${index}.size`)}
                  />
                </div>
                <div>
                  <Input
                    className="bg-white rounded-md"
                    {...register(`variants.${index}.price`)}
                    type="number"
                    step={0.001}
                  />
                </div>
                <button
                  type="button"
                  className="text-primary"
                  onClick={() => handleRemoveVariant(index)}
                >
                  <X size={17} />
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
