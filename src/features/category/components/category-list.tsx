import { useQueryParams } from "@/hooks/use-query-param";
import type { ISearchParam } from "@/lib/interface/query.interface";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { CategoryCard } from "./category-card";

export const CategoryList = () => {
  const { params } = useQueryParams<ISearchParam>();
  const { page = 1, limit = 50 } = params;

  const {
    data: {
      data: { data },
    },
  } = useSuspenseQuery({
    queryFn: () => categoryApi.getCategories({ page, limit }),
    queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST, page, limit],
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((i) => {
        return <CategoryCard category={i} key={i.id} />;
      })}
    </div>
  );
};
