import { AxiosError } from "axios";
import { ApiError } from "./errors";
import { axiosInstance } from "./axios";
import { refreshSession } from "./refresh";
import type { CustomAxiosRequestConfig } from "./types";

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig | undefined;
    const shouldRefresh =
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !config.skipAuthRefresh &&
      !config.url?.includes("/auth/refresh-token");

    if (shouldRefresh) {
      config._retry = true;
      try {
        await refreshSession();
        return axiosInstance(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    const responseData: unknown = error.response?.data;
    const responseMessage =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
        ? responseData.message
        : undefined;
    const apiError = new ApiError({
      message: responseMessage ?? error.message ?? "Something went wrong",

      statusCode: error.response?.status ?? 500,
    });

    return Promise.reject(apiError);
  }
);
