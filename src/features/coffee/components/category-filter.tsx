import { categoryApi } from "@/features/category/api/category.api";
import type { ICategory } from "@/features/category/interfaces/category-res.interface";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { cn } from "@/lib/utils/helper/function.helper";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  value?: string | null;
  onChange: (c: ICategory | null) => void;
}

export const CategoryFilter = ({ value, onChange }: Props) => {
  const {
    data: {
      data: { data },
    },
  } = useSuspenseQuery({
    queryFn: () => categoryApi.getCategories({ page: 1, limit: 50 }),
    queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST, QUERY_KEY.COFFEE],
  });

  return (
    <div className="flex items-center flex-wrap gap-4 text-sm">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "bg-white drop-shadow-xs hover:bg-cream-hover text-foreground font-medium px-6 py-1.75 rounded-full",
          !value && "bg-primary drop-shadow-xs text-white font-medium",
        )}
      >
        All Coffee
      </button>
      {data.map((i) => {
        return (
          <button
            key={i.id}
            onClick={() => onChange(i)}
            className={cn(
              "bg-white drop-shadow-xs hover:bg-cream-hover text-foreground font-medium px-6 py-1.75 rounded-full",
              value === i.id &&
                "bg-primary drop-shadow-xs text-white font-medium",
            )}
          >
            {i.name}
          </button>
        );
      })}
    </div>
  );
};
