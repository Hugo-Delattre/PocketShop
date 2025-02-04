"use client";

import { useGetKpis } from "@/lib/queries/kpis";
import { AverageCartPriceChart } from "../../components/charts/AverageCartPriceChart";
import { CheckoutTimeChart } from "../../components/charts/CheckoutTimeChart";
import { NbOutOfStockChart } from "../../components/charts/NbOutOfStockChart";
import { NewUsersChart } from "../../components/charts/NewUsersChart";

export function ChartsPage() {
  const { data, isLoading, error } = useGetKpis();

  if (error) {
    return <p>An error occured</p>;
  }

  if (!data || isLoading) {
    return <p>...loading</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <CheckoutTimeChart data={data} />
      <AverageCartPriceChart data={data} />
      <NbOutOfStockChart data={data} />
      <NewUsersChart data={data} />
    </div>
  );
}
