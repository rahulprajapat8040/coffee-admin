import { request } from "@/api/axios/request";
import type { ICoffeeForm } from "../interface/coffee-form.interface";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";
import type { ISearchParam } from "@/lib/interface/query.interface";
import { GetFilterUrl } from "@/lib/utils/helper/function.helper";
import type { IApiResponse } from "@/api/axios/base-res.interface";
import type { ICoffeeRes } from "../interface/coffee-res.interface";
import type { VariantStatus } from "@/lib/utils/enum";

export const coffeeApi = {
  createCoffee(data: ICoffeeForm) {
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/coffee`,
      method: "POST",
      data,
    });
  },

  getCoffees(queryData: ISearchParam) {
    const query = GetFilterUrl(queryData);
    return request<IApiResponse<ICoffeeRes>>({
      url: `${API_ENDPOINTS.PRODUCT}/coffee?${query ? query : ""}`,
      method: "GET",
    });
  },

  updateCoffeeStatus(data: { id: string; isActive: boolean }) {
    const { id, isActive } = data;
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/coffee/${id}/status`,
      data: { isActive },
      method: "PATCH",
    });
  },

  updateVariantStatus(data: { id: string; status: VariantStatus }) {
    const { id, status } = data;
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/coffee/variant/${id}`,
      data: { status },
      method: "PATCH",
    });
  },
};
