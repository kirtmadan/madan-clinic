import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePenLine } from "lucide-react";

export default function OverdueBalance() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">Overdue Balance</CardTitle>

        <CardAction>
          <Button variant="outline" size="icon">
            <FilePenLine />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="w-full h-full flex items-start justify-center flex-col gap-2">
          <h2 className="font-medium text-3xl text-destructive/60">₹ 18,520</h2>

          <p className="text-muted-foreground text-sm">
            Last Updated on : 22-03-2023
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
