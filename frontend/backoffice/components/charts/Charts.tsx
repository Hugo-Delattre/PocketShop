import { useGetKpisByRange } from "@/lib/queries/kpis";
import { AverageCartPriceChart } from "./AverageCartPriceChart";
import { CheckoutTimeChart } from "./CheckoutTimeChart";
import { NbOutOfStockChart } from "./NbOutOfStockChart";
import { NewUsersChart } from "./NewUsersChart";

import { DateRange } from "react-day-picker";

interface ChartsProps {
  dateRange?: DateRange;
}

export function Charts({ dateRange }: ChartsProps) {
  const { data, isLoading, error } = useGetKpisByRange({
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  if (error) {
    return <p>An error occured</p>;
  }

  if (!data || isLoading) {
    return <p>...loading</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-6 mt-4">
      <CheckoutTimeChart data={data} />
      <AverageCartPriceChart data={data} />
      <NbOutOfStockChart data={data} />
      <NewUsersChart data={data} />
    </div>
  );
}
