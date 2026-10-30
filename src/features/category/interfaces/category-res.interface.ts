import type { IPageInfo } from "@/api/axios/base-res.interface"


export interface ICategoryRes {
  data: ICategory[];
  pageInfo: IPageInfo;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}