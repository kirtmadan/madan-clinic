import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
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
import {
  fetchAppointmentStats,
  fetchPaymentStats,
} from "@/lib/actions/supabase.actions";

export default function DescriptiveStatCards({
  timeRange,
}: {
  timeRange: string;
}) {
  const { data } = useQuery({
    queryKey: ["cardStats"],
    queryFn: async () => {
      return await fetchPaymentStats();
    },
  });

  const { data: appointmentStats } = useQuery({
    queryKey: ["appointmentStats"],
    queryFn: async () => {
      return await fetchAppointmentStats();
    },
  });

  const localMap: Record<string, string> = {
    "1d": "today",
    "7d": "this_week",
    "30d": "this_month",
  };

  const getDataKey = (timeRange: string, type: string) => {
    switch (timeRange) {
      case "1d":
        if (type === "percent_change") return "today_vs_yesterday_percent";
        return "today";

      case "7d":
        if (type === "percent_change") return "this_week_vs_last_week_percent";
        return "this_week";

      case "30d":
        if (type === "percent_change")
          return "this_month_vs_last_month_percent";
        return "this_month";

      default:
        return "today_total";
    }
  };

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
        <DescriptiveStatCard
          title="Total Payments"
          description={`Total payments made ${localMap[timeRange]}`}
          dataToShow={
            "₹ " + (data?.[getDataKey(timeRange, "total") + "_total"] || 0)
          }
          percentChange={data?.[getDataKey(timeRange, "percent_change")]}
        />

        <DescriptiveStatCard
          title="Completed Appointments"
          description={`Total appointments completed ${localMap[timeRange]}`}
          dataToShow={
            appointmentStats?.[
              getDataKey(timeRange, "completed") + "_completed"
            ] || 0
          }
          percentChange={
            appointmentStats?.[getDataKey(timeRange, "percent_change")]
          }
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
