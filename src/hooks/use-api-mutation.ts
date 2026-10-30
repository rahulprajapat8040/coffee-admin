import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useApiMutation<TData, TVariables = void, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}