import type { IPageInfo } from "@/api/axios/base-res.interface";
import type { VariantStatus } from "@/lib/utils/enum";

export interface ICoffeeRes {
  data: ICoffee[];
  pageInfo: IPageInfo;
}

export interface ICoffee {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  category: Category;
  variants: Variant[];
}

export interface Category {
  name: string;
}

export interface Variant {
  id: string;
  size: string;
  price: string;
  status: VariantStatus;
}
