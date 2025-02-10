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

export const getCounts = async () => {
  return await apiClient({
    method: "get",
    url: `/kpis/counts`,
  });
};

export type getKpisByRangeQueryParams = {
  startDate: string;
  endDate?: string;
};

export const getKpisByRange = async ({
  startDate,
  endDate,
}: getKpisByRangeQueryParams) => {
  const end = endDate ? `&endDate=${endDate}` : "";
  return await apiClient({
    method: "get",
    url: `/kpis/range?startDate=${startDate}${end}`,
  });
};
