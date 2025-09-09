"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DescriptiveStatCard } from "@/components/reports/DescriptiveStat";
import TimeSelector from "@/components/reports/TimeSelector";
import dayjs from "dayjs";

export default function PatientStats({ id }: { id: string }) {
  const [timeRange, setTimeRange] = useState<string>("1d");

  const { data: completedAppointmentsCount } = useQuery({
    queryKey: ["completedAppointmentsCount", id, timeRange],
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

      const { count } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", id)
        .eq("status", "completed")
        .gte("date", startDate?.format("YYYY-MM-DD"))
        .lte("date", endDate?.format("YYYY-MM-DD"));

      return count || 0;
    },
  });

  const { data: pendingAppointmentsCount } = useQuery({
    queryKey: ["pendingAppointmentsCount", id, timeRange],
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

      const { count } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", id)
        .neq("status", "completed")
        .gte("date", startDate?.format("YYYY-MM-DD"))
        .lte("date", endDate?.format("YYYY-MM-DD"));

      return count || 0;
    },
  });

  const { data: totalPaymentsCount } = useQuery({
    queryKey: ["totalPaymentsCount", id, timeRange],
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

      const res = await supabase
        .from("payments")
        .select("total:amount")
        .eq("patient_id", id)
        .gte("created_at", startDate?.format("YYYY-MM-DD"))
        .lte("created_at", endDate?.format("YYYY-MM-DD"));

      return res?.data?.reduce((acc, item) => acc + item?.total, 0) || 0;
    },
  });

  console.log({ totalPaymentsCount });

  return (
    <>
      <div className="col-span-3">
        <TimeSelector timeRange={timeRange} setTimeRangeAction={setTimeRange} />
      </div>

      <DescriptiveStatCard
        title="Completed Appointments"
        description={`Total appointments completed`}
        dataToShow={completedAppointmentsCount as number}
      />

      <DescriptiveStatCard
        title="Pending Appointments"
        description={`Total appointments pending`}
        dataToShow={pendingAppointmentsCount as number}
      />

      <DescriptiveStatCard
        title="Total Payments"
        description={`Total payments made`}
        dataToShow={("₹ " + totalPaymentsCount) as string}
      />
    </>
  );
}
