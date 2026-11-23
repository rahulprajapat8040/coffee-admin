import type { IPageInfo } from "@/api/axios/base-res.interface";

export type OfferTargetType =
  | "ALL_PRODUCTS"
  | "SELECTED_COFFEES"
  | "SELECTED_CATEGORIES";

export interface IOffer {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  targetType: OfferTargetType;
  coffeeIds: string[];
  categoryIds: string[];
  discountPercentage: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

export interface IOfferForm {
  title: string;
  description: string;
  image: string;
  targetType: OfferTargetType;
  coffeeIds: string[];
  categoryIds: string[];
  discountPercentage: number;
  startDate: string;
  endDate: string | null;
}

export interface IOfferPage {
  data: IOffer[];
  pageInfo: IPageInfo;
}
