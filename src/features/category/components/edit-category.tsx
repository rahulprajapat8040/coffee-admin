import type { ICategoryForm } from "../interfaces/category-form"
import type { ICategory } from "../interfaces/category-res.interface"
import { Pencil } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "./category-form";


export const EditCategory = ({category}: {category: ICategory})=> {
    const defaultValues: ICategoryForm = {
      name: category.name,
      description: category.description,
      image: category.image,
    };
    const [open, setOpen] = useState<boolean>(false)
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-ink"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <CategoryForm
          id={category.id}
          title="Edit Category"
          open={open}
          setOpen={setOpen}
          defaultValues={defaultValues}
        />
      </>
    );
}