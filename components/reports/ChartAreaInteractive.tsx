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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { createClient } from "@/lib/supabase/client";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  completedAppointments: {
    label: "Completed Appointments",
    color: "var(--primary)",
  },
  payments: {
    label: "Payments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ timeRange }: { timeRange: string }) {
  function generateArrOfDates(start: Dayjs, end: Dayjs) {
    const dates = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    return dates;
  }

  const { data: chartData } = useQuery({
    queryKey: ["appointmentsChart", timeRange],
    queryFn: async () => {
      let startDate = dayjs().startOf("month");
      let endDate = dayjs().endOf("month");

      if (timeRange === "1d") {
        startDate = dayjs().startOf("day");
        endDate = dayjs().endOf("day");
      } else if (timeRange === "7d") {
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
      }

      const supabase = createClient();

      try {
        // 1️⃣ Completed Appointments
        const { data: appts, error: apptErr } = await supabase
          .from("appointments")
          .select("date")
          .eq("status", "completed")
          .gte("date", startDate?.format("YYYY-MM-DD"))
          .lte("date", endDate?.format("YYYY-MM-DD"));

        if (apptErr) throw apptErr;

        // Count per day
        const appointmentsByDay: Record<string, number> = {};

        appts?.forEach((a) => {
          const day = dayjs(a.date).format("YYYY-MM-DD");
          appointmentsByDay[day] = (appointmentsByDay[day] || 0) + 1;
        });

        // 2️⃣ Payments

        const { data: pays, error: payErr } = await supabase
          .from("payments")
          .select("created_at, amount")
          .gte("created_at", startDate?.format("YYYY-MM-DD"))
          .lte("created_at", endDate?.format("YYYY-MM-DD"));

        if (payErr) throw payErr;

        const paymentsByDay: Record<string, number> = {};
        pays?.forEach((p: any) => {
          const day = dayjs(p.created_at).format("YYYY-MM-DD");
          paymentsByDay[day] = (paymentsByDay[day] || 0) + p.amount;
        });

        // 3️⃣ Merge both into final chart data array
        const allDates = generateArrOfDates(startDate, endDate);

        return allDates?.map((day) => ({
          date: day,
          completedAppointments: appointmentsByDay[day] || 0,
          payments: paymentsByDay[day] || 0,
        }));
      } catch (error) {
        console.error("Error fetching chart data:", error);
        return [];
      }
    },
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Payments &amp; Completed Appointments</CardTitle>
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
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={
                timeRange === "30d" ? 1 : 0
                // Number(timeRange?.slice(0, timeRange?.length - 1)) - 2
              }
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            {/*<YAxis />*/}
            <ChartLegend content={<ChartLegendContent />} />

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

            <Bar
              dataKey="payments"
              // type="natural"
              fill="var(--color-blue-500)"
              // stroke="var(--color-mobile)"
              stackId="a"
              maxBarSize={24}
            />

            <Bar
              dataKey="completedAppointments"
              fill="var(--primary)"
              // type="natural"
              // stroke="var(--color-desktop)"
              stackId="ab"
              maxBarSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
