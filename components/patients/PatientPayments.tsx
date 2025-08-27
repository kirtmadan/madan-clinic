import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatientPaymentsTable from "@/components/patients/PatientPaymentsTable";

export default function PatientPayments({ id }: { id: string }) {
  return (
    <Card className="overflow-hidden pb-0!">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">
          Payment Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0!">
        <div className="w-full h-full">
          <PatientPaymentsTable id={id} />
        </div>
      </CardContent>
    </Card>
  );
}
