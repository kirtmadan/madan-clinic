"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useTime } from "@/context/TimeContext";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  payments: {
    label: "Payments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  chartData,
}: {
  chartData: { patients: string[]; chart: any };
}) {
  const { timeState } = useTime();

  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
  }

  if (!timeState?.from || !timeState?.to) return null;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Payments ( by patients )</CardTitle>
        {/*<CardDescription>*/}
        {/*  <span className="hidden @[540px]/card:block">*/}
        {/*    Total for the last 3 months*/}
        {/*  </span>*/}
        {/*  <span className="@[540px]/card:hidden">Last 3 months</span>*/}
        {/*</CardDescription>*/}
        <CardAction>
          {/*<ToggleGroup*/}
          {/*  type="single"*/}
          {/*  value={timeRange}*/}
          {/*  variant="outline"*/}
          {/*  className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"*/}
          {/*>*/}
          {/*  <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>*/}
          {/*  <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>*/}
          {/*  <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>*/}
          {/*</ToggleGroup>*/}
          {/*<Select value={timeRange} onValueChange={setTimeRange}>*/}
          {/*  <SelectTrigger*/}
          {/*    className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"*/}
          {/*    size="sm"*/}
          {/*    aria-label="Select a value"*/}
          {/*  >*/}
          {/*    <SelectValue placeholder="Last 3 months" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent className="rounded-xl">*/}
          {/*    <SelectItem value="90d" className="rounded-lg">*/}
          {/*      Last 3 months*/}
          {/*    </SelectItem>*/}
          {/*    <SelectItem value="30d" className="rounded-lg">*/}
          {/*      Last 30 days*/}
          {/*    </SelectItem>*/}
          {/*    <SelectItem value="7d" className="rounded-lg">*/}
          {/*      Last 7 days*/}
          {/*    </SelectItem>*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <BarChart data={chartData?.chart} margin={{ left: 30, right: 30 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              scale="band"
              interval={
                1 // Number(timeRange?.slice(0, timeRange?.length - 1)) - 2
              }
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {chartData?.patients?.map((patient) => (
              <Bar
                key={patient}
                dataKey={patient}
                stackId="a"
                fill={stringToColor(patient)}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
