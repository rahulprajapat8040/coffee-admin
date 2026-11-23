import type { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";
import { GetFilterUrl } from "@/lib/utils/helper/function.helper";
import type { IOffer, IOfferForm, IOfferPage } from "../interfaces/offer.interface";

export const offerApi = {
  getOffers(query: { page: number; limit: number }) {
    const filters = GetFilterUrl(query);
    return request<IApiResponse<IOfferPage>>({
      url: `${API_ENDPOINTS.OFFERS}?${filters}`,
      method: "GET",
    });
  },

  createOffer(data: IOfferForm) {
    return request<IApiResponse<IOffer>>({
      url: API_ENDPOINTS.OFFERS,
      method: "POST",
      data,
    });
  },

  updateOffer(data: IOfferForm & { id: string }) {
    const { id, ...payload } = data;
    return request<IApiResponse<IOffer>>({
      url: `${API_ENDPOINTS.OFFERS}/${id}`,
      method: "PUT",
      data: payload,
    });
  },

  updateOfferStatus(data: { id: string; isActive: boolean }) {
    return request<IApiResponse<IOffer>>({
      url: `${API_ENDPOINTS.OFFERS}/${data.id}/status`,
      method: "PATCH",
      data: { isActive: data.isActive },
    });
  },

  deleteOffer(id: string) {
    return request<IApiResponse<null>>({
      url: `${API_ENDPOINTS.OFFERS}/${id}`,
      method: "DELETE",
    });
  },
};
