"use client";

import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useTime } from "@/context/TimeContext";
import { ChartAreaInteractive } from "@/components/reports/ChartAreaInteractive";
import PaymentsTable from "@/components/reports/PaymentsTable";

export default function PaymentsByPatients() {
  const { timeState, paymentType, setReportsData } = useTime();

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
    queryKey: ["patientPaymentsChart", timeState, paymentType],
    queryFn: async () => {
      const startDate = dayjs(timeState?.from).startOf("day");
      const endDate = dayjs(timeState?.to).endOf("day");

      const supabase = createClient();

      try {
        const query = supabase
          .from("payments")
          .select("created_at, amount, patient:patient_id (id, name)")
          .eq("method", paymentType)
          .gte("created_at", startDate?.format("YYYY-MM-DD HH:mm"))
          .lte("created_at", endDate?.format("YYYY-MM-DD HH:mm"));

        const { data: pays, error: payErr } = await query;

        if (payErr) throw payErr;

        const paymentsByDayAndPatient: Record<
          string,
          Record<string, number>
        > = {};

        const patients =
          Array.from(
            new Set(pays?.map((p: any) => p.patient?.name || "Unknown")),
          ) || [];

        let totalPayments = 0;

        pays?.forEach((p: any) => {
          const day = dayjs(p.created_at).format("YYYY-MM-DD");
          const patientName = p.patient?.name || "Unknown";

          if (!paymentsByDayAndPatient[day]) {
            paymentsByDayAndPatient[day] = {};
          }

          if (p.amount > 0) {
            paymentsByDayAndPatient[day][patientName] =
              (paymentsByDayAndPatient[day][patientName] || 0) + p.amount;

            totalPayments += p.amount;
          }
        });

        const allDates = generateArrOfDates(startDate, endDate);
        setReportsData((prev) => ({ ...prev, totalPayments }));

        return {
          chart: allDates?.map((date) => ({
            date,
            ...(paymentsByDayAndPatient[date] || {}),
          })),
          patients,
        };
      } catch (error) {
        console.error("Error fetching chart data:", error);
        return { chart: [], patients: [] };
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4"></div>

      <PaymentsTable
        events={
          chartData?.chart?.filter((i) => Object.keys(i).length > 1) ?? []
        }
      />

      <ChartAreaInteractive
        chartData={chartData as { chart: any; patients: string[] }}
      />
    </div>
  );
}
