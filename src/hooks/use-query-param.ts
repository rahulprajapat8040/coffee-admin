import { useSearchParams } from "react-router-dom";

export const useQueryParams = <T extends object>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {} as Partial<T>;

  searchParams.forEach((value, key) => {
    (params as Record<string, unknown>)[key] = value;
  });

  return {
    params,
    setSearchParams,
  };
};
