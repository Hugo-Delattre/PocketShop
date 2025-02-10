import { useQuery } from "@tanstack/react-query";
import {
  getCounts,
  getKpis,
  getKpisByRange,
  getKpisByRangeQueryParams,
  Kpi,
} from "../repositories/kpis/kpiRepository";

export function useGetKpis() {
  return useQuery<Kpi[]>({
    queryKey: ["getKpis"],
    staleTime: 20000,
    queryFn: () => getKpis().then((res) => res.data),
  });
}

export function useGetCounts() {
  return useQuery<{ totalUsers: number; totalProducts: number }>({
    queryKey: ["getCounts"],
    staleTime: 20000,
    queryFn: () => getCounts().then((res) => res.data),
  });
}

export function useGetKpisByRange(params: Partial<getKpisByRangeQueryParams>) {
  let hasNoStartDate = false;
  if (params.startDate === undefined) {
    hasNoStartDate = true;
  }

  return useQuery<Kpi[]>({
    queryKey: ["getKpisByRange", params.startDate, params.endDate],
    staleTime: 5000,
    queryFn: () => {
      if (hasNoStartDate) {
        return getKpis().then((res) => res.data);
      }
      return getKpisByRange(params as getKpisByRangeQueryParams).then(
        (res) => res.data
      );
    },
  });
}
