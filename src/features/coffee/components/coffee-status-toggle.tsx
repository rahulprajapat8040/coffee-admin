import { Toggle } from "@/components/ui/toggle";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { coffeeApi } from "../api/coffee.api";
import { toast } from "sonner";
import { queryClient } from "@/api/query-client";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";

interface Props {
  id: string;
  isActive: boolean;
}

export const CoffeeStatusToggle = ({ id, isActive }: Props) => {
  const { mutate } = useApiMutation(coffeeApi.updateCoffeeStatus, {
    onSuccess() {
      toast.success("Variant status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.COFFEE, QUERY_KEY.LIST],
      });
    },
    onError(err) {
      toast.error(err.message || "Error in updating variant status. Try again");
    },
  });

  const handleClick = (isActive: boolean) => {
    mutate({ id, isActive });
  };
  return <Toggle value={isActive} onChange={(v) => handleClick(v)} />;
};
