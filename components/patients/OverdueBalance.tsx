"use client";

// import { Button } from "@/components/ui/button";
import {
  Card,
  // CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { FilePenLine } from "lucide-react";
// import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { getData } from "@/lib/actions/supabase.actions";
import { useQuery } from "@tanstack/react-query";

interface PatientOverdueBalanceProps {
  overdueAmount: number;
  id?: string;
  overdueUpdatedAt?: string | null;
}

export default function OverdueBalance({
  overdueAmount,
  id,
  // overdueUpdatedAt,
}: PatientOverdueBalanceProps) {
  const { data: total } = useQuery({
    queryKey: ["patientsOverdue", id],
    queryFn: async () => {
      const data: any = await getData({
        tableName: "patients",
        // @ts-expect-error - id is not null
        documentId: id,
        select: `
        id,
        treatment_plans (
          id,
          authorized_amount,
          status,
          paid_total,
          treatment_plan_items (
            quantity,
            recorded_unit_price
          )
        )
    `,
      });

      return (
        data?.treatment_plans
          ?.filter((plan: any) => plan?.status !== "paid") // exclude fully paid
          ?.reduce((grandTotal: number, plan: any) => {
            // Decide whether to use authorized_amount or compute from items
            const planAuthorizedOrCalc =
              plan?.authorized_amount ??
              plan?.treatment_plan_items?.reduce(
                (total: number, item: any) =>
                  total + item?.quantity * item?.recorded_unit_price,
                0,
              );

            let overdue = 0;

            if (plan?.status === "partially_paid") {
              overdue = planAuthorizedOrCalc - (plan?.paid_total ?? 0);
            } else {
              // for unpaid → take full amount
              overdue = planAuthorizedOrCalc;
            }

            return grandTotal + overdue;
          }, 0) || 0
      );
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
              overdueAmount === 0 && "text-primary",
            )}
          >
            ₹ {id ? total : overdueAmount ? overdueAmount : 0}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
