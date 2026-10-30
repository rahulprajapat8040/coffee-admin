import { request } from "@/api/axios/request";
import type { ICategoryForm } from "../interfaces/category-form";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";
import type { ISearchParam } from "@/lib/interface/query.interface";
import { GetFilterUrl } from "@/lib/utils/helper/function.helper";
import type { IApiResponse } from "@/api/axios/base-res.interface";
import type { ICategoryRes } from "../interfaces/category-res.interface";

export const categoryApi = {
  addCategory(data: ICategoryForm) {
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/${API_ENDPOINTS.CATEGORY}`,
      method: "POST",
      data,
    });
  },

  getCategories(queryData: ISearchParam) {
    const query = GetFilterUrl(queryData);
    return request<IApiResponse<ICategoryRes>>({
      url: `${API_ENDPOINTS.PRODUCT}/${API_ENDPOINTS.CATEGORY}?${query ? query : ""}`,
    });
  },

  editCategory(data: ICategoryForm & { id: string }) {
    const { id, ...payload } = data;
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/${API_ENDPOINTS.CATEGORY}/${id}`,
      data: payload,
      method: "PUT",
    });
  },

  deleteCategory(id: string) {
    return request({
      url: `${API_ENDPOINTS.PRODUCT}/${API_ENDPOINTS.CATEGORY}/${id}`,
      method: "DELETE",
    });
  },
};