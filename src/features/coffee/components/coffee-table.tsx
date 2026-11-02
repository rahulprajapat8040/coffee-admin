import { useSuspenseQuery } from "@tanstack/react-query";
import { coffeeApi } from "../api/coffee.api";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { useQueryParams } from "@/hooks/use-query-param";
import type { ISearchParam } from "@/lib/interface/query.interface";
import { Table, type Column } from "@/components/common/table/table";
import type { ICoffee } from "../interface/coffee-res.interface";
import PreviewImage from "@/components/common/media/preview-image";
import { CoffeeVairantList } from "./coffee-variant-list";
import { CoffeeStatusToggle } from "./coffee-status-toggle";
import { Pagination } from "@/components/common/table/pagination";

export const CoffeeTable = () => {
  const { params } = useQueryParams<ISearchParam>();
  const { page = 1, limit = 10 } = params;
  const {
    data: {
      data: { data, pageInfo },
    },
  } = useSuspenseQuery({
    queryFn: () => coffeeApi.getCoffees({ page, limit }),
    queryKey: [QUERY_KEY.COFFEE, QUERY_KEY.LIST, page, limit],
  });

  const columns: Column<ICoffee>[] = [
    {
      key: "name",
      header: "Name",
      render: (i) => {
        return <PreviewImage src={i.image} text={i.name} />;
      },
    },
    {
      key: "categoryName",
      header: "Category",
      render: (i) => {
        return i?.category?.name;
      },
    },
    {
      key: "variants",
      header: "Variants",
      render: (i) => <CoffeeVairantList variants={i.variants} />,
    },
    {
      key: "isActive",
      header: "Status",
      render: (i) => <CoffeeStatusToggle id={i.id} isActive={i.isActive} />,
    },
  ];

  return (
    <div>
      <Table
        data={data}
        columns={columns}
        getRowId={(coffee) => coffee.id}
        emptyMessage="No coffees found."
      />
      <Pagination paginationData={pageInfo} />
    </div>
  );
};
