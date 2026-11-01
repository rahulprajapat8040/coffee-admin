import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CoffeeForm } from "./coffee-form";
import { useState } from "react";
import type { ICoffeeForm } from "../interface/coffee-form.interface";

const defaultValues: ICoffeeForm = {
  name: "",
  description: "",
  categoryId: "",
  image: "",
  variants: [{ size: "", price: "" }],
};

export const AddCoffee = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Coffee
      </Button>
      <CoffeeForm
        title="New Product"
        open={open}
        onOpenChange={setOpen}
        defaultValues={defaultValues}
      />
    </>
  );
};
