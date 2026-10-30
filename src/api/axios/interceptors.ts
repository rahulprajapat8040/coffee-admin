import { AxiosError } from "axios";
import { ApiError } from "./errors";
import { refreshSession } from "./refresh";
import { axiosInstance } from "./axios";

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config as any;

    const response = error.response?.data as {
      error?: string;
      message?: string;
    };
    const shouldRefresh =
      error.response?.status === 401 &&
      (response.error === "TOKEN_EXPIRED" ||
        response.error === "TOKEN_NOT_PROVIDED") &&
      config &&
      !config._retry &&
      !config.skipAuthRefresh;

    if (shouldRefresh) {
      config._retry = true;

      try {
        await refreshSession();

        return axiosInstance(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    const apiError = new ApiError({
      message:
        (error.response?.data as any)?.message ??
        error.message ??
        "Something went wrong",

      statusCode: error.response?.status ?? 500,
    });

    return Promise.reject(apiError);
  }
);
