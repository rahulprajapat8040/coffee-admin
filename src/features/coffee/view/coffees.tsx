import { PageHeader } from "@/components/common/page/page-header"
import { AddCoffee } from "../components/add-coffee";
import { CategoryFilter } from "../components/category-filter";
import { Suspense } from "react";
import { CoffeeTable } from "../components/coffee-table";

export const Coffees = ()=> {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-5">
          <PageHeader eyebrow="MENU" title="Coffees & variants" />
          <AddCoffee />
        </div>
        <CategoryFilter />
        <Suspense>
          <CoffeeTable />
        </Suspense>
      </div>
    );
}