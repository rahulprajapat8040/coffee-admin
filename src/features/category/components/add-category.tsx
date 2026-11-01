import { Button } from "@/components/ui/button"
import { CategoryForm } from "./category-form";
import { useState } from "react";
import type { ICategoryForm } from "../interfaces/category-form.interface";

const defaultValues: ICategoryForm = {
  name: "",
  description: "",
  image: "",
};

export const AddCategory = ()=> {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Add Category</Button>
        <CategoryForm
          title="New Category"
          open={open}
          setOpen={setOpen}
          defaultValues={defaultValues}
        />
      </>
    );
}