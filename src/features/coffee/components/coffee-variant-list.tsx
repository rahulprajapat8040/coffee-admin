import { cn } from "@/lib/utils/helper/function.helper";
import type { Variant } from "../interface/coffee-res.interface";
import { VariantStatus } from "@/lib/utils/enum";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { coffeeApi } from "../api/coffee.api";
import { toast } from "sonner";
import { queryClient } from "@/api/query-client";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";

export const CoffeeVairantList = ({ variants }: { variants: Variant[] }) => {
  const { mutate } = useApiMutation(coffeeApi.updateVariantStatus, {
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

  const handleClick = (id: string, status: VariantStatus) => {
    const updatedStatus =
      status === VariantStatus.AVAILABLE
        ? VariantStatus.UN_AVAILABLE
        : VariantStatus.AVAILABLE;
    mutate({ id, status: updatedStatus });
  };

  return (
    <div className="flex items-center gap-4 flex-wrap text-xs">
      {variants.length !== 0
        ? variants.map((i) => {
            return (
              <button
                onClick={() => handleClick(i.id, i.status)}
                className={cn(
                  "px-1.5 py-1 rounded-full border",
                  i.status === VariantStatus.AVAILABLE
                    ? " border-primary text-roast bg-cream"
                    : "line-through text-ink-muted",
                )}
                key={i.id}
              >
                <span className="font-semibold"> {i.size}</span>: ${i.price}
              </button>
            );
          })
        : "--"}
    </div>
  );
};
