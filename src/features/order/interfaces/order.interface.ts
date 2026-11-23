import type { IPageInfo } from "@/api/axios/base-res.interface";

export type OrderStatus =
  | "PREPARING"
  | "ON_THE_WAY"
  | "COMPLETED"
  | "CANCELLED";

export interface IOrderItem {
  id: string;
  coffeeId: string;
  variantId: string;
  name: string;
  size: string;
  image: string | null;
  price: string;
  originalPrice: string;
  discountAmount: string;
  offerTitle: string | null;
  quantity: number;
}

export interface IOrderStatusHistory {
  id: string;
  status: OrderStatus;
  changedBy: string | null;
  createdAt: string;
  changedByUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryAddressLabel: string | null;
  deliveryLatitude: number | null;
  deliveryLongitude: number | null;
  note: string | null;
  subtotal: string;
  discountTotal: string;
  deliveryFee: string;
  serviceFee: string;
  total: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNo: string | null;
  } | null;
  items: IOrderItem[];
  statusHistory: IOrderStatusHistory[];
}

export interface IOrderPage {
  data: IOrder[];
  pageInfo: IPageInfo;
}
