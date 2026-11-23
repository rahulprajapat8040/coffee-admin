import type { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";
import type {
  IDashboardAnalytics,
  IDashboardCards,
} from "../interfaces/dashboard.interface";

export const dashboardApi = {
  getCards() {
    return request<IApiResponse<IDashboardCards>>({
      url: `${API_ENDPOINTS.DASHBOARD}/cards`,
      method: "GET",
    });
  },

  getAnalytics() {
    return request<IApiResponse<IDashboardAnalytics>>({
      url: `${API_ENDPOINTS.DASHBOARD}/analytics`,
      method: "GET",
    });
  },
};
