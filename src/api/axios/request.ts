import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios";

export async function request<TResponse, TData = unknown>(
  config: AxiosRequestConfig<TData>
): Promise<TResponse> {
  const { data } = await axiosInstance.request<TResponse>(config);

  return data;
}
