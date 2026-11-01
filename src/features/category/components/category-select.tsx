import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";
import { AppSelect } from "@/components/ui/app-select";

interface Props {
  value?: string;
  onChange: (value: string | null) => void;
}

export const CategorySelect = ({ value, onChange }: Props) => {
  const {
    data: {
      data: { data },
    },
  } = useSuspenseQuery({
    queryFn: () => categoryApi.getCategories({ page: 1, limit: 50 }),
    queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST, QUERY_KEY.SELECT],
  });

  return (
    <AppSelect
      value={value}
      onValueChange={onChange}
      options={data.map((i) => ({ label: i.name, value: i.id }))}
    />
  );
};
