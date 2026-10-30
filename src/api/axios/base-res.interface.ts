export interface IApiResponse<T> {
  message: string;
  status: number;
  success: boolean;
  data: T;
}

export interface IPageInfo {
  total: number;
  page: number;
  totalPage: number;
  limit: number;
}

export interface IPaginationQuery {
  limit?: number;
  cursor?: string;
  page?: number;
  search?: string;
}

export interface ICursorRes {
  nextCursor: string | null;
  hasMore: boolean;
}
