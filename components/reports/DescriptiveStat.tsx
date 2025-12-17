"use client";

import { TrendingUpIcon, TrendingDownIcon, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTime } from "@/context/TimeContext";
import dayjs from "dayjs";
import { createClient } from "@/lib/supabase/client";

export default function DescriptiveStatCards() {
  const { timeState, reportsData, setReportsData } = useTime();

  useQuery({
    queryKey: ["appointmentStats", timeState],
    queryFn: async () => {
      const startDate = dayjs(timeState?.from).startOf("day");
      const endDate = dayjs(timeState?.to).endOf("day");

      const supabase = createClient();

      try {
        const { count } = await supabase
          .from("appointments")
          .select("status, patient:patient_id (id, name), id, date", {
            count: "exact",
            head: true,
          })
          .eq("status", "completed")
          .gte("date", startDate?.format("YYYY-MM-DD"))
          .lte("date", endDate?.format("YYYY-MM-DD"));

        if (count) {
          setReportsData((prev) => ({
            ...(prev || {}),
            totalCompletedAppointments: count,
          }));

          return count;
        }

        return 0;
      } catch (error) {
        console.log(error);
        return 0;
      }
    },
  });

  if (!timeState?.from || !timeState?.to)
    return (
      <div className="w-full h-full border bg-card max-w-xl mx-auto border-dashed flex flex-col gap-4 rounded-lg p-12">
        <div className="flex items-center justify-center gap-4">
          <InfoIcon />
          <p className="text-sm">Select a date range to view the reports</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
        <DescriptiveStatCard
          title="Total Payments"
          description={`Total payments made`}
          dataToShow={
            "₹ " + (reportsData?.totalPayments || 0)?.toLocaleString("en-IN")
          }
        />

        <DescriptiveStatCard
          title="Completed Appointments"
          description={`Total appointments completed`}
          dataToShow={(
            reportsData?.totalCompletedAppointments || 0
          )?.toLocaleString("en-IN")}
        />
      </div>
    </>
  );
}

export function DescriptiveStatCard({
  title,
  description,
  dataToShow,
  percentChange,
}: {
  title: string;
  description: string;
  dataToShow: string | number;
  percentChange?: number | null | undefined;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {dataToShow}
        </CardTitle>

        {percentChange !== null && percentChange !== undefined && (
          <CardAction>
            <Badge variant="outline">
              {percentChange < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
              {percentChange ?? 0}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          {description?.replace("_", " ")}
        </div>
      </CardFooter>
    </Card>
  );
}
