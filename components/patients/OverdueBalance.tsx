import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePenLine } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface PatientOverdueBalanceProps {
  overdueAmount: number;
  overdueUpdatedAt: string | null;
}

export default function OverdueBalance({
  overdueAmount,
  overdueUpdatedAt,
}: PatientOverdueBalanceProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">Overdue Balance</CardTitle>

        <CardAction>
          {overdueUpdatedAt && (
            <p className="text-muted-foreground text-sm">
              Last Updated on :{" "}
              {dayjs(overdueUpdatedAt).format("DD MMM YYYY HH:mm")}
            </p>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="w-full pb-6 h-full flex items-start justify-center flex-col gap-2">
          <h2
            className={cn(
              "font-medium text-3xl text-destructive/60",
              overdueAmount === 0 && "text-primary",
            )}
          >
            ₹ {overdueAmount}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
