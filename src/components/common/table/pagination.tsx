import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { IPageInfo } from "@/api/axios/base-res.interface";
import { cn } from "@/lib/utils/helper/function.helper";

interface PaginationProps {
  paginationData: IPageInfo;
  queryName?: string;
}

export const Pagination = ({
  paginationData,
  queryName = "page",
}: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, totalPage } = paginationData;

  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPage) return;

    const params = new URLSearchParams(searchParams);
    params.set(queryName, String(pageNum));
    setSearchParams(params);
  };

  const pages = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPage - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPage - 2) {
      pages.push("...");
    }

    pages.push(totalPage);

    return pages;
  }, [page, totalPage]);

  if (totalPage <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPage}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(1)}
          disabled={page === 1}
          className="h-9 w-9 rounded-md border hover:bg-accent disabled:opacity-40"
        >
          <ChevronsLeft className="mx-auto h-4 w-4" />
        </button>

        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="h-9 w-9 rounded-md border hover:bg-accent disabled:opacity-40"
        >
          <ChevronLeft className="mx-auto h-4 w-4" />
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goToPage(item)}
              className={cn(
                "h-9 w-9 rounded-md border text-sm transition",
                item === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPage}
          className="h-9 w-9 rounded-md border hover:bg-accent disabled:opacity-40"
        >
          <ChevronRight className="mx-auto h-4 w-4" />
        </button>

        <button
          onClick={() => goToPage(totalPage)}
          disabled={page === totalPage}
          className="h-9 w-9 rounded-md border hover:bg-accent disabled:opacity-40"
        >
          <ChevronsRight className="mx-auto h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
