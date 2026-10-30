import { categoryApi } from "@/features/category/api/category.api";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { cn } from "@/lib/utils/helper/function.helper";
import { useSuspenseQuery } from "@tanstack/react-query";

export const CategoryFilter = () => {
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
          className={cn(
            "bg-primary drop-shadow-xs text-white font-medium px-6 py-1.75 rounded-full",
          )}
        >
          All Coffee
        </button>
        {data.map((i) => {
          return (
            <button
              key={i.id}
              className={cn(
                "bg-white drop-shadow-xs hover:bg-cream-hover text-foreground font-medium px-6 py-1.75 rounded-full",
              )}
            >
              {i.name}
            </button>
          );
        })}
      </div>
    );
};
