export type OrderByField = string;
export type OrderByDirection = "asc" | "desc";

export interface OrderBy {
  field: OrderByField;
  direction: OrderByDirection;
}
