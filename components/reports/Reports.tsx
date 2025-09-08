"use client";

import TimeSelector from "@/components/reports/TimeSelector";
import DescriptiveStatCards from "@/components/reports/DescriptiveStat";
import { ChartAreaInteractive } from "@/components/reports/ChartAreaInteractive";
import { useState } from "react";

export default function Reports() {
  const [timeRange, setTimeRange] = useState<string>("1d");

  return (
    <>
      <TimeSelector timeRange={timeRange} setTimeRangeAction={setTimeRange} />

      <DescriptiveStatCards timeRange={timeRange} />
      <ChartAreaInteractive timeRange={timeRange} />
    </>
  );
}
