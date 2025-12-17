"use client";

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
import { useTime } from "@/context/TimeContext";

export default function DescriptivePendingStatCards() {
  const { reportsData } = useTime();

  return (
    <>
      <div className="*:data-[slot=card]:from-destructive/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
        <DescriptiveStatCard
          title="Active Patients"
          description={`Total payments pending by patients which are still active`}
          dataToShow={
            "₹ " +
            (
              reportsData?.totalPendingPaymentsByActivePatients || 0
            )?.toLocaleString("en-IN")
          }
        />

        <DescriptiveStatCard
          title="Completed Patients"
          description={`Total payments pending by patients which are completed`}
          dataToShow={
            "₹ " +
            (
              reportsData?.totalPendingPaymentsByCompletedPatients || 0
            )?.toLocaleString("en-IN")
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
