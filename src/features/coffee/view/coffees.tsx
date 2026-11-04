import { PageHeader } from "@/components/common/page/page-header"
import { AddCoffee } from "../components/add-coffee";
import { CategoryFilter } from "../components/category-filter";
import { Suspense } from "react";
import { CoffeeTable } from "../components/coffee-table";
import { useQueryParams } from "@/hooks/use-query-param";

export const Coffees = ()=> {

  const {params, setSearchParams} = useQueryParams<{ categoryId: string | null }>();
  
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-5">
          <PageHeader eyebrow="MENU" title="Coffees & variants" />
          <AddCoffee />
        </div>
        <CategoryFilter
          value={params.categoryId}
          onChange={(c) => setSearchParams(c ? { categoryId: c.id } : {})}
        />
        <Suspense>
          <CoffeeTable />
        </Suspense>
      </div>
    );
}