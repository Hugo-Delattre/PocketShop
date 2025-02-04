"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  users: {
    label: "Users",
    color: "#433bac",
  },
} satisfies ChartConfig;

export function NewUsersChart({
  data,
}: {
  data: { date: string; newUser: number }[];
}) {
  const total = data.reduce((acc, curr) => acc + curr.newUser, 0);

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">{"New Users"}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value.split(" - ").join("/"));
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="w-[150px]" nameKey="newUser" />
              }
              labelFormatter={(value) => {
                const date = new Date(value.split(" - ").join("/"));
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Bar dataKey="newUser" fill={`var(--color-users)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
