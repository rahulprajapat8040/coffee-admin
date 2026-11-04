
export interface ISearchParam {
    page: number
    limit: number
    search?: string
}

export interface ICoffeeQuery extends ISearchParam {
  categoryId?: string;
}