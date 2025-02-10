"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  timeSpentBeforePay: {
    label: "Time spent before order checkout",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function NbOutOfStockChart({
  data,
}: {
  data: { date: string; nbOutOfStock: number }[];
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Number of product out of stock</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              dataKey="nbOutOfStock"
              type="bump"
              fill="#c880db"
              fillOpacity={0.4}
              stroke="#c823f1"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
