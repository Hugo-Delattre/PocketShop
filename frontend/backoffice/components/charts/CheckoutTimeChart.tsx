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

function msToMinSec(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}.${seconds.padStart(2, "0")}`;
}

export function CheckoutTimeChart({
  data,
}: {
  data: { date: string; timeSpentBeforePay: number }[];
}) {
  const mapedData = data.map((obj) => ({
    ...obj,
    timeSpentBeforePay: msToMinSec(obj.timeSpentBeforePay),
  }));

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Time spent before order checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={mapedData}
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
              dataKey="timeSpentBeforePay"
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
