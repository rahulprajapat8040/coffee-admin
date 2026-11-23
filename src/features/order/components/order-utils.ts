import type { OrderStatus } from "../interfaces/order.interface";

export const statuses: OrderStatus[] = ["PREPARING", "ON_THE_WAY", "COMPLETED", "CANCELLED"];

export const money = (value: string | number) => `$${Number(value).toFixed(2)}`;

export const readableStatus = (status: OrderStatus) =>
  status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());

export const dateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
