import { PageHeader } from "@/components/common/page/page-header";
import { AddCategory } from "../components/add-category";
import { CategoryList } from "../components/category-list";
import { Suspense } from "react";

export const Category = ()=> {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-5">
          <PageHeader eyebrow="Menu" title="Categories" />
          <AddCategory />
        </div>
        <Suspense fallback={"Loading.."}>
          <CategoryList />
        </Suspense>
      </div>
    );
}