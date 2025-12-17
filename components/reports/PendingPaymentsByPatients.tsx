"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useTime } from "@/context/TimeContext";
import PendingPaymentsTable from "@/components/reports/PendingPaymentsTable";

export default function PendingPaymentsByPatients() {
  const { setReportsData } = useTime();

  const { data: chartData } = useQuery({
    queryKey: ["pendingPatientsOverdueCharts"],
    queryFn: async () => {
      const supabase = createClient();

      try {
        const query = supabase
          .from("patient_overdue_summary")
          .select("patient_id, outstanding")
          .gt("outstanding", 0);

        // Then fetch full patient details for those IDs

        const { data: overdue, error: payErr } = await query;

        const patientIds =
          overdue?.filter(Boolean)?.map((s) => s.patient_id) || [];

        const { data: patients } = await supabase
          .from("patients")
          .select("id, name, status")
          .in("id", patientIds);

        if (payErr) throw payErr;

        let totalPendingPaymentsByActivePatients = 0;
        let totalPendingPaymentsByCompletedPatients = 0;

        const result = overdue?.filter(Boolean)?.map((o) => ({
          ...(o || {}),
          patient: patients?.find((p: any) => p?.id === o?.patient_id),
        }));

        for (let i = 0; i < result?.length; i++) {
          const rec: any = result[i];

          if (rec?.patient?.status === "completed") {
            totalPendingPaymentsByCompletedPatients += rec.outstanding || 0;
          } else {
            totalPendingPaymentsByActivePatients += rec.outstanding || 0;
          }
        }

        setReportsData((prev) => ({
          ...prev,
          totalPendingPaymentsByActivePatients,
          totalPendingPaymentsByCompletedPatients,
        }));

        return result || [];
      } catch (error) {
        console.error("Error fetching chart data:", error);
        return [];
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4"></div>

      <PendingPaymentsTable
        events={
          chartData?.filter((x) => x?.patient?.status !== "completed") ?? []
        }
        title={"Pending Payments by Active Patients"}
      />

      <PendingPaymentsTable
        events={
          chartData?.filter((x) => x?.patient?.status === "completed") ?? []
        }
        title={"Pending Payments by Completed Patients"}
      />
    </div>
  );
}
