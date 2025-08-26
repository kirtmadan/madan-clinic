import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePenLine } from "lucide-react";
import PatientAppointmentsTable from "@/components/patients/PatientAppointmentsTable";

export default function PatientAppointments({ id }: { id: string }) {
  return (
    <Card className="overflow-hidden pb-0!">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">
          Recent Appointments
        </CardTitle>

        {/*<CardAction>*/}
        {/*  <Button variant="outline" size="icon">*/}
        {/*    <FilePenLine />*/}
        {/*  </Button>*/}
        {/*</CardAction>*/}
      </CardHeader>

      <CardContent className="p-0!">
        <div className="w-full h-full">
          <PatientAppointmentsTable id={id} />
        </div>
      </CardContent>
    </Card>
  );
}
