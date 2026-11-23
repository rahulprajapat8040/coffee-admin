export interface IDashboardCards {
  counts: {
    users: number;
    devices: number;
    categories: number;
    coffees: number;
    variants: number;
    carts: number;
    addresses: number;
    wishlists: number;
    orders: number;
    orderItems: number;
    orderStatuses: number;
    offers: number;
  };
  openOrders: number;
  completedOrders: number;
  revenue: number;
}

export type DashboardOrderStatus =
  | "PREPARING"
  | "ON_THE_WAY"
  | "COMPLETED"
  | "CANCELLED";

export interface IDashboardAnalytics {
  revenueTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  orderStatuses: Array<{
    status: DashboardOrderStatus;
    count: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
  }>;
  recentOrders: Array<{
    id: string;
    status: DashboardOrderStatus;
    total: number;
    createdAt: string;
    customerName: string;
  }>;
}
