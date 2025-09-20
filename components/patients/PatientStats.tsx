"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DescriptiveStatCard } from "@/components/reports/DescriptiveStat";
import TimeSelector from "@/components/reports/TimeSelector";
import dayjs from "dayjs";
import { useTime } from "@/context/TimeContext";

export default function PatientStats({ id }: { id: string }) {
  const { timeState } = useTime();

  const { data: completedAppointmentsCount } = useQuery({
    queryKey: ["completedAppointmentsCount", id, timeState],
    queryFn: async () => {
      const startDate = dayjs(timeState?.from).startOf("day");
      const endDate = dayjs(timeState?.to).endOf("day");

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
    queryKey: ["pendingAppointmentsCount", id, timeState],
    queryFn: async () => {
      const startDate = dayjs(timeState?.from).startOf("day");
      const endDate = dayjs(timeState?.to).endOf("day");

      const supabase = createClient();

      const { count } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", id)
        .or("status.eq.scheduled,status.eq.rescheduled")
        .gte("date", startDate?.format("YYYY-MM-DD"))
        .lte("date", endDate?.format("YYYY-MM-DD"));

      return count || 0;
    },
  });

  const { data: totalPaymentsCount } = useQuery({
    queryKey: ["totalPaymentsCount", id, timeState],
    queryFn: async () => {
      const startDate = dayjs(timeState?.from).startOf("day");
      const endDate = dayjs(timeState?.to).endOf("day");

      const supabase = createClient();

      const res = await supabase
        .from("payments")
        .select("total:amount")
        .eq("patient_id", id)
        .gte("created_at", startDate?.format("YYYY-MM-DD HH:mm"))
        .lte("created_at", endDate?.format("YYYY-MM-DD HH:mm"));

      return res?.data?.reduce((acc, item) => acc + item?.total, 0) || 0;
    },
  });

  return (
    <>
      <div className="col-span-3">
        <TimeSelector />
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
        dataToShow={
          (totalPaymentsCount ? "₹ " + +totalPaymentsCount : 0) as string
        }
      />
    </>
  );
}
