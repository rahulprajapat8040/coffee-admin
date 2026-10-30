import type { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";

export interface IUploadResponse {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

interface UploadFileVariables {
  file: File;
  endpoint: string;
}

export const fileApi = {
  async uploadFile({ endpoint, file }: UploadFileVariables) {
    const formData = new FormData();

    formData.append("file", file);
    return request<IApiResponse<IUploadResponse>>({
      url: endpoint,
      data: formData,
      method: "POST",
    });
  },

  async removeFile(url: string) {
    return request({ url: `files/delete-by-url?url=${url}`, method: "DELETE" });
  },
};