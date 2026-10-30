import type { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import type { ISignupForm } from "@/features/auth/interfaces/signup-form.interface";
import type { IAuthResponse } from "../interfaces/auth-response.interface";
import type { ILoggedInUser } from "../interfaces/user.interface";
import type { ILoginForm } from "../interfaces/login-form.interface";
import { API_ENDPOINTS } from "@/lib/utils/constant/route-constant";

export const authApi = {
  signup(data: ISignupForm) {
    return request<IApiResponse<IAuthResponse>>({
      url: "/auth/signup/email",
      method: "POST",
      data,
    });
  },

  login(data: ILoginForm) {
    return request<IApiResponse<IAuthResponse>>({
      url: `${API_ENDPOINTS.AUTH}/login`,
      method: "POST",
      data,
    });
  },

  me() {
    return request<IApiResponse<ILoggedInUser>>({
      url: "/auth/me",
      method: "GET",
    });
  },
};
