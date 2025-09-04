"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { getData } from "@/lib/actions/supabase.actions";
import { useQuery } from "@tanstack/react-query";

interface PatientOverdueBalanceProps {
  id: string;
  overdueUpdatedAt?: string | null;
}

export default function OverdueBalance({ id }: PatientOverdueBalanceProps) {
  const { data: total } = useQuery({
    queryKey: ["patientsOverdueAmount", id],
    queryFn: async () => {
      const data = await getData({
        tableName: "patient_overdue_summary",
        documentId: id,
        select: `*`,
        comparisonKey: "patient_id",
      });

      return data?.outstanding ?? data?.authorized_total ?? 0;
    },
    enabled: !!id,
  });

  return (
    <Card className="overflow-hidden max-md:h-full max-md:pb-0!">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">Overdue Balance</CardTitle>

        {/*<CardAction>*/}
        {/*  {overdueUpdatedAt && (*/}
        {/*    <p className="text-muted-foreground text-sm">*/}
        {/*      Last Updated on :{" "}*/}
        {/*      {dayjs(overdueUpdatedAt).format("DD MMM YYYY HH:mm")}*/}
        {/*    </p>*/}
        {/*  )}*/}
        {/*</CardAction>*/}
      </CardHeader>

      <CardContent>
        <div className="w-full pb-0 h-full flex items-start justify-center flex-col gap-2">
          <h2
            className={cn(
              "font-medium text-3xl text-destructive/60",
              total === 0 && "text-primary",
            )}
          >
            ₹ {total ?? 0}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
