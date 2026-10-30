import type { AxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean;

  _retry?: boolean;
}
