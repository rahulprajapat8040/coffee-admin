import type { ICategory } from "../interfaces/category-res.interface";
import PreviewImage from "@/components/common/media/preview-image";
import { EditCategory } from "./edit-category";
import { DeleteCategory } from "./delete-category";

export const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <article
      key={category.id}
      className="group flex gap-4 rounded-2xl bg-card p-3"
    >
      <div className="h-28 w-28 shrink-0 rounded-xl object-cover">
        <PreviewImage
          src={
            category.image ||
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70"
          }
          alt={category.name}
          className="w-full h-full"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
        <h3 className="truncate text-base font-semibold">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {category.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="rounded-md bg-cream px-2 py-0.5 text-xs font-semibold text-roast">
            {10} items
          </span>
          <div className="flex gap-1">
            <EditCategory category={category} />
            <DeleteCategory id={category.id} />
          </div>
        </div>
      </div>
    </article>
  );
};
