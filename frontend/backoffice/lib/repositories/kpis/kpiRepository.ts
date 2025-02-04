import apiClient from "../apiClient";

export type Kpi = {
  date: string;
  nbOutOfStock: number;
  newUser: number;
  timeSpentBeforePay: number;
  averageCartPrice: number;
  productsOutOfStockIds: number[];
};

export const getKpis = async () => {
  return await apiClient({
    method: "get",
    url: `/kpis`,
  });
};
