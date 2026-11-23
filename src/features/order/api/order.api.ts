import type { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";
import { GetFilterUrl } from "@/lib/utils/helper/function.helper";
import type { IOrder, IOrderPage, OrderStatus } from "../interfaces/order.interface";

export const orderApi = {
  getOrders(query: { page: number; limit: number; status?: OrderStatus }) {
    const filters = GetFilterUrl(query);
    return request<IApiResponse<IOrderPage>>({
      url: `${API_ENDPOINTS.ORDERS}?${filters}`,
      method: "GET",
    });
  },

  getOrder(id: string) {
    return request<IApiResponse<IOrder>>({
      url: `${API_ENDPOINTS.ORDERS}/${id}`,
      method: "GET",
    });
  },

  updateStatus(data: { id: string; status: OrderStatus }) {
    return request<IApiResponse<IOrder>>({
      url: `${API_ENDPOINTS.ORDERS}/${data.id}/status`,
      method: "PATCH",
      data: { status: data.status },
    });
  },
};
