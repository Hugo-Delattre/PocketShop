import { useQuery } from "@tanstack/react-query";
import { getKpis, Kpi } from "../repositories/kpis/kpiRepository";

export function useGetKpis() {
  return useQuery<Kpi[]>({
    queryKey: ["getKpis"],
    staleTime: 20000,
    queryFn: () => getKpis().then((res) => res.data),
  });
}
