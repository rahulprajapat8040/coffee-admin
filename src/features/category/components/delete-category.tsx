import { useApiMutation } from "@/hooks/use-api-mutation";
import { Trash2 } from "lucide-react";
import { categoryApi } from "../api/category.api";
import { toast } from "sonner";
import { queryClient } from "@/api/query-client";
import { QUERY_KEY } from "@/lib/utils/constant/query-key.constant";

export const DeleteCategory = ({ id }: { id: string }) => {
  const { mutate } = useApiMutation(categoryApi.deleteCategory, {
    onSuccess() {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CATEGORY, QUERY_KEY.LIST],
      });
    },
    onError(err) {
      toast.error(err.message || "Error in deleting category");
    },
  });
  return (
    <button
      onClick={() => mutate(id)}
      className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
};
